namespace hospitalApiProject.Models.Response
{
  public class AppointmentInvoiceResponse
  {
    public AppointmentInfo AppointmentInfo { get; set; }
    public int InvoiceId { get; set; }
    public DateTime? PreviousAppointmentDate { get; set; } // Added to return previous appointment date
  }
}
