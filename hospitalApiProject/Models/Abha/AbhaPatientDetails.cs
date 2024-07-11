namespace hospitalApiProject.Models.Abha
{
  public class AbhaPatientDetails
  { 
    public int Id { get; set; }

    public string AbhaNumber { get; set; }

    public string AbhaAddress { get; set; }

    public string FirstName { get; set; } = null!;

    public string? LastName { get; set; }

    public string? Mobile { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? Gender { get; set; }

    public DateOnly Dob { get; set; }

    public string? PatientImage { get; set; }

    public DateOnly? RegistrationDate { get; set; }

    public string? Status { get; set; }
  }

}
