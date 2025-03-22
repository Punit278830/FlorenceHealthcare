namespace hospitalApiProject.Models.Response;

public partial class PatientVisit
{
  public int Id { get; set; }

  public int PatientId { get; set; }

  public string ReferenceNumber { get; set; }

  public string Display { get; set; }

  public string HiType { get; set; }

  public DateTime VisitDate { get; set; }

  // Navigation property for related CareContexts
  public ICollection<CareContext> CareContexts { get; set; }
}
