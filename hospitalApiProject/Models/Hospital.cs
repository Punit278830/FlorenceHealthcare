using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hospitalApiProject.Models;

public class Hospital
{
  [Key]
  public int HospitalId { get; set; }

  [Required]
  [MaxLength(200)]
  public string Name { get; set; } = null!;

  [MaxLength(50)]
  public string? Code { get; set; }

  [MaxLength(200)]
  public string? ContactPerson { get; set; }

  [MaxLength(20)]
  public string? ContactNumber { get; set; }

  [MaxLength(200)]
  public string? Email { get; set; }

  [MaxLength(400)]
  public string? AddressLine1 { get; set; }

  [MaxLength(400)]
  public string? AddressLine2 { get; set; }

  [MaxLength(100)]
  public string? City { get; set; }

  [MaxLength(100)]
  public string? State { get; set; }

  [MaxLength(20)]
  public string? Pincode { get; set; }

  [MaxLength(100)]
  public string? Country { get; set; }

  [MaxLength(100)]
  public string? RegistrationNumber { get; set; }

  [MaxLength(100)]
  public string? LicenseNumber { get; set; }

  [MaxLength(30)]
  public string? GSTIN { get; set; }

  [MaxLength(400)]
  public string? WebsiteUrl { get; set; }

  [MaxLength(400)]
  public string? LogoUrl { get; set; }

  public bool? IsActive { get; set; } = true;

  public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}
