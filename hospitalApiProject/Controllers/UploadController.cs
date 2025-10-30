using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UploadController : ControllerBase
  {
    private readonly string _targetFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

    [HttpPost("file-upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
      if (file == null || file.Length == 0)
        return BadRequest("No file uploaded.");

      // Ensure upload directory exists
      if (!Directory.Exists(_targetFilePath))
        Directory.CreateDirectory(_targetFilePath);

      // Unique file name
      var fileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{DateTime.Now.Ticks}{Path.GetExtension(file.FileName)}";
      var fullPath = Path.Combine(_targetFilePath, fileName);

      using (var stream = new FileStream(fullPath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      // Return file info
      return Ok(new
      {
        message = "File uploaded successfully!",
        fileName = fileName,
        path = fullPath
      });
    }
  }
}
