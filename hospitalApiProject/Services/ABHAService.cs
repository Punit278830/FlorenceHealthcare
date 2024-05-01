using hospitalApiProject.Models.Abha;
using hospitalApiProject.Services.Shared;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using System.Text.Json;
using System.Text.Json.Serialization;

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
  }
}
