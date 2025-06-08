using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models;

public class InvoiceInfo
{
  [Key]
  public int Id { get; set; }

  [Required]
  public string InvoiceNumber { get; set; } = string.Empty;

  [Required]
  public DateTime InvoiceDate { get; set; }

  [Required]
  public int Amount { get; set; }

  [Required]
  public string Status { get; set; } = string.Empty;

  [Required]
  public string TransactionId { get; set; } = string.Empty;

  public string? Description { get; set; }

  public DateTime? PaymentDate { get; set; }

  public string? PaymentMode { get; set; }

  public string? PaymentReference { get; set; }

  [ForeignKey("Patient")]
  public int? PatientId { get; set; }
  public Patient? Patient { get; set; }

  public ICollection<AdditionalInvoiceItem> AdditionalInvoiceItems { get; set; } = new List<AdditionalInvoiceItem>();

  [NotMapped]
  public int InvoiceId { get => Id; set => Id = value; }

  public int? AppointmentId { get; set; }

  public DateOnly CreatedDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

  public bool IsConsultationPaid { get; set; }
}

public class InvoiceInfoDetail
{
  public int InvoiceId { get; set; }
  public int PatientId { get; set; }
  public int AppointmentId { get; set; }
  public DateOnly? CreatedDate { get; set; }
  public int? Amount { get; set; }
  public string? Status { get; set; }
  public bool? IsConsultationPaid { get; set; }
  public string? TransactionId { get; set; }
}
