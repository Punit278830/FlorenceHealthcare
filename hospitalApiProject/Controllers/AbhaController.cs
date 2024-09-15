using hospitalApiProject.Models;
using hospitalApiProject.Models.Abha;
using hospitalApiProject.Models.Abha.M2;
using hospitalApiProject.Services.Abha;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using System.Net;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AbhaController : Controller
  {
    protected readonly IAbhaService _service;
    private readonly IPatientInfoService _patientInfoService;

    protected readonly IAbhaM2Service _abhaM2Service;
    private readonly FlorenceDbContext _context;

    public AbhaController(IAbhaService service, FlorenceDbContext context, IPatientInfoService patientInfoService, IAbhaM2Service abhaM2Service)
    {
      _service = service;
      _context = context;
      _patientInfoService = patientInfoService;
      _abhaM2Service = abhaM2Service;
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

    [HttpPost]
    [Route("FetchModes")]
    public async Task<IActionResult> FetchModes([FromBody] string abhaAddress) //purpose field
    {
      if (abhaAddress == null)
      {
        return BadRequest();
      }

      await _service.FetchModes(abhaAddress);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Accepted);
    }

    [HttpPost]
    [Route("AbhaAddressAuthInit")]
    public async Task<IActionResult> AbhaAddressAuthInit([FromBody] string abhaAddress) //purpose field
    {
      if (abhaAddress == null)
      {
        return BadRequest();
      }

      await _service.AbhaAddressAuthInit(abhaAddress);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Accepted);
    }

    [HttpPost]
    [Route("AbhaAddressAuthConfirm")]
    public async Task<IActionResult> AbhaAddressAuthConfirm([FromBody] AbhaAuthConfirm request) //purpose field
    {
      if (request == null || request.txnId == null || request.authCode == null)
      {
        return BadRequest();
      }

      await _service.AbhaAddressAuthConfirm(request.txnId, request.authCode);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Accepted);
    }

    [HttpPost]
    [Route("LinkCareContext")]
    public async Task<IActionResult> LinkCareContext([FromBody] CareContextModel data)
    {
      if (data == null)
      {
        return BadRequest();
      }

      await _abhaM2Service.LinkCareContext(data);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int
        )HttpStatusCode.Created);
    }

    [HttpPost]
    [Route("CareContextNotifyMobile")]
    public async Task<IActionResult> CareContextNotifyMobile([FromBody] CareContextModel data)
    {
      if (data == null)
      {
        return BadRequest();
      }

      await _abhaM2Service.NotifyMobile(data);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created);
    }

    [HttpPost]
    [Route("OnDiscover")]
    public async Task<IActionResult> OnDiscover([FromBody] OnDiscoverModel data)
    {
      if (data == null)
      {
        return BadRequest();
      }

      await _abhaM2Service.OnDiscover(data);
      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return StatusCode((int)HttpStatusCode.Created);
    }

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

      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      await _service.AddAbhaPatientProfile(request.patient);
      if (_service.HasError)
      {
        return StatusCode(500, _service.ErrorMessage);
      }

      return Ok();
    }

    [HttpPost("ConsentOnNotify")]
    public async Task<IActionResult> ConsentsOnNotify([FromBody] ConsentOnNotify request)
    {
      if (request == null)
      {
        return BadRequest("Invalid request body");
      }

      await _service.ConsentsOnNotifyV3(request.ConsentId);

      if (_service.HasError)
      {
        return StatusCode((int)_service.StatusCode, _service.ErrorMessage);
      }

      return Ok();
    }

    [HttpGet("ScanDesk/Patients")]
    public async Task<ActionResult<List<AbhaPatientDetails>>> GetScannedPatients()
    {
      try
      {
        DateOnly today = DateOnly.FromDateTime(DateTime.Today);
        DateOnly tomorrow = today.AddDays(1);

        List<AbhaPatientDetails> patientData = await _context.AbhaPatientDetails
    .Where(e => e.RegistrationDate.HasValue && e.RegistrationDate.Value >= today && e.RegistrationDate.Value < tomorrow)
    .ToListAsync();

        if (patientData != null)
        {
          return Ok(patientData);
        }

        return NotFound();
      }
      catch (Exception ex)
      {
        var msg = ex.ToString();
        return BadRequest();
      }
    }

    #endregion

  }

}

