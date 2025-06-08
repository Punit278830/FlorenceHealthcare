namespace hospitalApiProject.Services.Interfaces
{
  public interface ITokenService: ISimpleServiceBase
  {
    string GetTokenFromCache();
    void SaveTokenInCache(string token, string expirationTime);
  }
}
