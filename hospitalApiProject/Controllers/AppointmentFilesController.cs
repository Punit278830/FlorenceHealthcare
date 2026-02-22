using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class AppointmentFileUploadRequest
{
  [Required]
  public IFormFile File { get; set; }


}
[Route("api/[controller]")]
[ApiController]
public class AppointmentFilesController : ControllerBase
{
  private readonly IWebHostEnvironment _env;
  private readonly FlorenceDbContext _context;

  public AppointmentFilesController(IWebHostEnvironment env, FlorenceDbContext context)
  {
    _env = env;
    _context = context;
  }

  [HttpPost]
  [Consumes("multipart/form-data")]
  public async Task<IActionResult> Upload([FromForm] AppointmentFileUploadRequest request)
  {
    if (request.File == null || request.File.Length == 0)
      return BadRequest("No file uploaded");

    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
    Directory.CreateDirectory(uploadsFolder);

    var fileName = $"{DateTime.Now.Ticks}_{request.File.FileName}";
    var filePath = Path.Combine(uploadsFolder, fileName);

    using (var stream = new FileStream(filePath, FileMode.Create))
    {
      await request.File.CopyToAsync(stream);
    }

    var doc = new AppointmentFile
    {
     
      FilePath = $"/uploads/{fileName}",
      UploadedAt = DateTime.Now
    };

    _context.AppointmentFiles.Add(doc);
    await _context.SaveChangesAsync();

    return Ok(doc);
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetFile(int id)
  {
    var doc = await _context.AppointmentFiles.FindAsync(id);
    if (doc == null) return NotFound();

    var filePath = Path.Combine(_env.WebRootPath, doc.FilePath.TrimStart('/'));
    var mimeType = "application/octet-stream";
    return PhysicalFile(filePath, mimeType);
  }

  [HttpGet("patient/{patientId}")]
  public async Task<IActionResult> GetFilesByPatient(int patientId)
  {
    var docs = await _context.AppointmentFiles
        .Where(d => d.PatientId == patientId)
        .ToListAsync();

    return Ok(docs);
  }
}
