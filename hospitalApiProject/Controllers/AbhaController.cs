using hospitalApiProject.Services;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AbhaController : Controller
  {
    protected readonly IAbhaService _service;

    public AbhaController(IAbhaService service)
    {
      _service = service;
    }

    [HttpPost]
    [Route("GenerateAadharOtp")]
    public async Task<IActionResult> GenerateAadharOtp(string aadhar)
    {
      if (aadhar == null)
      {
        return BadRequest();
      }

      var result = await _service.GenerateOtp(aadhar);
      return Ok(result);
    }
  }
}
