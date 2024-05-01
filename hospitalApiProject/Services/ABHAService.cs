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
      _baseUrl = "https://dev.abdm.gov.in/gateway/v0.5";
    }

    public Task<string> GenerateOtp(string aadhar)
    {
      var jsonContent = new
      {
        txnId = "",
        scope = new[] {
        "abha-enrol" },
        loginHint = "aadhaar",
        loginId = aadhar,
        otpSystem = "aadhaar"
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost("https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request", "otp", json);
      return Task.FromResult(result);
    }
  }
}
