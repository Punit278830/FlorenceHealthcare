using Microsoft.Extensions.Caching.Memory;

namespace hospitalApiProject.Services.Shared
{
  public class TokenService : ITokenService
  {
    private readonly IMemoryCache _memoryCache;
    private readonly string _tokenCacheKey = "authToken";

    public TokenService(IMemoryCache memoryCache)
    {
      _memoryCache = memoryCache;
    }

    public void SaveTokenInCache(string token, string expirationTime)
    {
      //TODO: Add default expiration time
      int seconds = 0;
      if (int.TryParse(expirationTime, out int totalSeconds))
      {
        seconds = totalSeconds;
      }

      var timeSpan = TimeSpan.FromSeconds(seconds);
      _memoryCache.Set(_tokenCacheKey, token, timeSpan);
    }

    public string GetTokenFromCache()
    {
      _memoryCache.TryGetValue(_tokenCacheKey, out string token);
      return token;
    }
  }
}
