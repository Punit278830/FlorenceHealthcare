namespace hospitalApiProject.Services
{
  public interface IAbhaService
  {
    Task<string> GenerateOtp(string aadhar);
    Task<string> EnrollByAadhaar(string txnId, string otp, string mobileNumber);
    Task<string> GetAbhaAddressSuggestion(string txnId);
    Task<string> CreateAbhaAddress(string txnId, string abhaAddress, string isPreferred);

  }
}
