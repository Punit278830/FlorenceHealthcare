using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace hospitalApiProject.Models
{
    public class PrescriptionTemplateMaster
    {
        [Key]
        public int PrescriptionTemplateId { get; set; }

        [Required]
        public string TemplateName { get; set; }

        public string? Description { get; set; }

        public string? Advice { get; set; }

        public string? DiffDiagnosis { get; set; }

        public string? ExaminationNote { get; set; }

        public string? FinalDiagnosis { get; set; }

        public int? DiagnosisId { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public virtual ICollection<PrescriptionTemplateDetail> PrescriptionTemplateDetails { get; set; }
    }
}
