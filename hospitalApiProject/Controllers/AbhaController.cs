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

    [HttpPost]
    [Route("EnrollByAadhaar")]
    public async Task<IActionResult> EnrollByAadhaar(string txnId, string otp, string mobileNumber)
    {
      if (txnId == null || otp == null || mobileNumber == null)
      {
        return BadRequest();
      }

      var result = await _service.EnrollByAadhaar(txnId, otp, mobileNumber);
      return Ok(result);
    }

    [HttpGet]
    [Route("GetAbhaAddressSuggestion")]
    public async Task<IActionResult> GetAbhaAddressSuggestion(string txnId)
    {
      if (txnId == null)
      {
        return BadRequest();
      }

      var result = await _service.GetAbhaAddressSuggestion(txnId);
      return Ok(result);
    }

    [HttpPost]
    [Route("CreateAbhaAddress")]
    public async Task<IActionResult> CreateAbhaAddress(string txnId, string abhaAddress, string isPreferred)
    {
      if (txnId == null || abhaAddress == null)
      {
        return BadRequest();
      }

      var result = await _service.CreateAbhaAddress(txnId, abhaAddress, isPreferred);
      return Ok(result);
    }
  }
}
