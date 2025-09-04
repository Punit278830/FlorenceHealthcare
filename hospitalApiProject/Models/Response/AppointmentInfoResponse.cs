using System;

namespace hospitalApiProject.Models.Response
{
    public class AppointmentInfoResponse
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string PatientMobile { get; set; } = string.Empty;
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;
        public string AppointmentStatus { get; set; } = string.Empty;
        public string? Reason { get; set; }
        public string? Notes { get; set; }
        public int HospitalId { get; set; }
        public string HospitalName { get; set; } = string.Empty;
        public DateTime? CreatedDate { get; set; }
        public string Gender { get; set; } = string.Empty;
        public DateTime? Dob { get; set; }
        public int? Age { get; set; }
    }
}
