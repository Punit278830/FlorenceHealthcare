using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public class MedicineMaster
{
    [Key]
    public int MedicineMasterId { get; set; }

    [Required]
    public string MedicineName { get; set; }

    public string? Description { get; set; }

    public string? Manufacturer { get; set; }

    public string? Category { get; set; }

    public decimal? Price { get; set; }

    public string? GenericName { get; set; }

    public string? ManufactureName { get; set; }

    public string? MedType { get; set; }

    public string? Unit { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public int MedId { get; set; }
    public string MedName { get; set; }

    public virtual ICollection<PrescriptionDetail> PrescriptionDetails { get; set; }
    public virtual ICollection<PrescriptionTemplateDetail> PrescriptionTemplateDetails { get; set; }
}
