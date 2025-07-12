using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models;

public partial class InvoiceInfo
{
  public int InvoiceId { get; set; }

  public int PatientId { get; set; }

  public int AppointmentId { get; set; }

  public DateTime? CreatedDate { get; set; } // Changed to DateTime? to store full UTC datetime

  public int? Amount { get; set; }

  public string? Status { get; set; }

  public bool? IsConsultationPaid { get; set; }

  [NotMapped]
  public string? TransactionId { get; set; } // Not mapped to DB, for API compatibility

  [NotMapped]
  public DateTime? PreviousAppointmentDate { get; set; } // Not mapped to DB, for discount reason

  [NotMapped]
  public DateTime? InvoiceDate { get; set; }
}
