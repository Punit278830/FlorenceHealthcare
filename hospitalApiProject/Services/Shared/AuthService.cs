using hospitalApiProject.Services.Interfaces.Shared;
using Newtonsoft.Json.Linq;
using System.Security.Policy;
using System.Text;
using System.Text.Json;

namespace hospitalApiProject.Services
{
  public class AuthService : IAuthService
  {
    protected readonly string _clientId;
    protected readonly string _clientSecret;
    protected readonly string _token;
    protected readonly ITokenService _tokenService;

    public AuthService(IConfiguration configuration, ITokenService tokenService)
    {
      _clientId = configuration.GetSection("ABDMService").GetSection("ClientId").Value;
      _clientSecret = configuration.GetSection("ABDMService").GetSection("ClientSecret").Value;

      _tokenService = tokenService;
    }

    public string GenerateAuthToken()
    {
      string token = null;
      //ExecuteGet();
      var client = new HttpClient();
      client.DefaultRequestHeaders.Add("REQUEST-ID", Guid.NewGuid().ToString());
      client.DefaultRequestHeaders.Add("TIMESTAMP", DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'"));
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");

      using StringContent jsonContent = new(
        JsonSerializer.Serialize(new
        {
          clientId = _clientId,
          clientSecret = _clientSecret,
          grantType = "client_credentials"
        }),
        Encoding.UTF8,
        "application/json");

      var response = client.PostAsync("https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions", jsonContent).Result;

      if (response.IsSuccessStatusCode)
      {
        var jsonResponse = response.Content.ReadAsStringAsync().Result;

        var jObject = JObject.Parse(jsonResponse);
        token = jObject["accessToken"].ToString();
        string expiresIn = jObject["expiresIn"].ToString();

        _tokenService.SaveTokenInCache(token, expiresIn);
      }

      return token;
    }
  }
}
