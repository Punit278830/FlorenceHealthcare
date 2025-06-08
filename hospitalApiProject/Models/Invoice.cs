using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace hospitalApiProject.Models
{
    public class Invoice
    {
        [Key]
        public int InvoiceId { get; set; }
        
        [Required]
        public int PatientId { get; set; }
        
        [Required]
        public int AppointmentId { get; set; }
        
        [Required]
        public decimal TotalAmount { get; set; }
        
        public decimal? DiscountAmount { get; set; }
        
        public decimal? TaxAmount { get; set; }
        
        public decimal? NetAmount { get; set; }
        
        public string? PaymentStatus { get; set; }
        
        public string? Notes { get; set; }
        
        public bool IsActive { get; set; }
        
        public DateTime CreatedDate { get; set; }
        
        public DateTime? ModifiedDate { get; set; }

        [Required]
        public DateTime InvoiceDate { get; set; }

        public decimal PaidAmount { get; set; }
        
        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }
        
        [ForeignKey("AppointmentId")]
        public virtual Appointment Appointment { get; set; }
        
        public virtual ICollection<PaymentInfo> PaymentInfos { get; set; }
        public virtual ICollection<PaymentModeInfo> PaymentModeInfos { get; set; }
    }
} 