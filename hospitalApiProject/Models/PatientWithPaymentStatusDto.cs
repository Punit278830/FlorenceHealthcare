using System;

namespace hospitalApiProject.Models
{
    public class PatientWithPaymentStatusDto
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public DateTime Dob { get; set; }
        public string? PatientImage { get; set; }
        public DateTime? RegstrationDate { get; set; }
        public string? IdentityName { get; set; }
        public string? IdentityNumber { get; set; }
        public bool IsConsultationPaid { get; set; }
    }
}
