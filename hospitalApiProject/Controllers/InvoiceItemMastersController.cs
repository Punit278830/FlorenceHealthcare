using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceItemMastersController : WithHospitalController
    {
        public InvoiceItemMastersController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/InvoiceItemMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceItemMaster>>> GetInvoiceItemMasters()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.InvoiceItemMasters.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(i => i.HospitalId == hospitalId);
            }
            return await query.ToListAsync();
        }

        // GET: api/InvoiceItemMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceItemMaster>> GetInvoiceItemMaster(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var invoiceItemMaster = await _context.InvoiceItemMasters.FirstOrDefaultAsync(i => i.ItemId == id && (hospitalId == null || i.HospitalId == hospitalId));

            if (invoiceItemMaster == null)
            {
                return NotFound();
            }

            return invoiceItemMaster;
        }

        // PUT: api/InvoiceItemMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoiceItemMaster(int id, InvoiceItemMaster invoiceItemMaster)
        {
            if (id != invoiceItemMaster.ItemId)
            {
                return BadRequest();
            }

            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null) invoiceItemMaster.HospitalId = hospitalId;

            _context.Entry(invoiceItemMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceItemMasterExists(id))
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

        // POST: api/InvoiceItemMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<InvoiceItemMaster>> PostInvoiceItemMaster(InvoiceItemMaster invoiceItemMaster)
        {
            var hospitalId = GetHospitalIdFromHeader();
            invoiceItemMaster.HospitalId = hospitalId;
            _context.InvoiceItemMasters.Add(invoiceItemMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInvoiceItemMaster", new { id = invoiceItemMaster.ItemId }, invoiceItemMaster);
        }

        // DELETE: api/InvoiceItemMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoiceItemMaster(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var invoiceItemMaster = await _context.InvoiceItemMasters.FirstOrDefaultAsync(i => i.ItemId == id && (hospitalId == null || i.HospitalId == hospitalId));
            if (invoiceItemMaster == null)
            {
                return NotFound();
            }

            _context.InvoiceItemMasters.Remove(invoiceItemMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/InvoiceItemMasters/search
        [HttpGet("search/{name}")]
        public async Task<ActionResult<IEnumerable<InvoiceItemMaster>>> SearchInvoiceItemMasters(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("Search term cannot be null or empty.");
            }

            var hospitalId = GetHospitalIdFromHeader();

            var results = await _context.InvoiceItemMasters
                .Where(item => item.ItemName != null && item.ItemName.Contains(name) && (hospitalId == null || item.HospitalId == hospitalId))
                .ToListAsync();

            if (results == null || !results.Any())
            {
                return NotFound("No matching invoice items found.");
            }

            return Ok(results);
        }

        private bool InvoiceItemMasterExists(int id)
        {
            return _context.InvoiceItemMasters.Any(e => e.ItemId == id);
        }
    }
}
