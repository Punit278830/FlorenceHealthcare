namespace hospitalApiProject.Services.Interfaces.Shared
{
  public interface ITokenService
  {
    string GetTokenFromCache();
    void SaveTokenInCache(string token, string expirationTime);
  }
}
