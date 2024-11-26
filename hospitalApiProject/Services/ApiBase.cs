using Azure.Core;
using hospitalApiProject.Services.Interfaces.Shared;
using hospitalApiProject.Services.Shared;
using NuGet.Packaging.Signing;
using System.Net;
using System.Net.Http;
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
      client.DefaultRequestHeaders.Add("TIMESTAMP", DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'"));
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

    private HttpClient ClientForScan(string timeStamp)
    {
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);
      client.DefaultRequestHeaders.Add("REQUEST-ID", Guid.NewGuid().ToString());
      client.DefaultRequestHeaders.Add("TIMESTAMP", DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'"));
      //client.DefaultRequestHeaders.Add("TIMESTAMP", timeStamp);
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);

      return client;
    }

    public async Task<string> OnShareProfileAsync(string baseUrl, string api, string content, string timestamp)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = ClientForScan(timestamp);   

      var response = await SendPostRequestAsync(URL, client, content);

      return response;
    }

    public async Task<string> FetchModesAsync(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);

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

    //todo - remove duplicate of FetchModesAsync and keep a common name
    public async Task<string> LinkCareContextAsync(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);

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

    public async Task<string> OnDiscoverAsync(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetClient();
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");

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


    public async Task<string> OnDiscoverWithLogs(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      Console.WriteLine($"Request URL: {URL}");

      var request = new HttpRequestMessage(HttpMethod.Post, URL);


      // Optional: Set additional headers if needed
      //request.Headers.Accept.ParseAdd("application/json");


      var client = GetV3Client();
      client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
      //client.Headers.Accept.ParseAdd("application/json");

      Console.WriteLine("Request Headers:");

      foreach (var header in client.DefaultRequestHeaders)
      {
        Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
      }

      // Log the request body 
      Console.WriteLine($"Request Body: {content}");

      var stringContent = new StringContent(content, Encoding.UTF8, "application/json");
      var response = await client.PostAsync(URL, stringContent);
      Console.WriteLine($"Response Status Code: {(int)response.StatusCode}");

      if (response.IsSuccessStatusCode)
      {
        var responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response Body: {responseBody}");
        return responseBody;
      }

      // Log error details
      this.ErrorMessage = response.ReasonPhrase;
      this.StatusCode = response.StatusCode;
      Console.WriteLine($"Error Message: {this.ErrorMessage}");
      Console.WriteLine($"Status Code: {this.StatusCode}");
      return ErrorMessage;
    }



    #region M2 V3 Apis

    private HttpClient GetV3Client()
    {
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);
      client.DefaultRequestHeaders.Add("REQUEST-ID", Guid.NewGuid().ToString());
      client.DefaultRequestHeaders.Add("TIMESTAMP", DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'"));
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");
      client.DefaultRequestHeaders.Add("X-HIP-ID", "HIP_Florence");

      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
      return client;
    }

    public async Task<string> OnGenerateLinkToken(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetV3Client();

      //return await getResponse(content, client);
      return await SendPostRequestAsync(URL, client, content);
    }

    public async Task<string> OnLinkCareContextV3(string baseUrl, string api, string content, string linkToken)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);
      var client = GetV3Client();
      client.DefaultRequestHeaders.Add("X-LINK-TOKEN", linkToken);

      return await getResponse(content, client);
    }

    public async Task<string> OnConsentsOnNotifyV3(string baseUrl, string api, string content)
    {
      URL = string.Format("{0}/{1}", baseUrl, api);

      // Log the request URL
      Console.WriteLine($"Request URL: {URL}");

      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);
      client.DefaultRequestHeaders.Add("REQUEST-ID", Guid.NewGuid().ToString());
      client.DefaultRequestHeaders.Add("TIMESTAMP", DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'"));
      client.DefaultRequestHeaders.Add("X-CM-ID", "sbx");
      client.DefaultRequestHeaders.Add("X-HIP-ID", "HIP_Florence");

      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
      client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

      client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");

      // Log the request headers
      Console.WriteLine("Request Headers:");
      foreach (var header in client.DefaultRequestHeaders)
      {
        Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
      }

      Console.WriteLine($"Request Body: {content}");

      return await getResponse(content, client);
    }

    private async Task<string> getResponse(string content, HttpClient client)
    {
      var stringContent = new StringContent(content, Encoding.UTF8, "application/json");
      var response = await client.PostAsync(URL, stringContent);

      // Log the response status code
      Console.WriteLine($"Response Status Code: {(int)response.StatusCode}");

      if (response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      this.ErrorMessage = response.ReasonPhrase;
      this.StatusCode = response.StatusCode;
      return ErrorMessage;
    }


    #endregion

    private void GetAuthToken()
    {
      _token = _tokenService.GetTokenFromCache();
      if (_token == null)
      {
        _authService.GenerateAuthToken();
        _token = _tokenService.GetTokenFromCache();
      }
    }

    public async Task<string> SendPostRequestAsync(string url, HttpClient client, string content)
    {
      try
      {
        var stringContent = new StringContent(content, Encoding.UTF8, "application/json");

        Console.WriteLine("Request Headers:");

        //foreach (var header in client.DefaultRequestHeaders)
        //{
        //  Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
        //}

        // Log the request body 
        Console.WriteLine($"Request Body: {content}");
        // Send the POST request
        HttpResponseMessage response = await client.PostAsync(url, stringContent);

        // Read the response
        return await HandleResponseAsync(response);
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Exception caught: {ex.Message}");
      }

      return string.Empty;
    }

    private async Task<string> HandleResponseAsync(HttpResponseMessage response)
    {
      // Check if the request was successful
      if (response.IsSuccessStatusCode)
      {
        // Success - read the response content
        string responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response body: {responseBody}");
        return responseBody;
      }
      else
      {
        // If unsuccessful, handle errors and reason phrases
        Console.WriteLine($"Status Code: {(int)response.StatusCode}");
        Console.WriteLine($"Reason Phrase: {response.ReasonPhrase}");

        // Try to get the error message from the response content (if any)
        string errorContent = await response.Content.ReadAsStringAsync();
        if (!string.IsNullOrEmpty(errorContent))
        {
          Console.WriteLine($"Error Content: {errorContent}");
          return errorContent;
        }

        return response.ReasonPhrase;
      }
    }

  }
}
