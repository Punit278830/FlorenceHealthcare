namespace hospitalApiProject.Models
{
    public class DoctorSchedule
    {
        public int Id { get; set; }
        public string DoctorName { get; set; }
        public string Department { get; set; }
        public DateTime AvailableDate { get; set; }
        public TimeSpan FromTime { get; set; }
        public TimeSpan ToTime { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }  // "Active" or "Inactive"
    }
}
