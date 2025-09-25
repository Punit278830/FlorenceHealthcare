using Hl7.Fhir.ElementModel.Types;
using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using System;
using DateTime = System.DateTime;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class InvoiceInfoesController : WithHospitalController
  {
    private new readonly FlorenceDbContext _context;

    public InvoiceInfoesController(FlorenceDbContext context) : base(context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<InvoiceSummaryResponse> GetInvoiceWithPaymentsAsync(
    [FromQuery] string paymentMode,
    [FromQuery] string paymentStatus,
    [FromQuery] string fromDate,
    [FromQuery] string toDate,
    [FromQuery] int skip = 0,
    [FromQuery] int pageSize = 100)
    {
      // Start building the query for invoices
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.InvoiceInfos
          .Where(i => i.IsDeleted != true && (hospitalId == null || i.HospitalId == hospitalId))
          .AsQueryable();

      // Apply filters based on paymentMode parameter
      if (!string.IsNullOrEmpty(paymentMode) && paymentMode.ToLower() != "all")
      {
        query = query.Where(invoice => _context.PaymentModeInfo
            .Where(pm => pm.InvoiceId == invoice.InvoiceId)
            .Select(pm => pm.PaymentMode.ToLower())
            .Distinct()
            .Contains(paymentMode.ToLower())); // Filter by the specified payment mode
      }

      // Parse the fromDate and toDate just once at the beginning.
      var fromDateParsed = DateTime.Parse(fromDate).Date;
      var toDateParsed = DateTime.Parse(toDate).Date.AddDays(1);

      // Apply date filtering for paymentDate in PaymentModeInfo instead of invoice.CreatedDate
      query = query.Where(invoice => _context.PaymentModeInfo
          .Any(pm => pm.InvoiceId == invoice.InvoiceId &&
                     pm.PaymentDate.HasValue &&
                     pm.PaymentDate.Value.Date >= fromDateParsed &&
                     pm.PaymentDate.Value.Date <= toDateParsed));

      // Apply paymentStatus filtering
      if (paymentStatus.ToLower() != "all")
      {
        query = query.Where(invoice => invoice.Status != null && invoice.Status.ToLower() == paymentStatus.ToLower());
      }

      // Retrieve invoice data and payment details
      var invoices = await query
          .OrderByDescending(o => o.InvoiceId)
          .Skip(skip)
          .Take(pageSize)
          .Select(invoice => new InvoiceInfoResponse
          {
            InvoiceId = invoice.InvoiceId,
            AppointmentId = invoice.AppointmentId,
            PatientId = invoice.PatientId,
            CreatedDate = invoice.CreatedDate,

            // Set Amount to the total of base amount + additional items' amounts
            Amount = invoice.Amount + _context.AdditionalInvoiceItems
                      .Where(ai => ai.InvoiceId == invoice.InvoiceId)
                      .Sum(ai => ai.FinalAmount) ?? 0,  // Sum of additional item amounts; handle null case

            Status = invoice.Status,

            // Payment details for the invoice
            PaymentDetails = _context.PaymentModeInfo
                      .Where(pm => pm.InvoiceId == invoice.InvoiceId)
                      .Select(pm => new PaymentModeInfoResponse
                      {
                        PaymentId = pm.PaymentId,
                        PaymentMode = pm.PaymentMode,
                        TransactionId = pm.TransactionId,
                        PaymentDate = pm.PaymentDate,
                        Amount = pm.Amount
                      }).ToList(),

            // Concatenated list of payment modes for the invoice
            PaymentModes = _context.PaymentModeInfo
                      .Where(pm => pm.InvoiceId == invoice.InvoiceId)
                      .Select(pm => pm.PaymentMode)
                      .Distinct()
                      .Any() ? string.Join(", ", _context.PaymentModeInfo
                      .Where(pm => pm.InvoiceId == invoice.InvoiceId)
                      .Select(pm => pm.PaymentMode)
                      .Distinct()) ?? string.Empty : string.Empty,

            // Total unpaid amount calculation: Amount - total paid from PaymentDetails
            TotalUnpaidAmount = invoice.Amount + _context.AdditionalInvoiceItems
                      .Where(ai => ai.InvoiceId == invoice.InvoiceId)
                      .Sum(ai => ai.FinalAmount) - _context.PaymentModeInfo
                      .Where(pm => pm.InvoiceId == invoice.InvoiceId)
                      .Sum(pm => pm.Amount) ?? 0
          })
          .ToListAsync();

      // Aggregating totals for online, cash, and all payments across all invoices
      var totalOnlineAmount = invoices.Sum(inv => inv.PaymentDetails
          .Where(pm => pm.PaymentMode?.ToLower() == "online")
          .Sum(pm => pm.Amount)) ?? 0;

      var totalCashAmount = invoices.Sum(inv => inv.PaymentDetails
          .Where(pm => pm.PaymentMode?.ToLower() == "cash")
          .Sum(pm => pm.Amount)) ?? 0;

      var totalAmount = invoices.Sum(inv => inv.PaymentDetails
          .Sum(pm => pm.Amount)) ?? 0; // Sum of all payment amounts for all invoices

      // Returning the result with summary data
      return new InvoiceSummaryResponse
      {
        Invoices = invoices,              // Return the list of invoices
        TotalOnlineAmount = totalOnlineAmount,  // Sum of online payments
        TotalCashAmount = totalCashAmount,      // Sum of cash payments
        TotalAmount = totalAmount,              // Total of all payments
        TotalCount = await query.CountAsync()   // Add total count for pagination
      };
    }

    [HttpGet("GetInvoicesForToday")]
    public async Task<IActionResult> GetInvoicesForTodayAsync()
    {
      // Get today's date as DateTime
      var today = DateTime.Today;
      var hospitalId = GetHospitalIdFromHeader();
      // Retrieve invoices with patient data for today
      var invoicesToday = await _context.InvoiceInfos
          .Where(invoice => invoice.CreatedDate.HasValue && invoice.CreatedDate.Value.Date == today && invoice.IsDeleted != true && (hospitalId == null || invoice.HospitalId == hospitalId))
          .Join(
              _context.PatientInfos,
              invoice => invoice.PatientId,
              patient => patient.PatientId,
              (invoice, patient) => new
              {
                invoice.InvoiceId,
                PatientName = patient.FirstName + " " + patient.LastName,
                invoice.Amount,
                invoice.Status
              })
          .ToListAsync();

      // Return an empty list if no invoices found (instead of 404)
      // This prevents frontend errors when there are no invoices for today
      return Ok(invoicesToday);
    }


    [HttpGet("by-invoice-id/{invoiceId}")]
    public async Task<ActionResult<InvoiceInfo>> GetInvoiceInfoByInvoiceId(int invoiceId)
    {
      try
      {
        var hospitalId = GetHospitalIdFromHeader();
        var invoiceInfo = await _context.InvoiceInfos
          .Where(i => i.InvoiceId == invoiceId && i.IsDeleted != true && (hospitalId == null || i.HospitalId == hospitalId))
          .Select(i => new InvoiceInfo
          {
            InvoiceId = i.InvoiceId,
            PatientId = i.PatientId,
            AppointmentId = i.AppointmentId,
            CreatedDate = i.CreatedDate,
            Amount = i.Amount,
            Status = i.Status,
            IsConsultationPaid = i.IsConsultationPaid,
            HospitalId = i.HospitalId, // Include HospitalId in the response
            TransactionId = (i.IsConsultationPaid == true)
              ? _context.PaymentModeInfo
                  .Where(p => p.InvoiceId == i.InvoiceId && p.ItemName == "Consultation")
                  .OrderByDescending(p => p.PaymentDate)
                  .Select(p => p.TransactionId)
                  .FirstOrDefault()
              : null,
            PreviousAppointmentDate = _context.AppointmentInfos
                .Where(a => a.PatientId == i.PatientId
                    && a.DoctorId == _context.AppointmentInfos
                        .Where(ap => ap.Id == i.AppointmentId)
                        .Select(ap => ap.DoctorId)
                        .FirstOrDefault()
                    && a.Id != i.AppointmentId
                    && a.Date < _context.AppointmentInfos
                        .Where(ap => ap.Id == i.AppointmentId)
                        .Select(ap => ap.Date)
                        .FirstOrDefault())
                .OrderByDescending(a => a.Date)
                .Select(a => (DateTime?)a.Date)
                .FirstOrDefault(),
            InvoiceDate = _context.InvoiceInfos
                .Where(i => i.InvoiceId == invoiceId && i.IsDeleted != true)
                .Select(i => (DateTime?)i.CreatedDate)
                .FirstOrDefault() ?? DateTime.UtcNow.Date, // Default to current date if no date found
          })
          .FirstOrDefaultAsync();

        if (invoiceInfo != null && invoiceInfo.IsConsultationPaid == true)
        {
          var tempRes = await this.GetPaymentModeInfoByInvoiceId(invoiceId);
          if (tempRes.Count > 0)
          {
            if (tempRes[0].TransactionId != null)
            {
              invoiceInfo.TransactionId = tempRes[0].TransactionId;
            }
            else
            {
              invoiceInfo.TransactionId = "Cash";
            }
          }
          else
          {
            invoiceInfo.TransactionId = "Cash";
          }
        }

        if (invoiceInfo == null)
        {
          return NotFound();
        }

        return Ok(invoiceInfo);
      }
      catch (Exception ex)
      {
        // Log the exception (if logging is set up)
        Console.WriteLine($"Error fetching invoice info: {ex.Message}");
        return StatusCode(500, "Internal server error while fetching invoice info.");
      }
    }
    
 

    private async Task<List<PaymentModeInfoResponse>> GetPaymentModeInfoByInvoiceId(int? Id)
    {
      // Ensure models is not null and contains data
      if (Id == 0)
      {
        return new List<PaymentModeInfoResponse>(); // Return empty list instead of null
      }

      // Fetch PaymentModeInfo records where InvoiceId matches item.InvoiceId
      var results = await _context.PaymentModeInfo
          .Where(e => e.InvoiceId == Id && e.PaymentMode == "Online" && e.ItemId != null && e.ItemId.Contains("Consultation"))
          .Select(pm => new PaymentModeInfoResponse
          {
            PaymentId = pm.PaymentId,
            InvoiceId = pm.InvoiceId,
            PaymentMode = pm.PaymentMode,
            itemName = pm.ItemName,
            itemId = pm.ItemId,
            TransactionId = pm.TransactionId,
            PaymentDate = pm.PaymentDate,
            Amount = pm.Amount,
            HospitalId = pm.HospitalId
          })
          .ToListAsync();

      return results;

    }

    [HttpGet("GetInvoiceinfoByPatientId")]
    public async Task<ActionResult<int>> GetInvoiceInfoByPatientId(int patientId)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var maxInvoiceId = await _context.InvoiceInfos
        .Where(i => i.PatientId == patientId && i.IsDeleted != true && (hospitalId == null || i.HospitalId == hospitalId))
        .MaxAsync(i => i.InvoiceId); // Cast to nullable int to handle case with no results
      if(maxInvoiceId == 0)
      {
        return NotFound();
      }
      return Ok(maxInvoiceId);
    }

    // GET: api/InvoiceInfoes
    [HttpGet("totalAmount")]
    public async Task<ActionResult<TotalPaymentDetailsResponse>> GetTotalPaymentAmount([FromQuery] string fromDate, [FromQuery] string toDate)
    {
      // If fromDate or toDate is not provided, default to today's date
      var today = DateTime.Today;
      DateTime fromDateParsed, toDateParsed;

      if (!string.IsNullOrEmpty(fromDate))
      {
        if (!DateTime.TryParse(fromDate, out fromDateParsed))
        {
          return BadRequest($"Invalid fromDate format. Please use yyyy-MM-dd or ISO 8601 format.");
        }
        fromDateParsed = fromDateParsed.Date;
      }
      else
      {
        fromDateParsed = today;
      }

      if (!string.IsNullOrEmpty(toDate))
      {
        if (!DateTime.TryParse(toDate, out toDateParsed))
        {
          return BadRequest($"Invalid toDate format. Please use yyyy-MM-dd or ISO 8601 format.");
        }
        toDateParsed = toDateParsed.Date;
      }
      else
      {
        toDateParsed = today;
      }
      var hospitalId = GetHospitalIdFromHeader();
      var result = await _context.PaymentModeInfo
          .Where(payment => payment.PaymentDate.HasValue &&
                            payment.PaymentDate.Value.Date >= fromDateParsed &&
                            payment.PaymentDate.Value.Date <= toDateParsed &&
                            (hospitalId == null || _context.InvoiceInfos.Where(i => i.InvoiceId == payment.InvoiceId).Any(i => i.HospitalId == hospitalId)))
          .GroupBy(payment => payment.PaymentMode.ToLower()) // Group by payment mode
          .Select(group => new
          {
            PaymentMode = group.Key,
            TotalAmount = group.Sum(p => p.Amount) ?? 0 // Sum amounts for each payment mode
          })
          .ToListAsync();

      // Initialize response object
      var totalPayment = new TotalPaymentDetailsResponse
      {
        TotalAmount = result.Sum(r => r.TotalAmount), // Total of all payment modes
        TotalCashAmount = result.FirstOrDefault(r => r.PaymentMode == "cash")?.TotalAmount ?? 0,
        TotalOnlineAmount = result.FirstOrDefault(r => r.PaymentMode == "online")?.TotalAmount ?? 0
      };

      return Ok(totalPayment);
    }

    //Get api/Invoiceinfoes
    [HttpGet("totalAmountDashboard")]

    public async Task<ActionResult<int>> GetTotalAmount()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var result = await _context.PaymentModeInfo
       .Where(all => EF.Functions.DateDiffDay(all.PaymentDate, DateTime.Today) == 0 && (hospitalId == null || _context.InvoiceInfos.Where(i => i.InvoiceId == all.InvoiceId).Any(i => i.HospitalId == hospitalId)))
       .SumAsync(all => (decimal?)all.Amount) ?? 0;
      return Ok(result);
    }

    //POST /api/InvoiceInfoes/createInvoice/{patientId}
    [HttpPost("createInvoice/{patientId}")]
    public async Task<ActionResult> PostInvoiceWithAdditionalItems(int patientId, NewInvoiceDto request)
    {
      if (request.additionalInvoiceItems == null || !request.additionalInvoiceItems.Any())
      {
        return BadRequest("No invoice items provided.");
      }
      var hospitalId = GetHospitalIdFromHeader();
      // Create Invoice
      var invoiceInfo = new InvoiceInfo()
      {
        Amount = 0,
        AppointmentId = 0,
        CreatedDate = DateTime.UtcNow, // Use UTC for consistency
        PatientId = patientId,
        Status = "Unpaid", // Set to Unpaid for new invoices
        IsConsultationPaid = false, // Set to false for new invoices
        HospitalId = hospitalId
      };

      // Add invoice to the context and save to generate the InvoiceId
      _context.InvoiceInfos.Add(invoiceInfo);
      await _context.SaveChangesAsync();  // Save to generate the InvoiceId

      // Retrieve the generated InvoiceId
      int generatedInvoiceId = invoiceInfo.InvoiceId;

      // Add each item to the context and associate it with the newly created invoice
      foreach (var additionalInvoiceItem in request.additionalInvoiceItems)
      {
        additionalInvoiceItem.InvoiceId = generatedInvoiceId; // Set the generated InvoiceId
        additionalInvoiceItem.Status = "Paid";
        _context.AdditionalInvoiceItems.Add(additionalInvoiceItem);
      }

      // Add payment mode details
      if (request.PaymentModeInfo != null)
      {
        request.PaymentModeInfo.InvoiceId = generatedInvoiceId;
        await AddPaymentModeInfo(request.PaymentModeInfo);
      }

      // Save all changes to the database
      await _context.SaveChangesAsync();

      return Ok(invoiceInfo);
    }



    // PUT: api/InvoiceInfoes/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutInvoiceInfo(int id, InvoicePaymentDto invoicePaymentDto)
    {
      if (id != invoicePaymentDto.InvoiceInfo?.InvoiceId)
      {
        return BadRequest();
      }

      _context.Entry(invoicePaymentDto.InvoiceInfo).State = EntityState.Modified;

      try
      {
        //await _context.SaveChangesAsync();

        // Check if any unpaid items remain for the invoice
        var hasUnpaidInvoiceItems = await _context.AdditionalInvoiceItems
            .AnyAsync(e => e.InvoiceId == id && e.Status != "Paid");

        // Update the overall payment status of the invoice
        var invoiceInfo = await _context.InvoiceInfos
            .FirstOrDefaultAsync(i => i.InvoiceId == id);

        if (invoiceInfo != null)
        {
          // Check both consultation payment and additional items
          bool isConsultationUnpaid = invoiceInfo.IsConsultationPaid.HasValue && !invoiceInfo.IsConsultationPaid.Value;
          
          if (isConsultationUnpaid && hasUnpaidInvoiceItems)
          {
            invoiceInfo.Status = "Unpaid";
          }
          else if (isConsultationUnpaid || hasUnpaidInvoiceItems)
          {
            invoiceInfo.Status = "Partially Paid";
          }
          else
          {
            invoiceInfo.Status = "Paid";
          }
          
          _context.InvoiceInfos.Update(invoiceInfo);
        }

        if (invoicePaymentDto.PaymentModeInfo != null && invoicePaymentDto.PaymentModeInfo.InvoiceId != 0)
        {
          await AddPaymentModeInfo(invoicePaymentDto.PaymentModeInfo);
        }

        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!InvoiceInfoExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }
      catch (Exception ex)
      {
        var message = ex.ToString();
        throw;
      }

      return NoContent();
    }

    [HttpPost("paymentMode")]
    public async Task AddPaymentModeInfo(PaymentModeInfo paymentModeInfo)
    {
      // Add the object to the database
      _context.PaymentModeInfo.Add(paymentModeInfo);

      // Save changes to the database
      await _context.SaveChangesAsync();
    }


    // POST: api/InvoiceInfoes
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<InvoiceInfo>> PostInvoiceInfo(InvoiceInfo invoiceInfo)
    {
      var hospitalId = GetHospitalIdFromHeader();
      invoiceInfo.HospitalId = hospitalId;
      _context.InvoiceInfos.Add(invoiceInfo);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetInvoiceInfo", new { id = invoiceInfo.InvoiceId }, invoiceInfo);
    }

    // DELETE: api/InvoiceInfoes/5 (Soft Delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvoiceInfo(int id)
    {
      var invoiceInfo = await _context.InvoiceInfos.FindAsync(id);
      if (invoiceInfo == null)
      {
        return NotFound();
      }

      // Soft delete the invoice
      invoiceInfo.IsDeleted = true;
      invoiceInfo.DeletedDate = DateTime.UtcNow;
      // Note: You can add DeletedBy field based on current user context
      // invoiceInfo.DeletedBy = GetCurrentUserId();

      _context.InvoiceInfos.Update(invoiceInfo);
      await _context.SaveChangesAsync();

      return Ok(new { message = "Invoice has been soft deleted." });
    }

    private bool InvoiceInfoExists(int id)
    {
      return _context.InvoiceInfos.Any(e => e.InvoiceId == id && e.IsDeleted != true);
    }

    [HttpPost("Search")]
    public async Task<SearchResponseBase<InvoiceInfoResponse>> SearchInvoices([FromBody] InvoiceSearch criteria)
    {
        var response = new SearchResponseBase<InvoiceInfoResponse>();
      try
      {
        var hospitalId = GetHospitalIdFromHeader();
        // Base invoices query (server-side filtering + sorting, then paginate)
        var invoicesQuery = _context.InvoiceInfos
            .AsNoTracking()
            .Where(i => i.IsDeleted != true && (hospitalId == null || i.HospitalId == hospitalId))
            .AsQueryable();

        // Date filters:
        // - If from/to provided: filter by Invoice.CreatedDate (date only)
        // - If not provided: do NOT apply any date filter (return all)
        if (!string.IsNullOrWhiteSpace(criteria.FromDate) && DateTime.TryParse(criteria.FromDate, out var fromDate)
            && !string.IsNullOrWhiteSpace(criteria.ToDate) && DateTime.TryParse(criteria.ToDate, out var toDate))
        {
          fromDate = fromDate.Date;
          toDate = toDate.Date;
          invoicesQuery = invoicesQuery.Where(i => i.CreatedDate.HasValue
                                                && i.CreatedDate.Value.Date >= fromDate
                                                && i.CreatedDate.Value.Date <= toDate);
        }

        // Filter by payment status (enum name vs stored text)
        if (criteria.PaymentStatus.HasValue && criteria.PaymentStatus.Value != PaymentStatus.All)
        {
          var status = criteria.PaymentStatus.Value.ToString().ToLower();
          invoicesQuery = invoicesQuery.Where(i => i.Status != null && i.Status.ToLower() == status);
        }

        // Filter by payment mode (enum name vs stored text in PaymentModeInfo)
        if (criteria.PaymentMode.HasValue && criteria.PaymentMode.Value != PaymentMode.All)
        {
          var mode = criteria.PaymentMode.Value.ToString().ToLower();
          invoicesQuery = invoicesQuery.Where(i => _context.PaymentModeInfo
              .Where(pm => pm.InvoiceId == i.InvoiceId)
              .Select(pm => pm.PaymentMode.ToLower())
              .Contains(mode));
        }

        // Sorting
        if (!string.IsNullOrEmpty(criteria.SortFieldName))
        {
          if ((SortDirection)criteria.SortDirection == SortDirection.Descending)
            invoicesQuery = invoicesQuery.OrderByDescending(e => EF.Property<object>(e, criteria.SortFieldName));
          else
            invoicesQuery = invoicesQuery.OrderBy(e => EF.Property<object>(e, criteria.SortFieldName));
        }
        else
        {
          invoicesQuery = invoicesQuery.OrderByDescending(e => e.InvoiceId);
        }

        // Total count BEFORE paging
        var totalCount = await invoicesQuery.CountAsync();

        // Paging
        var pageNumber = criteria.PageNumber <= 0 ? 1 : criteria.PageNumber;
        var pageSize = criteria.PageSize <= 0 ? 100 : criteria.PageSize;
        var skip = (pageNumber - 1) * pageSize;

        // Select minimal fields for the current page
        var pageInvoices = await invoicesQuery
            .Skip(skip)
            .Take(pageSize)
            .Select(i => new {
              i.InvoiceId,
              i.AppointmentId,
              i.PatientId,
              i.CreatedDate,
              i.Amount,
              i.Status
            })
            .ToListAsync();

        var invoiceIds = pageInvoices.Select(i => i.InvoiceId).ToList();
        var patientIds = pageInvoices.Select(i => i.PatientId).Distinct().ToList();

        // Load related data for the selected invoices (single round trip per set)
        var paymentDetails = await _context.PaymentModeInfo
            .AsNoTracking()
            .Where(pm => invoiceIds.Contains(pm.InvoiceId))
            .ToListAsync();

        var additionalItems = await _context.AdditionalInvoiceItems
            .AsNoTracking()
            .Where(ai => invoiceIds.Contains(ai.InvoiceId))
            .ToListAsync();

        var patients = await _context.PatientInfos
            .AsNoTracking()
            .Where(p => patientIds.Contains(p.PatientId))
            .Select(p => new { p.PatientId, p.FirstName, p.LastName })
            .ToListAsync();

        // In-memory grouping/aggregation for response projection
        var additionalSumByInvoice = additionalItems
            .GroupBy(ai => ai.InvoiceId)
            .ToDictionary(g => g.Key, g => g.Sum(ai => (decimal?)(ai.FinalAmount) ?? 0m));

        var paymentsByInvoice = paymentDetails
            .GroupBy(pm => pm.InvoiceId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var patientNameById = patients
            .ToDictionary(p => p.PatientId, p => p.FirstName + (string.IsNullOrEmpty(p.LastName) ? "" : (" " + p.LastName)));

        var results = pageInvoices.Select(i =>
        {
          var addAmount = additionalSumByInvoice.TryGetValue(i.InvoiceId, out var addSum) ? addSum : 0m;
          var pms = paymentsByInvoice.TryGetValue(i.InvoiceId, out var pmList) ? pmList : new List<PaymentModeInfo>();
          var totalPaid = pms.Sum(pm => pm.Amount ?? 0);
          var baseAmount = i.Amount ?? 0;
          var paymentModesStr = string.Join(", ", pms.Select(pm => pm.PaymentMode).Where(x => !string.IsNullOrEmpty(x)).Distinct());
          var fullName = patientNameById.TryGetValue(i.PatientId, out var name) ? name : null;

          return new InvoiceInfoResponse
          {
            InvoiceId = i.InvoiceId,
            AppointmentId = i.AppointmentId,
            PatientId = i.PatientId,
            CreatedDate = i.CreatedDate,
            Amount = (int?)((decimal)baseAmount + addAmount),
            Status = i.Status,
            PaymentDetails = pms.Select(pm => new PaymentModeInfoResponse
            {
              PaymentId = pm.PaymentId,
              InvoiceId = pm.InvoiceId,
              PaymentMode = pm.PaymentMode,
              itemName = pm.ItemName,
              itemId = pm.ItemId,
              TransactionId = pm.TransactionId,
              PaymentDate = pm.PaymentDate,
              Amount = pm.Amount,
              HospitalId = pm.HospitalId
            }).ToList(), // includes PaymentDate with time
            PaymentModes = paymentModesStr ?? string.Empty,
            TotalUnpaidAmount = (decimal)baseAmount + addAmount - totalPaid,
            PatientFname = fullName
          };
        }).ToList();

        response.Results = results;
        response.TotalCount = totalCount;
        response.TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        }
      catch (Exception ex)
      {
        response.ErrorMessage = ex.Message;
      }
        return response;
    }
  }
}
