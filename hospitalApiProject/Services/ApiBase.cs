using hospitalApiProject.Services.Interfaces.Shared;
using hospitalApiProject.Services.Shared;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace hospitalApiProject.Services
{
  public class ApiBase : SimpleServiceBase
  {
    protected ITokenService _tokenService;
    protected readonly IAuthService _authService;
    protected string _token;

    public string URL { get; set; }

    public ApiBase(ITokenService tokenService, IAuthService authService)
    {
      _tokenService = tokenService;
      _authService = authService;
      GetAuthToken();
    }

    public virtual string ExecuteGet(string baseUrl, string api, string additionalData)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetClient();

      client.DefaultRequestHeaders.Add("TRANSACTION_ID", additionalData);

      var response = client.GetAsync(URL).Result;

      if (response != null && response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      this.ErrorMessage = response.ReasonPhrase;
      this.StatusCode = response.StatusCode;
      return ErrorMessage;
    }

    public virtual byte[] ExecuteGetForCard(string baseUrl, string api, string additionalData)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetV1Client(additionalData);

      var response = client.GetAsync(URL).Result;

      if (response != null && response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsByteArrayAsync().Result;
      }

      return default;
    }

    public virtual string ExecuteGet1(string baseUrl, string api, string additionalData)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetV1Client(additionalData);

      var response = client.GetAsync(URL).Result;

      if (response != null && response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      return default;
    }

    public async Task<string> ExecutePHRGetAsync(string baseUrl, string api)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetPHRClient();

      var response = client.GetAsync(URL).Result;

      if (response != null && response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      return default;
    }

    protected virtual string ExecutePost(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetClient();

      var stringContent = new StringContent(content, Encoding.UTF8, "application/json");
      var response = client.PostAsync(URL, stringContent).Result;

      if (response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      this.ErrorMessage = response.ReasonPhrase;
      this.StatusCode = response.StatusCode;
      return ErrorMessage;
    }

    protected async Task<string> ExecutePostAsync(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetPHRClient();

      var stringContent = new StringContent(content, Encoding.UTF8, "application/json");
      var response = await client.PostAsync(URL, stringContent);

      if (response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      this.ErrorMessage = response.ReasonPhrase;
      this.StatusCode = response.StatusCode;
      return ErrorMessage;
    }


    protected async Task<string> ExecutePostV1Async(string baseUrl, string api, string content)
    {
      URL = $"{baseUrl}/{api}";
      using var client = new HttpClient { BaseAddress = new Uri(URL) };
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");


      var stringContent = new StringContent(content, Encoding.UTF8, "application/json");
      var response = await client.PostAsync(URL, stringContent);

      if (response.IsSuccessStatusCode)
      {
        return await response.Content.ReadAsStringAsync();
      }

      this.ErrorMessage = response.ReasonPhrase;
      this.StatusCode = response.StatusCode;
      return ErrorMessage;
    }

    private HttpClient GetClient()
    {
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);
      client.DefaultRequestHeaders.Add("REQUEST-ID", Guid.NewGuid().ToString());
      client.DefaultRequestHeaders.Add("TIMESTAMP", DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.sss'Z'"));
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
      return client;
    }

    private HttpClient GetV1Client(string xToken)
    {
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);
      client.DefaultRequestHeaders.Add("accept", "*/*");
      client.DefaultRequestHeaders.Add("Accept-Language", "en-US");
      client.DefaultRequestHeaders.Add("X-Token", xToken);
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
      return client;
    }

    private HttpClient GetPHRClient()
    {
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);

      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
      return client;
    }

    private HttpClient ClientForScan()
    {
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);
      client.DefaultRequestHeaders.Add("accept", "*/*");
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
      return client;
    }

    public async Task<string> OnShareProfileAsync(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = ClientForScan();

      var stringContent = new StringContent(content, Encoding.UTF8, "application/json");
      var response = await client.PostAsync(URL, stringContent);

      if (response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      this.ErrorMessage = response.ReasonPhrase;
      this.StatusCode = response.StatusCode;
      return ErrorMessage;
    }

    private void GetAuthToken()
    {
      _token = _tokenService.GetTokenFromCache();
      if (_token == null)
      {
        _authService.GenerateAuthToken();
        _token = _tokenService.GetTokenFromCache();
      }
    }
  }
}
