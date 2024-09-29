namespace hospitalApiProject.Models.Response;

public partial class PaymentModeInfo
{
  public int PaymentId { get; set; }

  public int InvoiceId { get; set; }

  public string PaymentMode { get; set; }

  public string? TransactionId { get; set; }

  public DateTime? PaymentDate { get; set; } = DateTime.Now;

  public int? Amount { get; set; }
}
