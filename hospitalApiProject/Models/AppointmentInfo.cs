using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class AppointmentInfo
{
  public int Id { get; set; }

  public int PatientId { get; set; }

  public int DoctorId { get; set; }

  public int? Departmentid { get; set; }

  public int? ScheduledByid { get; set; }

  public DateTime Date { get; set; }

  public string? Notes { get; set; }

  public string? AppointTime { get; set; }

  public string? AppointmentStatus { get; set; }

  public int Fee { get; set; }

  public bool? IsDeleted { get; set; }

  public DateTime? DeletedDate { get; set; }

  public int? DeletedBy { get; set; }

  // New nullable HospitalId for multi-tenant separation
  public int? HospitalId { get; set; }
}
