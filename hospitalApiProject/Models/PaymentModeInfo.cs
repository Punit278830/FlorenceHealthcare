using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models
{
    public class PaymentModeInfo
    {
        [Key]
        public int PaymentModeInfoId { get; set; }
        
        [Required]
        public string PaymentMode { get; set; }
        
        [Required]
        public string ItemName { get; set; }
        
        public decimal? Amount { get; set; }
        
        public string? Description { get; set; }
        
        public string? Status { get; set; }
        
        public string? TransactionId { get; set; }
        
        public int? ItemId { get; set; }
        
        public bool IsActive { get; set; }
        
        public DateTime CreatedDate { get; set; }
        
        public DateTime? ModifiedDate { get; set; }
        
        [Required]
        public int InvoiceId { get; set; }
        
        [ForeignKey("InvoiceId")]
        public virtual Invoice Invoice { get; set; }

        public int PaymentId { get; set; }
        public DateTime PaymentDate { get; set; }
    }
} 