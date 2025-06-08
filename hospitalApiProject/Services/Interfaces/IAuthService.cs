namespace hospitalApiProject.Services.Interfaces
{
  public interface IAuthService: ISimpleServiceBases
  {
    Task<string> GetTokenAsync();
  }
}
