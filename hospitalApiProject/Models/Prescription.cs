using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace hospitalApiProject.Models
{
    public class Prescription
    {
        [Key]
        public int PrescriptionId { get; set; }
        
        [Required]
        public int PatientId { get; set; }
        
        [Required]
        public int DoctorId { get; set; }
        
        [Required]
        public int AppointmentId { get; set; }
        
        public string? Diagnosis { get; set; }
        
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
        
        public virtual ICollection<PrescriptionDetail> PrescriptionDetails { get; set; }
    }
} 