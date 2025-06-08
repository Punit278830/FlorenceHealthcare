namespace hospitalApiProject.Services.Interfaces
{
  public interface ITokenService
  {
    string GetTokenFromCache();
    void SaveTokenInCache(string token, string expirationTime);
  }
}
