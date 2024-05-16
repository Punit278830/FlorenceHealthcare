using hospitalApiProject.Models;
using hospitalApiProject.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

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
    [Route("GenerateOtherOtp")]
    public async Task<IActionResult> GenerateOtherOtp([FromBody] GenerateOtherOtp data)
    {
      if (data == null)
      {
        return BadRequest();
      }

      var result = await _service.GenerateOtherOtp(data.EncryptedData, data.TxnId);
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

    [HttpPost]
    [Route("EnrollByAbdm")]
    public async Task<IActionResult> EnrollByAbdm([FromBody] EnrollByAadharModel data)
    {
      if (data.TxnId == null || data.EncryptedData == null)
      {
        return BadRequest();
      }

      var result = await _service.EnrollByAbdm(data.TxnId, data.EncryptedData);
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

    [HttpGet]
    [Route("DownloadAbhaCard")]
    public async Task<IActionResult> DownloadAbhaCard([FromHeader] string xToken)
    {
      if (xToken == null)
      {
        return BadRequest();
      }

      var result = await _service.DownloadAbhaCard(xToken);
      return new FileContentResult(result, "application/pdf");
    }
  }
}
