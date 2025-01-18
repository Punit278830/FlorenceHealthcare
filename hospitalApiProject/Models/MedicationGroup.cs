namespace hospitalApiProject.Models
{
  public class MedicationGroup
  {
    public int Id { get; set; }

    public int GroupId { get; set; }

    public string? MedName { get; set; }

    public string? MedType { get; set; }

    public string? Dose { get; set; }

    public string? Frequency { get; set; }

    public string? Timing { get; set; }

    public string? Duration { get; set; }

    public string? Instruction { get; set; }
  }
}
