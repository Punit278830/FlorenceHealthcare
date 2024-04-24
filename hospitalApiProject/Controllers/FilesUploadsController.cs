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
    public class FilesUploadsController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public FilesUploadsController(FlorenceDbContext context)
        {
            _context = context;
        }

        // GET: api/FilesUploads
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FilesUpload>>> GetFilesUploads()
        {
            return await _context.FilesUploads.ToListAsync();
        }

        // GET: api/FilesUploads/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FilesUpload>> GetFilesUpload(int id)
        {
            var filesUpload = await _context.FilesUploads.FindAsync(id);
            
            if (filesUpload == null)
            {
                return NotFound();
            }

            return filesUpload;
        }

        [HttpGet("appointmentId/{appointmentId}")]
        public async Task<ActionResult<List<FilesUpload>>> GetFilesUploadByAppointment(int appointmentId)
        {
            List<FilesUpload> fileUpload = await _context.FilesUploads.Where(e=>e.AppointmentId==appointmentId).ToListAsync();

            if (fileUpload == null || fileUpload.Count == 0)
            {
                return NotFound();
            }

            return fileUpload;
        }



        // PUT: api/FilesUploads/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFilesUpload(int id, FilesUpload filesUpload)
        {
            if (id != filesUpload.FileId)
            {
                return BadRequest();
            }

            _context.Entry(filesUpload).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FilesUploadExists(id))
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

        // POST: api/FilesUploads
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FilesUpload>> PostFilesUpload(FilesUpload filesUpload)
        {
            _context.FilesUploads.Add(filesUpload);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFilesUpload", new { id = filesUpload.FileId }, filesUpload);
        }

        // DELETE: api/FilesUploads/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilesUpload(int id)
        {
            
            var filesUpload = await _context.FilesUploads.FindAsync(id);
            if (filesUpload == null)
            {
                return NotFound();
            }

            _context.FilesUploads.Remove(filesUpload);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FilesUploadExists(int id)
        {
            return _context.FilesUploads.Any(e => e.FileId == id);
        }
    }
}
