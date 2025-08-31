namespace hospitalApiProject.Models.Response;

public partial class PaymentModeInfoResponse
{
  public int? PaymentId { get; set; }

  public int InvoiceId { get; set; }

  public string? PaymentMode { get; set; }
  public string? itemName { get; set; }

  public string? itemId { get; set; }
  public string? TransactionId { get; set; }

  public DateTime? PaymentDate { get; set; }

  public int? Amount { get; set; }

  // Nullable HospitalId for multi-tenant support
  public int? HospitalId { get; set; }

}
