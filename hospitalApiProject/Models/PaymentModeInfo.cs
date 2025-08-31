using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models;

[Table("PaymentModeInfo")]
public partial class PaymentModeInfo
{
    [Key]
    public int PaymentId { get; set; }

    [Required]
    public int InvoiceId { get; set; }

    [Required]
    [StringLength(100)]
    public string PaymentMode { get; set; }

    [Required]
    public string ItemName { get; set; } = string.Empty;

    public string? ItemId { get; set; }

    [StringLength(100)]
    public string? TransactionId { get; set; }

    public DateTime? PaymentDate { get; set; }

    public int? Amount { get; set; }

    // Nullable HospitalId for multi-tenant support
    public int? HospitalId { get; set; }
}
