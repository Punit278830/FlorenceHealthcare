using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class StaffSchedule
{
    public int ScheduleId { get; set; }

    public int StaffId { get; set; }

    public int DepartmentId { get; set; }

    public DateOnly ScheduleDate { get; set; }

    public string? FromTime { get; set; }

    public string? FromPostfix { get; set; }

    public string? ToTime { get; set; }

    public string? ToPostfix { get; set; }

    public DateOnly? ApplyScheduleDate { get; set; }

    public int LeaveStatus { get; set; }

  public string? Status { get; set; }

  public string? Notes { get; set; }
}
