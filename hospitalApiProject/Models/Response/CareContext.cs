namespace hospitalApiProject.Models.Response;

public partial class CareContext
{
  public int Id { get; set; }

  public int PatientVisitId { get; set; }

  public string ReferenceNumber { get; set; }

  public string Display { get; set; }
}
