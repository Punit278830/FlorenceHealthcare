
namespace hospitalApiProject.Services.Shared
{
  public interface ITokenService
  {
    string GetTokenFromCache();
    void SaveTokenInCache(string token, string expirationTime);
  }
}
