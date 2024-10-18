using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Models
{
  public class AdditionalInvoiceItemsPaymentDto
  {
    public AdditionalInvoiceItem additionalInvoiceItem { get; set; }
    public PaymentModeInfo PaymentModeInfo { get; set; }
  }
}
