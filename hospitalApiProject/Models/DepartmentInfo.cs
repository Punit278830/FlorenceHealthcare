using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class DepartmentInfo
{
    public int DepartmentId { get; set; }

    public string DepartmentName { get; set; } = null!;

    public string? DepartmentStatus { get; set; }

    public int HospitalId { get; set; }
    public Hospital? Hospital { get; set; }
}
