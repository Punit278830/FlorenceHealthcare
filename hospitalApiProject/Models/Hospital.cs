using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApiProject.Models
{
    public class Hospital
    {
        [Key]
        public int HospitalId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        // Add other hospital-specific fields as needed

        // Navigation property for related entities (add as needed)
        // public ICollection<StaffInfo> StaffInfos { get; set; }
        // public ICollection<DoctorSchedule> DoctorSchedules { get; set; }
        // public ICollection<PatientInfo> PatientInfos { get; set; }
    }
}
