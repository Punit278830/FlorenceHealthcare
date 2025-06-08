using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospitalApiProject.Models;

public class FilesUpload
{
    [Key]
    public int FilesUploadId { get; set; }

    [Required]
    public int AppointmentId { get; set; }

    [Required]
    public string FileName { get; set; }

    public string? FilePath { get; set; }

    public string? FileType { get; set; }

    public long? FileSize { get; set; }

    public DateTime UploadDate { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public int FileId { get; set; }
    public byte[] FileData { get; set; }

    [ForeignKey("AppointmentId")]
    public virtual Appointment Appointment { get; set; }
}
