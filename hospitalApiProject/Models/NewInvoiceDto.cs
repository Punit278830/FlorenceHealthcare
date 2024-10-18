using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Models
{
  public class NewInvoiceDto
  {
    public List<AdditionalInvoiceItem> additionalInvoiceItems { get; set; }
    public PaymentModeInfo PaymentModeInfo { get; set; }
  }
}
