using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models.Response
{
  public class InvoiceInfo
  {
    public int InvoiceId { get; set; }
    public int PatientId { get; set; }
    public int AppointmentId { get; set; }
    public DateTime CreatedDate { get; set; }
    public decimal Amount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalUnpaid { get; set; }
    public string Status { get; set; }
    public List<PaymentModeInfo> PaymentModes { get; set; }
  }
} 