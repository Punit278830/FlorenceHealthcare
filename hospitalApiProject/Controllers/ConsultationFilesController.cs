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
  public class ConsultationFilesController : WithHospitalController
  {
    public ConsultationFilesController(FlorenceDbContext context) : base(context)
    {
    }

    // GET: api/ConsultationFiles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ConsultationFile>>> GetConsultationFiles()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.ConsultationFiles.AsQueryable();
      if (hospitalId != null)
      {
        query = query.Where(f => f.HospitalId == hospitalId);
      }
      return await query.ToListAsync();
    }

    // GET: api/ConsultationFiles/file/1
    [HttpGet("file/{id}")]
    public async Task<ActionResult<ConsultationFile>> GetFileByFileId(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var filesUpload = await _context.ConsultationFiles
                         .FirstOrDefaultAsync(e => e.FileId == id && (hospitalId == null || e.HospitalId == hospitalId));

      if (filesUpload == null)
      {
        return NotFound();
      }

      return Ok(filesUpload);
    }


    // GET: api/ConsultationFiles/5
    [HttpGet("{AppointmentId}")]
    public async Task<ActionResult<List<ConsultationFile>>> GetConsultationFile(int AppointmentId)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var consultationFiles = await _context.ConsultationFiles
                                          .Where(e => e.AppointmentId == AppointmentId && (hospitalId == null || e.HospitalId == hospitalId))
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

      var hospitalId = GetHospitalIdFromHeader();

      var existingFile = await _context.ConsultationFiles.FirstOrDefaultAsync(f => f.FileId == id && (hospitalId == null || f.HospitalId == hospitalId));

      if (existingFile == null)
      {
        return NotFound();
      }

      // Update only the FileData property
      if (consultationFile.FileData != null)
      {
        existingFile.FileData = consultationFile.FileData;
      }

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
      var hospitalId = GetHospitalIdFromHeader();
      consultationFile.HospitalId = hospitalId;
      _context.ConsultationFiles.Add(consultationFile);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetConsultationFile", new { AppointmentId = consultationFile.AppointmentId }, consultationFile);
    }

    // DELETE: api/ConsultationFiles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConsultationFile(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var consultationFile = await _context.ConsultationFiles.FirstOrDefaultAsync(f => f.FileId == id && (hospitalId == null || f.HospitalId == hospitalId));
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
