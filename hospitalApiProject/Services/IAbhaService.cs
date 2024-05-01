namespace hospitalApiProject.Services
{
  public interface IAbhaService
  {
    Task<string> GenerateOtp(string aadhar);
  }
}
