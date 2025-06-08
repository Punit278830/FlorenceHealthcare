namespace hospitalApiProject.Services.Interfaces
{
  public interface IAuthService
  {
    Task<string> GetTokenAsync();
  }
}
