using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class ConsultationDatum
{
    public int Id { get; set; }

    public int AppointmentId { get; set; }

    public string? ExaminationNote { get; set; }

    public string? Advice { get; set; }

    public string? DiffDiagnosis { get; set; }

    public string? FinalDiagnosis { get; set; }

    public DateTime? FollowupDate { get; set; }

    // Multi-hospital support
    public int? HospitalId { get; set; }
}
