using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models;

public class DiagnosisTemplateMaster
{
    [Key]
    public int DiagnosisTemplateMasterId { get; set; }

    [Required]
    public string DiagnosisTemplateName { get; set; }

    public string? DiagnosisTemplateStatus { get; set; }

    public string? DiagnosisTemplateText { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual ICollection<Diagnosis> Diagnoses { get; set; }
}
