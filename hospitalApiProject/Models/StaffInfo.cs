using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class StaffInfo
{
    public int StaffId { get; set; }

    public string FirstName { get; set; } = null!;

    public string? LastName { get; set; }

    public string Mobile { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Address { get; set; }

    public int DepartmentId { get; set; }

    public string Designation { get; set; } = null!;

    public int? ConsultationFee { get; set; }

    public int ActiveStatus { get; set; }

    public string Password { get; set; } = null!;

    public DateOnly Dob { get; set; }

    public string Gender { get; set; } = null!;

    public string Education { get; set; } = null!;

    public DateOnly Doj { get; set; }
}
