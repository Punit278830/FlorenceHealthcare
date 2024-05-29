using hospitalApiProject.Models.Abha;
using hospitalApiProject.Services.Interfaces.Shared;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace hospitalApiProject.Services.Abha
{
  public class ABHAService : ApiBase, IAbhaService
  {
    protected readonly string _baseUrl;
    protected readonly string _phrBaseUrl;

    protected readonly IAuthService _authService;
    protected readonly string _token;

    public ABHAService(ITokenService tokenService, IAuthService authService) : base(tokenService, authService)
    {
      _baseUrl = "https://abhasbx.abdm.gov.in/abha";
      _phrBaseUrl = "https://phrsbx.abdm.gov.in";
    }

    public async Task<string> GenerateOtp(string aadhar)
    {
      try
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

        return result;
      }
      catch (Exception ex)
      {
        this.ErrorMessage = ex.Message;
        return default;
      }
    }

    public Task<string> GenerateOtherOtp(string data, string txnId)
    {
      var jsonContent = new AbhaRequestModel
      {
        txnId = txnId,
        scope = [
        "abha-enrol",
        "mobile-verify"],
        loginHint = "mobile",
        loginId = data,
        otpSystem = "abdm"
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
            txnId,
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

    public Task<string> EnrollByAbdm(string txnId, string otp)
    {
      var jsonContent = new
      {
        scope = new[] {
        "abha-enrol",
        "mobile-verify" },

        authData = new
        {
          authMethods = new[] {
            "otp"
          },
          otp = new
          {
            timeStamp = DateTime.Now.ToString("YYYY-MM-DD HH:mm:ss"),
            txnId,
            otpValue = otp
          }
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/auth/byAbdm", json);
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
        txnId,
        abhaAddress,
        preferred = isPreferred
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/enrol/abha-address", json);
      return Task.FromResult(result);
    }

    public Task<byte[]> DownloadAbhaCard(string xToken)
    {
      var result = ExecuteGetForCard("https://healthidsbx.abdm.gov.in", "api/v1/account/getCard", xToken);

      return Task.FromResult(result);
    }

    public async Task<string> GenerateMobileOtp(string mobile)
    {
      try
      {
        var jsonContent = new
        {
          value = mobile
        };

        var json = JsonSerializer.Serialize(jsonContent);
        var result = await ExecutePostV1Async(_phrBaseUrl, "api/v1/phr/registration/generate/otp", json);

        return result;
      }
      catch (Exception ex)
      {
        this.ErrorMessage = ex.Message;
        return default;
      }
    }

    public async Task<string> ConfirmMobileOtpForAbhaAddress(string data, string txnId)
    {
      var jsonContent = new
      {
        otp = data,
        transactionId = txnId
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await ExecutePostV1Async(_phrBaseUrl, "api/v1/phr/registration/verify/otp", json);
      return result;
    }

    public async Task<string> SearchUserByHealthId(string healhtIdNumber)
    {
      var jsonContent = new
      {
        healhtIdNumber = healhtIdNumber
      };
      var json = JsonSerializer.Serialize(jsonContent);

      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/hid/search/auth-methods", json);
      return result;
    }

    public async Task<string> AbhaAddressViaAbhaOtp(string healhtIdNumber, string authMethod)
    {
      var jsonContent = new
      {
        authMethod = authMethod,
        healhtIdNumber = healhtIdNumber
      };

      var json = JsonSerializer.Serialize(jsonContent);

      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/hid/init/transaction", json);
      return result;
    }

    public async Task<string> AbhaAddressViaAbhaVerifyOTP(string txnId, string data)
    {
      var jsonContent = new
      {
        transactionId = txnId,
        value = data
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/hid/confirm/credential", json);
      return result;
    }

    public async Task<string> AbhaAddressSuggestions(string txnId)
    {
      var jsonContent = new
      {
        transactionId = txnId
      };

      var json = JsonSerializer.Serialize(jsonContent);

      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/phr/suggestion", json);
      return result;
    }

    public async Task<string> GetAbhaAddressExists(string phrAddress)
    {
      var result = await ExecutePHRGetAsync(_phrBaseUrl, "api/v1/phr/search/isExist?phrAddress=" + phrAddress);
      return result;
    }

    public async Task<string> CreatePHRAddress(string phrAddress, string txnId)
    {
      var exists = await GetAbhaAddressExists(phrAddress);

      if (exists == "true")
      {
        this.ErrorMessage = "The PHR address already exists.";
        return null;
      }

      var jsonContent = new
      {
        password = "",
        phrAddress = phrAddress,
        transactionId = txnId
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/hid/create-phr-address", json);
      return result;
    }
  }
}
