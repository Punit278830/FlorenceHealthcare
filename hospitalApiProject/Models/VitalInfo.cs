using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class VitalInfo
{
  public int VitalId { get; set; }
  public int AppointmentId { get; set; }
  public string? Bp { get; set; }
  public string? Weight { get; set; }
  public string? Height { get; set; }
  public string? Pulse { get; set; }
  public string? Tempurature { get; set; }
  public string? OxigenLevel { get; set; }
  public bool? Diabetes { get; set; }
  public bool? Thyroid { get; set; }
  public bool? Hypertension { get; set; }
  public bool? Alcohol { get; set; }
  public bool? Smoking { get; set; }
  public bool? Tobacco { get; set; }

  // Nullable HospitalId for multi-tenant support
  public int? HospitalId { get; set; }
}
