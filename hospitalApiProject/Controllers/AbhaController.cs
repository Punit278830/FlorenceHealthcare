using hospitalApiProject.Models;
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
    public async Task<IActionResult> GenerateAadharOtp([FromBody] EncryptedDataModel aadhar)
    {
      if (aadhar == null)
      {
        return BadRequest();
      }

      var result = await _service.GenerateOtp(aadhar.EncryptedData);
      return Ok(result);
    }

    [HttpPost]
    [Route("EnrollByAadhaar")]
    public async Task<IActionResult> EnrollByAadhaar([FromBody] EnrollByAadharModel data)
    {
      if (data.TxnId == null || data.EncryptedData == null || data.MobileNumber == null)
      {
        return BadRequest();
      }

      var result = await _service.EnrollByAadhaar(data.TxnId, data.EncryptedData, data.MobileNumber);
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
