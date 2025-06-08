using System;

namespace hospitalApiProject.Models.Response
{
    public class PaymentDetailResponse
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; }
        public DateTime PaymentDate { get; set; }
    }
} 