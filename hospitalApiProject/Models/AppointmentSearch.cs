using System;
using System.Text.Json.Serialization;

public class AppointmentSearch : SearchCriteriaBase
{
    [JsonPropertyName("fromDate")]
    public string? FromDate { get; set; } // Accept as string
    
    [JsonPropertyName("toDate")]
    public string? ToDate { get; set; } // Accept as string
    
    [JsonPropertyName("appointmentStatus")]
    public AppointmentStatus? AppointmentStatus { get; set; } // Make nullable
    
    [JsonPropertyName("doctorId")]
    public int? DoctorId { get; set; } // Filter by specific doctor
    
    [JsonPropertyName("patientName")]
    public string? PatientName { get; set; } // Search by patient name
    
    [JsonPropertyName("searchTerm")]
    public string? SearchTerm { get; set; } // General search term
}

public enum AppointmentStatus
{
    All = 0,
    Active = 1,
    Completed = 2,
    Cancelled = 3,
    NoShow = 4
}
