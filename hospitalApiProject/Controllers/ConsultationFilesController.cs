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
    public class ConsultationFilesController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public ConsultationFilesController(FlorenceDbContext context)
        {
            _context = context;
        }

        // GET: api/ConsultationFiles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultationFile>>> GetConsultationFiles()
        {
            return await _context.ConsultationFiles.ToListAsync();
        }

        // GET: api/ConsultationFiles/5
        [HttpGet("{AppointmentId}")]
        public async Task<ActionResult<List<ConsultationFile>>> GetConsultationFile(int AppointmentId)
        {
            var consultationFiles = await _context.ConsultationFiles
                                                .Where(e => e.AppointmentId == AppointmentId)
                                                .ToListAsync();

            if (consultationFiles.Count == 0) // Check if the list is empty
            {
                return NotFound(); // Return 404 Not Found if no consultation files are found
            }

            return consultationFiles;
        }

        // PUT: api/ConsultationFiles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsultationFile(int id, ConsultationFile consultationFile)
        {
            if (id != consultationFile.FileId)
            {
                return BadRequest();
            }

            _context.Entry(consultationFile).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsultationFileExists(id))
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

        // POST: api/ConsultationFiles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ConsultationFile>> PostConsultationFile(ConsultationFile consultationFile)
        {
            _context.ConsultationFiles.Add(consultationFile);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConsultationFile", new { id = consultationFile.FileId }, consultationFile);
        }

        // DELETE: api/ConsultationFiles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsultationFile(int id)
        {
            var consultationFile = await _context.ConsultationFiles.FindAsync(id);
            if (consultationFile == null)
            {
                return NotFound();
            }

            _context.ConsultationFiles.Remove(consultationFile);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsultationFileExists(int id)
        {
            return _context.ConsultationFiles.Any(e => e.FileId == id);
        }
    }
}
