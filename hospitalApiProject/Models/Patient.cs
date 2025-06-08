using System.ComponentModel.DataAnnotations;

namespace hospitalApiProject.Models
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        public string? MiddleName { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string Gender { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public string? AbhaNumber { get; set; }

        public string? AbhaAddress { get; set; }

        public ICollection<InvoiceInfo> Invoices { get; set; } = new List<InvoiceInfo>();
        
        public ICollection<AppointmentInfo> AppointmentInfos { get; set; } = new List<AppointmentInfo>();
    }
} 