using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

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
    public async Task<List<InvoiceInfoResponse>> GetInvoiceWithPaymentsAsync([FromQuery] string paymentMode, [FromQuery] string paymentStatus, [FromQuery] string fromDate, [FromQuery] string toDate)
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

      // Select the invoice data and join it with payment modes and additional items
      var result = await query
          .Select(invoice => new InvoiceInfoResponse
          {
            InvoiceId = invoice.InvoiceId,
            AppointmentId = invoice.AppoitmentId,
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
                    .Distinct()) : null
          })
          .OrderByDescending(o => o.InvoiceId)
          .ToListAsync();

      return result;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InvoiceInfo>> GetInvoiceInfo(int id)
    {
      var invoiceInfo = await _context.InvoiceInfos.FindAsync(id);

      if (invoiceInfo == null)
      {
        return NotFound();
      }

      return invoiceInfo;
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
        AppoitmentId = 0,
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
