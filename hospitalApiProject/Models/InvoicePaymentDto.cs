using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Models
{
  public class InvoicePaymentDto
  {
    public InvoiceInfo InvoiceInfo { get; set; }
    public PaymentModeInfo PaymentModeInfo { get; set; }
  }
}
