using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class PatientMedication
{
    public int MedicationId { get; set; }

    public int AppointmentId { get; set; }

    public string? MedName { get; set; }

    public string? MedType { get; set; }

    public string? Dose { get; set; }

    public string? Frequency { get; set; }

    public string? Timing { get; set; }

    public string? Duration { get; set; }

    public string? Instruction { get; set; }

    // Nullable HospitalId for multi-tenant support
    public int? HospitalId { get; set; }
}
