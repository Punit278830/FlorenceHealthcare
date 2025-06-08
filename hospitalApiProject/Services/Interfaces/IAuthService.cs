namespace hospitalApiProject.Services.Interfaces
{
  public interface IAuthService: ISimpleServiceBase
  {
    Task<string> GetTokenAsync();
  }
}
