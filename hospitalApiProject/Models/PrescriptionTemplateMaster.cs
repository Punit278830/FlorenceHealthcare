namespace hospitalApiProject.Models
{
  public class PrescriptionTemplateMaster
  {
    public int Id { get; set; }

    public required string TemplateName { get; set; }

    public string? ExaminationNote { get; set; }

    public string? Advice { get; set; }

    public string? DiffDiagnosis { get; set; }

    public string? FinalDiagnosis { get; set; }

    public int? DiagnosisId { get; set; }

    // Nullable HospitalId for multi-tenant support
    public int? HospitalId { get; set; }
  }
}
