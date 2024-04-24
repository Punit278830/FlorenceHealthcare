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
    public class DiagnosisTemplateMastersController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public DiagnosisTemplateMastersController(FlorenceDbContext context)
        {
            _context = context;
        }

        // GET: api/DiagnosisTemplateMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DiagnosisTemplateMaster>>> GetDiagnosisTemplateMasters()
        {
            return await _context.DiagnosisTemplateMasters.ToListAsync();
        }

        // GET: api/DiagnosisTemplateMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DiagnosisTemplateMaster>> GetDiagnosisTemplateMaster(int id)
        {
            var diagnosisTemplateMaster = await _context.DiagnosisTemplateMasters.FindAsync(id);

            if (diagnosisTemplateMaster == null)
            {
                return NotFound();
            }

            return diagnosisTemplateMaster;
        }

        // PUT: api/DiagnosisTemplateMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiagnosisTemplateMaster(int id, DiagnosisTemplateMaster diagnosisTemplateMaster)
        {
            if (id != diagnosisTemplateMaster.DiagnosId)
            {
                return BadRequest();
            }

            _context.Entry(diagnosisTemplateMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiagnosisTemplateMasterExists(id))
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

        // POST: api/DiagnosisTemplateMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DiagnosisTemplateMaster>> PostDiagnosisTemplateMaster(DiagnosisTemplateMaster diagnosisTemplateMaster)
        {
            _context.DiagnosisTemplateMasters.Add(diagnosisTemplateMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDiagnosisTemplateMaster", new { id = diagnosisTemplateMaster.DiagnosId }, diagnosisTemplateMaster);
        }

        // DELETE: api/DiagnosisTemplateMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiagnosisTemplateMaster(int id)
        {
            var diagnosisTemplateMaster = await _context.DiagnosisTemplateMasters.FindAsync(id);
            if (diagnosisTemplateMaster == null)
            {
                return NotFound();
            }

            _context.DiagnosisTemplateMasters.Remove(diagnosisTemplateMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DiagnosisTemplateMasterExists(int id)
        {
            return _context.DiagnosisTemplateMasters.Any(e => e.DiagnosId == id);
        }
    }
}
