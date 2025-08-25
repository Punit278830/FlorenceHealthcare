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
    public class FilesUploadsController : WithHospitalController
    {
        public FilesUploadsController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/FilesUploads
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FilesUpload>>> GetFilesUploads()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.FilesUploads.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(f => f.HospitalId == hospitalId);
            }
            return await query.ToListAsync();
        }

        // GET: api/FilesUploads/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FilesUpload>> GetFilesUpload(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var filesUpload = await _context.FilesUploads.FirstOrDefaultAsync(f => f.FileId == id && (hospitalId == null || f.HospitalId == hospitalId));
            
            if (filesUpload == null)
            {
                return NotFound();
            }

            return filesUpload;
        }

        [HttpGet("appointmentId/{appointmentId}")]
        public async Task<ActionResult<List<FilesUpload>>> GetFilesUploadByAppointment(int appointmentId)
        {
            var hospitalId = GetHospitalIdFromHeader();
            List<FilesUpload> fileUpload = await _context.FilesUploads.Where(e=>e.AppointmentId==appointmentId && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();

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

            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null) filesUpload.HospitalId = hospitalId;

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
            var hospitalId = GetHospitalIdFromHeader();
            filesUpload.HospitalId = hospitalId;
            _context.FilesUploads.Add(filesUpload);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFilesUpload", new { id = filesUpload.FileId }, filesUpload);
        }

        // DELETE: api/FilesUploads/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilesUpload(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            
            var filesUpload = await _context.FilesUploads.FirstOrDefaultAsync(f => f.FileId == id && (hospitalId == null || f.HospitalId == hospitalId));
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
