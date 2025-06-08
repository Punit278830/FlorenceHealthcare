using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models
{
    public class PrescriptionTemplateDetail
    {
        [Key]
        public int PrescriptionTemplateDetailId { get; set; }
        
        [Required]
        public int PrescriptionTemplateId { get; set; }
        
        [Required]
        public int MedicineMasterId { get; set; }
        
        public string? Dosage { get; set; }
        
        public string? Frequency { get; set; }
        
        public string Duration { get; set; }
        
        public string Instructions { get; set; }
        
        [ForeignKey("PrescriptionTemplateId")]
        public virtual PrescriptionTemplateMaster PrescriptionTemplate { get; set; }
        
        [ForeignKey("MedicineMasterId")]
        public virtual MedicineMaster Medicine { get; set; }
    }
} 