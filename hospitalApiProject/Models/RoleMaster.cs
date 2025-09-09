using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models
{
    [Table("RoleMaster")]
    public class RoleMaster
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoleName { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string RoleDisplayName { get; set; } = null!;

        [MaxLength(255)]
        public string? RoleDescription { get; set; }

        public int? HospitalId { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        // Navigation property
        [ForeignKey("HospitalId")]
        public virtual Hospital? Hospital { get; set; }
    }
}
