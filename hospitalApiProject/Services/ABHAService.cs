using hospitalApiProject.Models.Abha;
using hospitalApiProject.Services.Shared;
using System.Text.Json;

namespace hospitalApiProject.Services
{
  public class ABHAService : ApiBase, IAbhaService
  {
    protected readonly string _baseUrl;
    protected readonly IAuthService _authService;
    protected readonly string _token;
    public ABHAService(ITokenService tokenService, IAuthService authService) : base(tokenService, authService)
    {
      _baseUrl = "https://abhasbx.abdm.gov.in/abha";
    }

    public Task<string> GenerateOtp(string aadhar)
    {
      var jsonContent = new AbhaRequestModel
      {
        txnId = "",
        scope = [
        "abha-enrol" ],
        loginHint = "aadhaar",
        loginId = aadhar,
        otpSystem = "aadhaar"
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/request/otp", json);
      return Task.FromResult(result);
    }

    public Task<string> EnrollByAadhaar(string txnId, string otp, string mobileNumber)
    {
      var jsonContent = new
      {
        authData = new
        {
          authMethods = new[] {
            "otp"
        },
          otp = new
          {
            timeStamp = DateTime.Now.ToString("YYYY-MM-DD HH:mm:ss"),
            txnId = txnId,
            otpValue = otp,
            mobile = mobileNumber
          }
        },
        consent = new
        {
          code = "abha-enrollment",
          version = "1.4"
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/enrol/byAadhaar", json);
      return Task.FromResult(result);
    }

    public Task<string> GetAbhaAddressSuggestion(string txnId)
    {
      var result = ExecuteGet(_baseUrl, "api/v3/enrollment/enrol/suggestion", txnId);
      return Task.FromResult(result);
    }

    public Task<string> CreateAbhaAddress(string txnId, string abhaAddress, string isPreferred)
    {
      var jsonContent = new
      {
        txnId = txnId,
        abhaAddress = abhaAddress,
        preferred = isPreferred
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/enrol/abha-address", json);
      return Task.FromResult(result);
    }
  }
}
