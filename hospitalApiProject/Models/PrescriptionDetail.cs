using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models
{
    public class PrescriptionDetail
    {
        [Key]
        public int PrescriptionDetailId { get; set; }
        
        [Required]
        public int PrescriptionId { get; set; }
        
        [Required]
        public int MedicineMasterId { get; set; }
        
        public string? Dosage { get; set; }
        
        public string? Frequency { get; set; }
        
        public string? Duration { get; set; }
        
        public string? Instructions { get; set; }
        
        public bool IsActive { get; set; }
        
        public DateTime CreatedDate { get; set; }
        
        public DateTime? ModifiedDate { get; set; }
        
        [ForeignKey("PrescriptionId")]
        public virtual Prescription Prescription { get; set; }
        
        [ForeignKey("MedicineMasterId")]
        public virtual MedicineMaster Medicine { get; set; }
    }
} 