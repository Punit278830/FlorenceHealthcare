using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesUploadsController : ControllerBase
    {
        private readonly IFilesUploadService _filesUploadService;

        public FilesUploadsController(IFilesUploadService filesUploadService)
        {
            _filesUploadService = filesUploadService;
        }

        // GET: api/FilesUploads
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FilesUpload>>> GetFilesUploads()
        {
            var filesUploads = await _filesUploadService.GetAllFilesUploadsAsync();
            return Ok(filesUploads);
        }

        // GET: api/FilesUploads/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FilesUpload>> GetFilesUpload(int id)
        {
            var filesUpload = await _filesUploadService.GetFilesUploadByIdAsync(id);

            if (filesUpload == null)
            {
                return NotFound();
            }

            return filesUpload;
        }

        // GET: api/FilesUploads/appointment/5
        [HttpGet("appointment/{appointmentId}")]
        public async Task<ActionResult<List<FilesUpload>>> GetFilesUploadByAppointmentId(int appointmentId)
        {
            var filesUploads = await _filesUploadService.GetFilesUploadByAppointmentIdAsync(appointmentId);
            return Ok(filesUploads);
        }

        // PUT: api/FilesUploads/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFilesUpload(int id, FilesUpload filesUpload)
        {
            try
            {
                await _filesUploadService.UpdateFilesUploadAsync(id, filesUpload);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // POST: api/FilesUploads
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FilesUpload>> PostFilesUpload(FilesUpload filesUpload)
        {
            var createdFilesUpload = await _filesUploadService.CreateFilesUploadAsync(filesUpload);
            return CreatedAtAction("GetFilesUpload", new { id = createdFilesUpload.FileId }, createdFilesUpload);
        }

        // DELETE: api/FilesUploads/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilesUpload(int id)
        {
            try
            {
                await _filesUploadService.DeleteFilesUploadAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
