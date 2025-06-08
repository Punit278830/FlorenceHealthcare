using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models
{
    public class Diagnosis
    {
        [Key]
        public int DiagnosisId { get; set; }
        
        [Required]
        public int PatientId { get; set; }
        
        [Required]
        public int DoctorId { get; set; }
        
        [Required]
        public int AppointmentId { get; set; }
        
        public int? DiagnosisTemplateId { get; set; }
        
        public string? DiagnosisName { get; set; }
        
        public string? DiagnosisText { get; set; }
        
        public string? Notes { get; set; }
        
        public bool IsActive { get; set; }
        
        public DateTime CreatedDate { get; set; }
        
        public DateTime? ModifiedDate { get; set; }
        
        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }
        
        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }
        
        [ForeignKey("AppointmentId")]
        public virtual Appointment Appointment { get; set; }
        
        [ForeignKey("DiagnosisTemplateId")]
        public virtual DiagnosisTemplateMaster DiagnosisTemplate { get; set; }
    }
} 