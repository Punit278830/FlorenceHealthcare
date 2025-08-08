namespace hospitalApiProject.Models.Response;

public partial class PaymentModeInfo
{
  public int? PaymentId { get; set; }

  public int InvoiceId { get; set; }

  public string PaymentMode { get; set; }
  public string itemName { get; set; }

  public string? itemId { get; set; }
  public string? TransactionId { get; set; }

  public DateTime? PaymentDate { get; set; } = DateTime.UtcNow;

  public int? Amount { get; set; }

}
