using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Models
{
  public class InvoiceInfoResponse
  {
    public int InvoiceId { get; set; }

    public int PatientId { get; set; }

    public int AppointmentId { get; set; }

    public DateOnly? CreatedDate { get; set; }

    public int? Amount { get; set; }

    public decimal TotalUnpaidAmount { get; set; }

    public string? Status { get; set; }

    // A list of payment modes associated with this invoice
    public string PaymentModes { get; set; } = string.Empty;

    public List<PaymentModeInfo> PaymentDetails { get; set; }

  }
}
