namespace hospitalApiProject.Models
{
  public partial class AppointmentWithInvoiceDto
  {
    public int Id { get; set; }

    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public int? Departmentid { get; set; }

    public int? ScheduledByid { get; set; }

    // All DateTime and DateOnly values in this model must be stored and interpreted as IST (Asia/Kolkata)
    public DateTime Date { get; set; }

    public string? Notes { get; set; }

    public string? AppointTime { get; set; }

    public string? AppointmentStatus { get; set; }

    public int Fee { get; set; }
    // Invoice properties

    public int InvoiceId { get; set; }

    public int AppointmentId { get; set; }

    public DateOnly? CreatedDate { get; set; }

    public int? Amount { get; set; }

    public string? Status { get; set; }

    public bool? IsConsultationPaid { get; set; }
  }

}
