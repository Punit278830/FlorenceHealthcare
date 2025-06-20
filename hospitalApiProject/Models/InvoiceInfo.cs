using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class InvoiceInfo
{
  public int InvoiceId { get; set; }

  public int PatientId { get; set; }

  public int AppointmentId { get; set; }

  // All DateOnly values in this model must be stored and interpreted as IST (Asia/Kolkata)
  public DateOnly? CreatedDate { get; set; }

  public int? Amount { get; set; }

  public string? Status { get; set; }

  public bool? IsConsultationPaid { get; set; }

}

public class InvoiceInfoDetail
{
  public int InvoiceId { get; set; }

  public int PatientId { get; set; }

  public int AppointmentId { get; set; }

  // All DateOnly values in this model must be stored and interpreted as IST (Asia/Kolkata)
  public DateOnly? CreatedDate { get; set; }

  public int? Amount { get; set; }

  public string? Status { get; set; }

  public bool? IsConsultationPaid { get; set; } 
  public string? TransactionId { get; set; }
}
