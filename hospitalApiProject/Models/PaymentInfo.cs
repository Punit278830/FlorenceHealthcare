using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models
{
    public class PaymentInfo
    {
        [Key]
        public int PaymentId { get; set; }
        
        [Required]
        public int InvoiceId { get; set; }
        
        [Required]
        public decimal Amount { get; set; }
        
        public DateTime? PaymentDate { get; set; }
        
        public string? PaymentStatus { get; set; }
        
        public string? TransactionId { get; set; }
        
        [ForeignKey("InvoiceId")]
        public virtual Invoice Invoice { get; set; }

        public int PaymentInfoId { get; set; }
    }
} 