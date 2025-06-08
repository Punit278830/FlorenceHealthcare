using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models.Response
{
    public class InvoiceInfoResponse
    {
        public int InvoiceId { get; set; }
        public int PatientId { get; set; }
        public int AppointmentId { get; set; }
        public DateOnly CreatedDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal TotalUnpaid { get; set; }
        public string Status { get; set; }
        public string PaymentModes { get; set; }
        public List<PaymentDetailResponse> PaymentDetails { get; set; }
    }
} 