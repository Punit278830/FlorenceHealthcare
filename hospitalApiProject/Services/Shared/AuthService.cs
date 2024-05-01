using hospitalApiProject.Services.Shared;
using Newtonsoft.Json.Linq;
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

    public void GenerateAuthToken()
    {
      //ExecuteGet();
      var client = new HttpClient();

      using StringContent jsonContent = new(
        JsonSerializer.Serialize(new
        {
          clientId = _clientId,
          clientSecret = _clientSecret
        }),
        Encoding.UTF8,
        "application/json");

      var response = client.PostAsync("https://dev.abdm.gov.in/gateway/v0.5/sessions", jsonContent).Result;

      if (response.IsSuccessStatusCode)
      {
        var jsonResponse = response.Content.ReadAsStringAsync().Result;

        var jObject = JObject.Parse(jsonResponse);
        string token = jObject["accessToken"].ToString();
        string expiresIn = jObject["expiresIn"].ToString();

        _tokenService.SaveTokenInCache(token, expiresIn);
        //return token;
      }

      //return null;
    }
  }
}
