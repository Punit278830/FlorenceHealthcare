using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;

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
        public async Task<IActionResult> PutAdditionalInvoiceItem(int id, AdditionalInvoiceItem additionalInvoiceItem)
        {
            if (id != additionalInvoiceItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(additionalInvoiceItem).State = EntityState.Modified;

            try
            {
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

        private bool AdditionalInvoiceItemExists(int id)
        {
            return _context.AdditionalInvoiceItems.Any(e => e.Id == id);
        }
    }
}
