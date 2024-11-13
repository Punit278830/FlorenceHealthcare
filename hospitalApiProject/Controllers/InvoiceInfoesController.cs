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
    [FromQuery] string toDate)
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
      var fromDateOnly = DateOnly.FromDateTime(fromDateParsed); // Convert DateTime to DateOnly
      var toDateOnly = DateOnly.FromDateTime(toDateParsed); // Convert DateTime to DateOnly

      // Apply date filtering for both fromDate and toDate
      query = query.Where(invoice => invoice.CreatedDate >= fromDateOnly && invoice.CreatedDate <= toDateOnly);

      // Apply paymentStatus filtering
      if (paymentStatus.ToLower() != "all")
      {
        query = query.Where(invoice => invoice.Status.ToLower() == paymentStatus.ToLower());
      }

      // Retrieve invoice data and payment details
      var invoices = await query
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
          .OrderByDescending(o => o.InvoiceId)
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
        TotalAmount = totalAmount               // Total of all payments
      };
    }

    [HttpGet("GetInvoicesForToday")]
    public async Task<IActionResult> GetInvoicesForTodayAsync()
    {
      // Get today's date
      var today = DateOnly.FromDateTime(DateTime.Now);

      // Retrieve all invoices created today
      var invoicesToday = await _context.InvoiceInfos
          .Where(invoice => invoice.CreatedDate == today)
          .ToListAsync();

      // If no invoices are found, return a 404 (Not Found)
      if (invoicesToday == null || !invoicesToday.Any())
      {
        return NotFound("No invoices found for today.");
      }

      // Return the invoices as the response
      return Ok(invoicesToday);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InvoiceInfo>> GetInvoiceInfo(int id)
    {
      //var invoiceInfo = await _context.InvoiceInfos.FindAsync(id);

      var invoiceInfo = await _context.InvoiceInfos
    .Where(i => i.InvoiceId == id)
    .Select(i => new
    {
      i.InvoiceId,
      i.PatientId,
      i.AppointmentId,
      i.CreatedDate,
      i.Amount,
      i.Status,
      i.IsConsultationPaid,
      TransactionId = (bool)i.IsConsultationPaid
            ? _context.PaymentModeInfo
                .Where(p => p.InvoiceId == i.InvoiceId && p.itemName == "Consultation") // Assuming "Consultation" is the item name you're matching
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => p.TransactionId)
                .FirstOrDefault()
            : null // If not consultation paid, no transaction id fetched
    })
    .FirstOrDefaultAsync();


      if (invoiceInfo == null)
      {
        return NotFound();
      }

      return Ok(invoiceInfo);
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
      var today = DateOnly.FromDateTime(DateTime.Today);

      var fromDateParsed = !string.IsNullOrEmpty(fromDate)
          ? DateOnly.Parse(fromDate)
          : today; // Default to today's date if not provided

      var toDateParsed = !string.IsNullOrEmpty(toDate)
          ? DateOnly.Parse(toDate)
          : today; // Default to today's date if not provided

      var result = await _context.PaymentModeInfo
          .Where(payment => payment.PaymentDate.HasValue &&
                            DateOnly.FromDateTime(payment.PaymentDate.Value) >= fromDateParsed &&
                            DateOnly.FromDateTime(payment.PaymentDate.Value) <= toDateParsed)
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
        CreatedDate = DateOnly.FromDateTime(DateTime.Now),
        PatientId = patientId,
        Status = "Paid",
        IsConsultationPaid = true
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
  }
}
