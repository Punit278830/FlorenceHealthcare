using Hl7.Fhir.ElementModel.Types;
using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using System;
using DateTime = System.DateTime;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class InvoiceInfoesController : ControllerBase
  {
    private readonly FlorenceDbContext _context;

    public InvoiceInfoesController(FlorenceDbContext context)
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
      var query = _context.InvoiceInfos.AsQueryable();

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
      var toDateParsed = DateTime.Parse(toDate).Date;

      // Apply date filtering for both fromDate and toDate (now using DateTime)
      query = query.Where(invoice => invoice.CreatedDate >= fromDateParsed && invoice.CreatedDate <= toDateParsed);

      // Apply paymentStatus filtering
      if (paymentStatus.ToLower() != "all")
      {
        query = query.Where(invoice => invoice.Status.ToLower() == paymentStatus.ToLower());
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
                      .Select(pm => new PaymentModeInfo
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
                      .Distinct()) : null,

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
          .Where(pm => pm.PaymentMode.ToLower() == "online")
          .Sum(pm => pm.Amount)) ?? 0;

      var totalCashAmount = invoices.Sum(inv => inv.PaymentDetails
          .Where(pm => pm.PaymentMode.ToLower() == "cash")
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

      // Retrieve invoices with patient data for today
      var invoicesToday = await _context.InvoiceInfos
          .Where(invoice => invoice.CreatedDate.HasValue && invoice.CreatedDate.Value.Date == today)
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

      // If no invoices are found, return a 404 (Not Found)
      if (invoicesToday == null || !invoicesToday.Any())
      {
        return NotFound("No invoices found for today.");
      }

      // Return the invoices as the response
      return Ok(invoicesToday);
    }


    [HttpGet("by-invoice-id/{invoiceId}")]
    public async Task<ActionResult<InvoiceInfo>> GetInvoiceInfoByInvoiceId(int invoiceId)
    {
      try
      {
        var invoiceInfo = await _context.InvoiceInfos
          .Where(i => i.InvoiceId == invoiceId)
          .Select(i => new InvoiceInfo
          {
            InvoiceId = i.InvoiceId,
            PatientId = i.PatientId,
            AppointmentId = i.AppointmentId,
            CreatedDate = i.CreatedDate,
            Amount = i.Amount,
            Status = i.Status,
            IsConsultationPaid = i.IsConsultationPaid,
            TransactionId = (bool)i.IsConsultationPaid
              ? _context.PaymentModeInfo
                  .Where(p => p.InvoiceId == i.InvoiceId && p.itemName == "Consultation")
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
                .Where(i => i.InvoiceId == invoiceId)
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
    
 

    private async Task<List<PaymentModeInfo>> GetPaymentModeInfoByInvoiceId(int? Id)
    {
      // Ensure models is not null and contains data
      if (Id == 0)
      {
        return null; // Or handle as appropriate
      }

      // Fetch PaymentModeInfo records where InvoiceId matches item.InvoiceId
      var results = await _context.PaymentModeInfo
          .Where(e => e.InvoiceId == Id && e.PaymentMode == "Online" && e.itemId.Contains("Consultation"))
          .ToListAsync();

      return results;

    }

    [HttpGet("GetInvoiceinfoByPatientId")]
    public async Task<ActionResult<int>> GetInvoiceInfoByPatientId(int patientId)
    {
      var maxInvoiceId = await _context.InvoiceInfos
        .Where(i => i.PatientId == patientId)
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

      var result = await _context.PaymentModeInfo
          .Where(payment => payment.PaymentDate.HasValue &&
                            payment.PaymentDate.Value.Date >= fromDateParsed &&
                            payment.PaymentDate.Value.Date <= toDateParsed)
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
      var result = _context.PaymentModeInfo
       .Where(all => EF.Functions.DateDiffDay(all.PaymentDate, DateTime.Today) == 0)
       .Sum(all => (decimal?)all.Amount) ?? 0;
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

      // Create Invoice
      var invoiceInfo = new InvoiceInfo()
      {
        Amount = 0,
        AppointmentId = 0,
        CreatedDate = DateTime.UtcNow, // Use UTC for consistency
        PatientId = patientId,
        Status = "Unpaid", // Set to Unpaid for new invoices
        IsConsultationPaid = false // Set to false for new invoices
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
      if (id != invoicePaymentDto.InvoiceInfo.InvoiceId)
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
          invoiceInfo.Status = hasUnpaidInvoiceItems ? "Partially Paid" : "Paid";
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
      _context.InvoiceInfos.Add(invoiceInfo);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetInvoiceInfo", new { id = invoiceInfo.InvoiceId }, invoiceInfo);
    }

    // DELETE: api/InvoiceInfoes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvoiceInfo(int id)
    {
      var invoiceInfo = await _context.InvoiceInfos.FindAsync(id);
      if (invoiceInfo == null)
      {
        return NotFound();
      }

      _context.InvoiceInfos.Remove(invoiceInfo);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool InvoiceInfoExists(int id)
    {
      return _context.InvoiceInfos.Any(e => e.InvoiceId == id);
    }

    [HttpPost("Search")]
    public async Task<SearchResponseBase<InvoiceInfoResponse>> SearchInvoices([FromBody] InvoiceSearch criteria)
    {
        var response = new SearchResponseBase<InvoiceInfoResponse>();
        try
        {
            var query = _context.InvoiceInfos.AsQueryable();

            // Parse and filter by date range
            DateTime utcNow = DateTime.UtcNow;
            if (!string.IsNullOrEmpty(criteria.FromDate) && DateTime.TryParse(criteria.FromDate, out var fromDate))
                query = query.Where(i => i.CreatedDate >= fromDate);
            else
                query = query.Where(i => i.CreatedDate >= utcNow);
            if (!string.IsNullOrEmpty(criteria.ToDate) && DateTime.TryParse(criteria.ToDate, out var toDate))
                query = query.Where(i => i.CreatedDate <= toDate);
            else
                query = query.Where(i => i.CreatedDate <= utcNow);

            // Filter by payment status
            if (criteria.PaymentStatus.HasValue && criteria.PaymentStatus.Value != PaymentStatus.All)
            {
                var statusEnum = criteria.PaymentStatus.Value;
                query = query.Where(i => i.Status.ToLower() == statusEnum.ToString().ToLower());
            }

            // Filter by payment mode
            if (criteria.PaymentMode.HasValue && criteria.PaymentMode.Value != PaymentMode.All)
            {
                var modeEnum = criteria.PaymentMode.Value;
                query = query.Where(i => _context.PaymentModeInfo
                    .Where(pm => pm.InvoiceId == i.InvoiceId)
                    .Select(pm => pm.PaymentMode.ToLower())
                    .Contains(modeEnum.ToString().ToLower()));
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(criteria.SortFieldName))
            {
                if ((SortDirection)criteria.SortDirection == SortDirection.Descending)
                    query = query.OrderByDescending(e => EF.Property<object>(e, criteria.SortFieldName));
                else
                    query = query.OrderBy(e => EF.Property<object>(e, criteria.SortFieldName));
            }
            else
            {
                query = query.OrderByDescending(e => e.InvoiceId);
            }

            // Paging
            int skip = (criteria.PageNumber - 1) * criteria.PageSize;
            int totalCount = await query.CountAsync();
            int totalPages = (int)Math.Ceiling((double)totalCount / criteria.PageSize);
            var invoices = await query.Skip(skip).Take(criteria.PageSize)
                .Select(invoice => new InvoiceInfoResponse
                {
                    InvoiceId = invoice.InvoiceId,
                    AppointmentId = invoice.AppointmentId,
                    PatientId = invoice.PatientId,
                    CreatedDate = invoice.CreatedDate,
                    Amount = invoice.Amount + _context.AdditionalInvoiceItems
                              .Where(ai => ai.InvoiceId == invoice.InvoiceId)
                              .Sum(ai => ai.FinalAmount) ?? 0,
                    Status = invoice.Status,
                    PaymentDetails = _context.PaymentModeInfo
                              .Where(pm => pm.InvoiceId == invoice.InvoiceId)
                              .Select(pm => new PaymentModeInfo
                              {
                                PaymentId = pm.PaymentId,
                                PaymentMode = pm.PaymentMode,
                                TransactionId = pm.TransactionId,
                                PaymentDate = pm.PaymentDate,
                                Amount = pm.Amount
                              }).ToList(),
                    PaymentModes = _context.PaymentModeInfo
                              .Where(pm => pm.InvoiceId == invoice.InvoiceId)
                              .Select(pm => pm.PaymentMode)
                              .Distinct()
                              .Any() ? string.Join(", ", _context.PaymentModeInfo
                              .Where(pm => pm.InvoiceId == invoice.InvoiceId)
                              .Select(pm => pm.PaymentMode)
                              .Distinct()) : null,
                    TotalUnpaidAmount = invoice.Amount + _context.AdditionalInvoiceItems
                              .Where(ai => ai.InvoiceId == invoice.InvoiceId)
                              .Sum(ai => ai.FinalAmount) - _context.PaymentModeInfo
                              .Where(pm => pm.InvoiceId == invoice.InvoiceId)
                              .Sum(pm => pm.Amount) ?? 0,
                    PatientFname = (_context.PatientInfos
                        .Where(p => p.PatientId == invoice.PatientId)
                        .Select(p => p.FirstName + (string.IsNullOrEmpty(p.LastName) ? "" : (" " + p.LastName)))
                        .FirstOrDefault()),
                })
                .ToListAsync();
            response.Results = invoices;
            response.TotalCount = totalCount;
            response.TotalPages = totalPages;
        }
        catch (Exception ex)
        {
            response.ErrorMessage = ex.Message;
        }
        return response;
    }
  }
}
