namespace hospitalApiProject.Models.Abha.response
{
  public class AddPatientResponse
  {
    public int PatientId { get; set; } // Patient ID if the operation is successful
    public string? ErrorMessage { get; set; } // Error message if there's an issue
    public bool IsSuccess => string.IsNullOrEmpty(ErrorMessage); // Convenience property
  }
}
