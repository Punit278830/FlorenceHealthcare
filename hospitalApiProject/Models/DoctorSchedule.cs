namespace hospitalApiProject.Models
{
    public class DoctorSchedule
    {
        public int Id { get; set; }
        public string DoctorName { get; set; } = null!;
        public string Department { get; set; } = null!;
        public DateTime AvailableDate { get; set; }
        public TimeSpan FromTime { get; set; }
        public TimeSpan ToTime { get; set; }
        public string Notes { get; set; } = null!;
        public string Status { get; set; } = null!;  // "Active" or "Inactive"
        public int HospitalId { get; set; }
        public Hospital? Hospital { get; set; }
    }
}
