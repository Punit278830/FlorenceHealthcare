namespace hospitalApiProject.Services
{
  public interface IAbhaService
  {
    Task<string> GenerateOtp(string aadhar);

    Task<string> GenerateOtherOtp(string mobile, string txnId);

    Task<string> EnrollByAadhaar(string txnId, string otp, string mobileNumber);

    Task<string> EnrollByAbdm(string txnId, string otp);

    Task<string> GetAbhaAddressSuggestion(string txnId);
    Task<string> CreateAbhaAddress(string txnId, string abhaAddress, string isPreferred);

    Task<byte[]> DownloadAbhaCard(string xToken);
  }
}
