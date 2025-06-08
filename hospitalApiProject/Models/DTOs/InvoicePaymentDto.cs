using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Models.DTOs
{
    public class InvoicePaymentDto
    {
        public InvoiceInfoResponse InvoiceInfo { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; }
    }
} 