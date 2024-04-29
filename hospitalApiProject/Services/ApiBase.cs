using System.Text;

namespace hospitalApiProject.Services
{
  public class ApiBase
  {
    protected readonly string _clientId;
    protected readonly string _clientSecret;
    public string URL { get; set; }

    public ApiBase(string clientId, string clientSecret, string baseUrl)
    {
      _clientId = clientId;
      _clientSecret = clientSecret;
      URL = baseUrl;
    }

    public virtual string ExecuteGet()
    {
      var client = GetClient();

      var response = client.GetAsync(URL).Result;

      if (response != null && response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      return string.Format("Status code: {0}, Reason: {1}", (int)response.StatusCode, response.ReasonPhrase);
    }

    protected virtual string ExecutePost(string content)
    {
      var client = GetClient();

      var stringContent = new StringContent(content, Encoding.UTF8, "application/json");
      var response = client.PostAsync(URL, stringContent).Result;

      if (response.IsSuccessStatusCode)
      {
        return response.Content.ReadAsStringAsync().Result;
      }

      return response.ToString();
    }

    private HttpClient GetClient()
    {
      var client = new HttpClient();
      client.BaseAddress = new Uri(URL);

      return client;
    }
  }
}
