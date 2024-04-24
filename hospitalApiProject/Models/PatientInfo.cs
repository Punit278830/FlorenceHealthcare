using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class PatientInfo
{
    public int PatientId { get; set; }

    public string FirstName { get; set; } = null!;

    public string? LastName { get; set; }

    public string? Mobile { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? Gender { get; set; }

    public DateOnly Dob { get; set; }

    public string? PatientImage { get; set; }

    public DateOnly? RegstrationDate { get; set; }
}
