using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class DepartmentInfo
{
    public int DepartmentId { get; set; }

    public string DepartmentName { get; set; } = null!;

    public string? DisplayName { get; set; }

    public string? DepartmentStatus { get; set; }
}
