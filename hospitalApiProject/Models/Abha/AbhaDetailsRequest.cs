namespace hospitalApiProject.Models.Abha
{
  public class AbhaDetailsRequest
  {
    public string address { get; set; } = string.Empty;
    public string countryCode { get; set; } = "+91";
    public string dayOfBirth { get; set; } = string.Empty;
    public string districtCode { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string firstName { get; set; } = string.Empty;
    public string gender { get; set; } = string.Empty;
    public string lastName { get; set; } = string.Empty;
    public string middleName { get; set; } = string.Empty;
    public string mobile { get; set; }
    public string monthOfBirth { get; set; } = string.Empty;
    public string pinCode { get; set; } = string.Empty;
    public string stateCode { get; set; } = string.Empty;
    public string transactionId { get; set; }
    public string yearOfBirth { get; set; }
  }
}
