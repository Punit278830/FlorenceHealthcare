//using Hl7.Fhir.Model;
using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AdditionalInvoiceItemsController : ControllerBase
  {
    private readonly FlorenceDbContext _context;

    public AdditionalInvoiceItemsController(FlorenceDbContext context)
    {
      _context = context;
    }

    // GET: api/AdditionalInvoiceItems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdditionalInvoiceItem>>> GetAdditionalInvoiceItems()
    {
      return await _context.AdditionalInvoiceItems.ToListAsync();
    }

    // GET: api/AdditionalInvoiceItems/5  
    [HttpGet("{id}")]
    public async Task<ActionResult<AdditionalInvoiceItem>> GetAdditionalInvoiceItem(int id)
    {
      var additionalInvoiceItem = await _context.AdditionalInvoiceItems.FindAsync(id);

      if (additionalInvoiceItem == null)
      {
        return NotFound();
      }

      return additionalInvoiceItem;
    }

    // GET: api/AdditionalInvoiceItems/5
    [HttpGet("invoiceId/{id}")]
    public async Task<ActionResult<IEnumerable<AdditionalInvoiceItem>>> GetAllAdditionalInvoiceItem(int id)
    {
      var additionalInvoiceItems = await _context.AdditionalInvoiceItems
                                                  .Where(e => e.InvoiceId == id)
                                                  .ToListAsync();

      if (additionalInvoiceItems.Count == 0)
      {
        return NotFound();
      }

      return Ok(additionalInvoiceItems);
    }


    // PUT: api/AdditionalInvoiceItems/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAdditionalInvoiceItem(int id, AdditionalInvoiceItemsPaymentDto request)
    {
      if (id != request.additionalInvoiceItem.Id)
      {
        return BadRequest();
      }

      _context.Entry(request.additionalInvoiceItem).State = EntityState.Modified;

      try
      {
        if (request.PaymentModeInfo != null && request.PaymentModeInfo.InvoiceId != 0)
        {
          await AddPaymentModeInfo(request.PaymentModeInfo);
        }

        // update the overall payment status of invoice
        var hasUnpaidInvoiceItems = await _context.AdditionalInvoiceItems
                                  .AnyAsync(e => e.InvoiceId == request.additionalInvoiceItem.InvoiceId && e.Status != "Paid");

        var invoiceInfo = await _context.InvoiceInfos.FirstOrDefaultAsync(i => i.InvoiceId == request.additionalInvoiceItem.InvoiceId);

        if (invoiceInfo != null)
        {
          invoiceInfo.Status = hasUnpaidInvoiceItems ? "Partially Paid" : "Paid";
          _context.InvoiceInfos.Update(invoiceInfo);
          await _context.SaveChangesAsync();
        }

        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!AdditionalInvoiceItemExists(id))
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

    [HttpPut("payAll/{id}")]
    public async Task<IActionResult> PayAllInvoiceItems(int invoiceId, PaymentModeInfo paymentModeInfo)
    {
      if (paymentModeInfo.InvoiceId == 0)
      {
        return BadRequest();
      }

      try
      {
        // update the overall payment status of invoice
        var unpaidInvoiceItems = await _context.AdditionalInvoiceItems
                                        .Where(item => item.Status != "Paid" && item.InvoiceId == paymentModeInfo.InvoiceId)
                                        .ToListAsync();

        // Calculate the sum of unpaid items' amounts
        int? unpaidAmount = unpaidInvoiceItems.Sum(x => x.FinalAmount);

        // Update the status of each unpaid item to "Paid"
        foreach (var item in unpaidInvoiceItems)
        {
          item.Status = "Paid";
        }

        // Save the changes to the database
        await _context.SaveChangesAsync();

        var invoiceInfo = await _context.InvoiceInfos.FirstOrDefaultAsync(i => i.InvoiceId == paymentModeInfo.InvoiceId);

        if (invoiceInfo != null)
        {
          if (invoiceInfo.IsConsultationPaid.HasValue && !invoiceInfo.IsConsultationPaid.Value)
          {
            unpaidAmount += invoiceInfo.Amount;
            invoiceInfo.IsConsultationPaid = true;
          }

          invoiceInfo.Status = "Paid";
          _context.InvoiceInfos.Update(invoiceInfo);
          await _context.SaveChangesAsync();

          if (paymentModeInfo != null && paymentModeInfo.InvoiceId != 0 && (unpaidInvoiceItems.Count != 0 ||
            (invoiceInfo.IsConsultationPaid.HasValue && !invoiceInfo.IsConsultationPaid.Value)))
          {
            paymentModeInfo.Amount = unpaidAmount;
            await AddPaymentModeInfo(paymentModeInfo);
          }

        }

      }
      catch (Exception ex)
      {
        var message = ex.ToString();
        throw;
      }

      return NoContent();
    }

    // POST: api/AdditionalInvoiceItems
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<AdditionalInvoiceItem>> PostAdditionalInvoiceItem(AdditionalInvoiceItem additionalInvoiceItem)
    {
      _context.AdditionalInvoiceItems.Add(additionalInvoiceItem);
      await _context.SaveChangesAsync();

      var invoiceData = _context.InvoiceInfos.FirstOrDefault(e => e.InvoiceId == additionalInvoiceItem.InvoiceId);
      if (invoiceData != null && !string.IsNullOrEmpty(invoiceData.Status) && invoiceData.Status != "unPaid")
      {
        if (invoiceData.Status == "Paid")
        {
          invoiceData.Status = "Partially Paid";
          _context.Entry(invoiceData).State = EntityState.Modified;
          await _context.SaveChangesAsync();
        }
      }

      return CreatedAtAction("GetAdditionalInvoiceItem", new { id = additionalInvoiceItem.Id }, additionalInvoiceItem);
    }

    // DELETE: api/AdditionalInvoiceItems/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAdditionalInvoiceItem(int id)
    {
      var additionalInvoiceItem = await _context.AdditionalInvoiceItems.FindAsync(id);
      if (additionalInvoiceItem == null)
      {
        return NotFound();
      }

      _context.AdditionalInvoiceItems.Remove(additionalInvoiceItem);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    // DELETE: api/AdditionalInvoiceItems/invoiceId/itemName
    [HttpDelete("{invoiceId}/{itemName}")]
    public async Task<IActionResult> DeleteAdditionalInvoiceItem(int invoiceId, string itemName)
    {
      try
      {
        // Find the additional item to delete by invoiceId and itemName
        var additionalInvoiceItem = await _context.AdditionalInvoiceItems
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId && i.ItemName == itemName);

        if (additionalInvoiceItem == null)
        {
          return NotFound(new { message = "Additional invoice item not found." });
        }

        // Remove the additional invoice item
        _context.AdditionalInvoiceItems.Remove(additionalInvoiceItem);

        // Save changes to the database
        await _context.SaveChangesAsync();

        // Check if any unpaid items remain for the invoice
        var hasUnpaidInvoiceItems = await _context.AdditionalInvoiceItems
            .AnyAsync(e => e.InvoiceId == invoiceId && e.Status != "Paid");

        // Update the overall payment status of the invoice
        var invoiceInfo = await _context.InvoiceInfos
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);

        if (invoiceInfo != null)
        {
          invoiceInfo.Status = hasUnpaidInvoiceItems ? "Partially Paid" : "Paid";
          _context.InvoiceInfos.Update(invoiceInfo);
          await _context.SaveChangesAsync();
        }

        return NoContent();
      }
      catch (DbUpdateConcurrencyException)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Concurrency issue occurred while deleting the item." });
      }
      catch (Exception ex)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting the item.", error = ex.Message });
      }
    }


    private bool AdditionalInvoiceItemExists(int id)
    {
      return _context.AdditionalInvoiceItems.Any(e => e.Id == id);
    }

    private async Task AddPaymentModeInfo(PaymentModeInfo paymentModeInfo)
    {
      // Add the object to the database
      _context.PaymentModeInfo.Add(paymentModeInfo);

      // Save changes to the database
      await _context.SaveChangesAsync();
    }
  }
}
