namespace hospitalApiProject.Models.Abha.M2
{
  public class AbhaAuthConfirm
  {
    public string txnId { get; set; }

    public string authCode { get; set; }
  }

  public class LinkCareContextRequest
  {
    public string AbhaNumber { get; set; }

    public string AbhaAddress { get; set; }

    public string VisitDetails { get; set; }

    public int AppointmentId { get; set; }
  }

  public class CareContextModel
  {
    //public string AbhaNumber { get; set; }

    //public string AbhaAddress { get; set; }

    public string AccessToken { get; set; }

    public string PhoneNumber { get; set; }

    public string transactionId { get; set; }
  }
  public class CareContext
  {
    public string referenceNumber { get; set; }
    public string display { get; set; }
  }

  public class OnDiscoverModel
  {
    public string transactionId { get; set; }
    public string requestId { get; set; }
  }

  public class Patient
  {
    public string referenceNumber { get; set; }
    public string display { get; set; }
    public List<CareContext> careContexts { get; set; }
    public string hiType { get; set; }
    public int count { get; set; }
  }

  public class Link
  {
    public string accessToken { get; set; }
    public Patient patient { get; set; }
  }

  public class JsonContent
  {
    public string requestId { get; set; }
    public string timestamp { get; set; }
    public Link link { get; set; }
  }

  public class Entry
  {
    public string content { get; set; }
    public string media { get; set; }
    public string checksum { get; set; }
    public string careContextReference { get; set; }
  }

  public class StatusResponse
  {
    public string careContextReference { get; set; }
    public string hiStatus { get; set; }
    public string description { get; set; }
  }

  public class StatusNotification
  {
    public string sessionStatus { get; set; }
    public string hipId { get; set; }
    public List<StatusResponse> statusResponses { get; set; }
  }

}
