//using Hl7.Fhir.Model;
using Hl7.Fhir.Utility;
using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using System.Collections.Generic;
using System.Linq;

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


    // GET: api/AdditionalInvoiceItems/invoiceId
    [HttpGet("invoiceId/{id}")]
    public async Task<ActionResult<IEnumerable<AdditionalInvoiceItem>>> GetAllAdditionalInvoiceItem(int id)
    {


      var singleTransactionId = await _context.PaymentModeInfo
    .Where(p => p.InvoiceId == id)
    .Select(p => p.TransactionId)
    .Distinct()
    .ToListAsync();

      // Check if there's only one unique transaction ID
      string? transactionIdForInvoice = singleTransactionId.Count == 1 ? singleTransactionId.First() : null;

      var additionalInvoiceItems = await _context.AdditionalInvoiceItems
         .Where(e => e.InvoiceId == id)
         .Join(
             _context.InvoiceItemMasters,  // Joining InvoiceItemMaster to get ItemId
             e => e.ItemName,             // Matching ItemName from AdditionalInvoiceItems
             im => im.ItemName,          // Matching ItemName from InvoiceItemMaster
             (e, im) => new              // Resulting projection
             {
               e.Id,
               e.InvoiceId,
               e.ItemName,
               e.Description,
               e.Discount,
               e.Fee,
               e.CreatedBy,
               e.FinalAmount,
               e.Status,
               // Assign the single TransactionId if it exists; otherwise fetch based on conditions
               TransactionId = transactionIdForInvoice ?? _context.PaymentModeInfo
                     .Where(p => p.InvoiceId == e.InvoiceId && p.itemName == e.ItemName)
                     .OrderByDescending(p => p.PaymentDate)
                     .Select(p => p.TransactionId)
                     .FirstOrDefault(),
               // Fetch ItemId from the InvoiceItemMaster
               ItemId = im.ItemId
             })
         .ToListAsync();


      // Convert anonymous type list to List<AdditionalInvoiceItemDetail>
      List<AdditionalInvoiceItemDetail> tempModel = additionalInvoiceItems
          .Select(x => new AdditionalInvoiceItemDetail
          {
            Id = x.Id,
            InvoiceId = x.InvoiceId,
            ItemName = x.ItemName,
            Description = x.Description,
            Discount = x.Discount,
            Fee = x.Fee,
            CreatedBy = x.CreatedBy,
            FinalAmount = x.FinalAmount,
            Status = x.Status,
            TransactionId = x.TransactionId,
            ItemId = x.ItemId
          })
          .ToList(); 
      if (additionalInvoiceItems.Count == 0)
      {
        return NotFound();
      }
      var tempRes = await this.GetPaymentModeInfoByInvoiceId(tempModel[0].InvoiceId);
      // Split the string by commas and convert each item to an integer
      var values = tempRes.Where(x => x.itemId.Contains(","))
    .Select(x => new { x.itemId, x.TransactionId })
    .ToList();

      if (values.Count > 0)
      {

        string[] data = null;
        string tempTransactionId = "";
        foreach (var value in values)
        {
          if (value.itemId.Contains(","))
          {
            // Split the string by commas and join them back to a single string if needed
            data = value.itemId.Split(',');
            tempTransactionId = value.TransactionId;
          }
        }
        // Convert the string array to an integer array
        int[] intData = data.Where(x => !x.Contains("Consultation")).Select(int.Parse).ToArray();

        // Filter additionalInvoiceItems based on the Ids in the intData array
        var res = tempModel
    .Where(x => intData.Contains(x.Id))
    .ToList();

        // Update TransactionId in both res and additionalInvoiceItems
        foreach (var item in res)
        {
          item.TransactionId = tempTransactionId; // Update the TransactionId in tempModel

          // Find the matching item in additionalInvoiceItems and update its TransactionId
          var matchedItem = tempModel.FirstOrDefault(x => x.Id == item.Id);
          if (matchedItem != null)
          {
            matchedItem.TransactionId = tempTransactionId;
          }
        }

      }


      return Ok(tempModel);
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
          .Where(e => e.InvoiceId == Id && e.PaymentMode == "Online")
          .ToListAsync();

      return results;

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
