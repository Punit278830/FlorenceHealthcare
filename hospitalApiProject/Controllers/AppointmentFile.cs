public class AppointmentFile
{
  public int Id { get; set; }
  public string DocName { get; set; }
  public string FilePath { get; set; }
  public int PatientId { get; set; }
  public int AppointmentId { get; set; }
  public DateTime UploadedAt { get; set; }
}
