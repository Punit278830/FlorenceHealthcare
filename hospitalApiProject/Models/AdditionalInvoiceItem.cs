using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class AdditionalInvoiceItem
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public string ItemName { get; set; }

    public string Description { get; set; }

    public int Discount { get; set; }

    public decimal Fee { get; set; }

    public int CreatedBy { get; set; }

    public int FinalAmount { get; set; }

    public string Status { get; set; }

    // Nullable HospitalId for multi-tenant support
    public int? HospitalId { get; set; }
}



public class AdditionalInvoiceItemDetail
{
  public int Id { get; set; }
  public int InvoiceId { get; set; }
  public string? ItemName { get; set; }
  public string? Description { get; set; }
  public decimal Discount { get; set; }
  public decimal Fee { get; set; }
  public int CreatedBy { get; set; }
  public decimal FinalAmount { get; set; }
  public string? Status { get; set; }
  public string? TransactionId { get; set; } // Nullable if TransactionId might not exist
  public int ItemId { get; set; }
}

