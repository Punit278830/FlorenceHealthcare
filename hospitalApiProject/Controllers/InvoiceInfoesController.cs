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
    public class InvoiceInfoesController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public InvoiceInfoesController(FlorenceDbContext context)
        {
            _context = context;
        }

        // GET: api/InvoiceInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceInfo>>> GetInvoiceInfos()
        {
            var invoices= await _context.InvoiceInfos.OrderByDescending(o => o.InvoiceId).ToListAsync();

            return invoices;
            
        }
        
        // GET: api/InvoiceInfoes/5
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

        // PUT: api/InvoiceInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoiceInfo(int id, InvoiceInfo invoiceInfo)
        {
            if (id != invoiceInfo.InvoiceId)
            {
                return BadRequest();
            }

            _context.Entry(invoiceInfo).State = EntityState.Modified;

            try
            {
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

            return NoContent();
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
