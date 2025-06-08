using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models;

public class AdditionalInvoiceItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string ItemName { get; set; } = string.Empty;

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    [Required]
    public string Status { get; set; } = string.Empty;

    [ForeignKey("InvoiceInfo")]
    public int InvoiceInfoId { get; set; }
    public InvoiceInfo? InvoiceInfo { get; set; }

    public string? TransactionId { get; set; }

    [NotMapped]
    public int InvoiceId { get => InvoiceInfoId; set => InvoiceInfoId = value; }

    public int Discount { get; set; }
    public int Fee { get; set; }
    public int FinalAmount { get; set; }
    public int CreatedBy { get; set; }
}

public class AdditionalInvoiceItemDto
{
    public int Id { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public int InvoiceInfoId { get; set; }
    public string? TransactionId { get; set; }
}

