using hospitalApiProject.Models;
using hospitalApiProject.Models.Abha;
using hospitalApiProject.Models.Abha.M2;
using hospitalApiProject.Services.Abha;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AbhaController : Controller
  {
    protected readonly IAbhaService _service;
    //protected readonly IAbhaM2Service _abhaM2Service;


    public AbhaController(IAbhaService service) //, IAbhaM2Service abhaM2Service
    {
      _service = service;
      //_abhaM2Service = abhaM2Service;
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

    //[HttpPost]
    //[Route("CreateAbhaAddress")]
    //public async Task<IActionResult> CreateAbhaAddress(string txnId, string abhaAddress, string isPreferred)
    //{
    //  if (txnId == null || abhaAddress == null)
    //  {
    //    return BadRequest();
    //  }

    //  var result = await _service.CreateAbhaAddress(txnId, abhaAddress, isPreferred);
    //  if (_service.HasError)
    //  {
    //    return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
    //  }

    //  return StatusCode((int)HttpStatusCode.Created, result);
    //}

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

    #region Abha Address Creation by Abha Number

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

    [HttpPost]
    [Route("CreateAbhaDetails")]
    public async Task<IActionResult> CreateAbhaDetails([FromBody] AbhaDetailsRequest data)
    {
      if (data == null)
      {
        return BadRequest();
      }

      var result = await _service.CreateAbhaDetails(data);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPost]
    [Route("CreateAbhaAddressViaMobile")]
    public async Task<IActionResult> CreateAbhaAddressViaMobile([FromBody] NewAbhaAddressModel data)
    {
      if (data == null || data.phrAddress == null || data.txnId == null)
      {
        return BadRequest();
      }

      var result = await _service.CreateAbhaAddressViaMobile(data.phrAddress, data.txnId);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
    }

    #endregion

    #region Abha Address Creation by Abha Number

    [HttpPost]
    [Route("SearchUserByHealthId")]
    public async Task<IActionResult> SearchUserByHealthId([FromBody] EncryptedDataModel data)
    {
      if (data.EncryptedData == null)
      {
        return BadRequest();
      }

      var result = await _service.SearchUserByHealthId(data.EncryptedData);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPost]
    [Route("AbhaAddressViaAbhaOtp")]
    public async Task<IActionResult> AbhaAddressViaAbhaOtp([FromBody] AbhaAddressOtpModel data)
    {
      if (data.healhtIdNumber == null || data.authMethod == null)
      {
        return BadRequest();
      }

      var result = await _service.AbhaAddressViaAbhaOtp(data.healhtIdNumber, data.authMethod);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);

      }
      return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPost]
    [Route("AbhaAddressViaAbhaVerifyOTP")]
    public async Task<IActionResult> AbhaAddressViaAbhaVerifyOTP([FromBody] GenerateOtherOtp data)
    {
      if (data.EncryptedData == null || data.TxnId == null)
      {
        return BadRequest();
      }

      var result = await _service.AbhaAddressViaAbhaVerifyOTP(data.TxnId, data.EncryptedData);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);

      }
      return StatusCode((int)HttpStatusCode.Created, result);
    }


    [HttpPost]
    [Route("AbhaAddressSuggestions")]
    public async Task<IActionResult> AbhaAddressSuggestions([FromBody] GenerateOtherOtp data)
    {
      if (data.TxnId == null)
      {
        return BadRequest();
      }

      var result = await _service.AbhaAddressSuggestions(data.TxnId);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);

      }
      return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpGet]
    [Route("GetAbhaAddressExists")]
    public async Task<IActionResult> GetAbhaAddressExists(string phrAddress)
    {
      if (phrAddress == null)
      {
        return BadRequest();
      }

      var result = await _service.GetAbhaAddressExists(phrAddress);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.OK, result);
    }

    [HttpPost]
    [Route("CreatePHRAddress")]
    public async Task<IActionResult> CreatePHRAddress([FromBody] NewAbhaAddressModel data)
    {
      if (data == null || data.phrAddress == null || data.txnId == null)
      {
        return BadRequest();
      }

      var result = await _service.CreatePHRAddress(data.phrAddress, data.txnId);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);

      }
      return StatusCode((int)HttpStatusCode.Created, result);
    }
    #endregion

    #region Verification of ABHA Address

    //[HttpPost]
    //[Route("LinkCareContext")]
    //public async Task<IActionResult> LinkCareContext([FromBody] CareContextModel data)
    //{
    //  if (data == null)
    //  {
    //    return BadRequest();
    //  }

    //  var result = await _abhaM2Service.LinkCareContext(data);
    //  if (_service.HasError)
    //  {
    //    return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
    //  }

    //  return StatusCode((int)HttpStatusCode.Created, result);
    //}

    //[HttpPost]
    //[Route("NotifyMobile")]
    //public async Task<IActionResult> NotifyMobile([FromBody] CareContextModel data)
    //{
    //  if (data == null)
    //  {
    //    return BadRequest();
    //  }

    //  var result = await _abhaM2Service.NotifyMobile(data);
    //  if (_service.HasError)
    //  {
    //    return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
    //  }

    //  return StatusCode((int)HttpStatusCode.Created, result);
    //}

    [HttpGet]
    [Route("PipedreamTest")]
    public async Task<IActionResult> PipedreamTest()
    {
      //if (data == null)
      //{
      //  return BadRequest();
      //}

      return StatusCode((int)HttpStatusCode.OK, "Hello World");
    }

    [HttpPost("share")]
    public async Task<IActionResult> ShareData([FromBody] PatientShareRequest request)
    {
      if (request == null)
      {
        return BadRequest("Invalid request body");
      }

      var result = await _service.ShareProfile(request);

      return Ok(new { Message = "Data received successfully" });
    }

    #endregion

  }

}

