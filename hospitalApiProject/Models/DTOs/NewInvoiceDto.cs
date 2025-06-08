namespace hospitalApiProject.Models.DTOs
{
    public class NewInvoiceDto
    {
        public int PatientId { get; set; }
        public int AppointmentId { get; set; }
        public decimal TotalAmount { get; set; }
    }
} 