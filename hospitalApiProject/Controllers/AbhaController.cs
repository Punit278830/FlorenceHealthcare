using hospitalApiProject.Models;
using hospitalApiProject.Services.Abha;
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
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
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
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
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
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
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
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
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
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.OK, result);
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
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
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

    [HttpPost]
    [Route("GenerateMobileOtpForAbhaAddress")]
    public async Task<IActionResult> GenerateMobileOtpForAbhaAddress([FromBody] EncryptedDataModel data)
    {
      if (data.EncryptedData == null)
      {
        return BadRequest();
      }

      var result = await _service.GenerateMobileOtp(data.EncryptedData);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPost]
    [Route("ConfirmMobileOtpForAbhaAddress")]
    public async Task<IActionResult> ConfirmMobileOtpForAbhaAddress([FromBody] GenerateOtherOtp data)
    {
      if (data == null)
      {
        return BadRequest();
      }

      var result = await _service.ConfirmMobileOtpForAbhaAddress(data.EncryptedData, data.TxnId);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpGet]
    [Route("GetExistingAbhaAddresses")]
    public async Task<IActionResult> GetExistingAbhaAddresses(string phrAddress)
    {
      if (phrAddress == null)
      {
        return BadRequest();
      }

      var result = await _service.GetExistingAbhaAddresses(phrAddress);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.OK, result);
    }

  }
}
