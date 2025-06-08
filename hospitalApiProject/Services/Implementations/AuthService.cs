using System.Text.Json;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly string _clientId;
        private readonly string _clientSecret;
        private string _token = string.Empty;
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _clientId = _configuration["Auth:ClientId"] ?? throw new InvalidOperationException("ClientId configuration is missing");
            _clientSecret = _configuration["Auth:ClientSecret"] ?? throw new InvalidOperationException("ClientSecret configuration is missing");
        }

        public async Task<string> GetTokenAsync()
        {
            if (!string.IsNullOrEmpty(_token))
            {
                return _token;
            }

            using var client = new HttpClient();
            var tokenEndpoint = _configuration["Auth:TokenEndpoint"] ?? throw new InvalidOperationException("TokenEndpoint configuration is missing");
            
            var tokenRequest = new
            {
                client_id = _clientId,
                client_secret = _clientSecret,
                grant_type = "client_credentials"
            };

            var response = await client.PostAsJsonAsync(tokenEndpoint, tokenRequest);
            response.EnsureSuccessStatusCode();

            var tokenResponse = await response.Content.ReadFromJsonAsync<TokenResponse>();
            if (tokenResponse?.AccessToken == null)
            {
                throw new InvalidOperationException("Failed to obtain access token");
            }

            _token = tokenResponse.AccessToken;
            return _token;
        }
    }
}
