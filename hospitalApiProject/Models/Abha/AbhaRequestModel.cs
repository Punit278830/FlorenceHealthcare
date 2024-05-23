namespace hospitalApiProject.Models.Abha
{
  public class AbhaRequestModel
  {
    public string txnId { get; set; }
    public string[] scope { get; set; }

    public string loginHint { get; set; }
    public string loginId { get; set; }
    public string otpSystem { get; set; }
  }
}
