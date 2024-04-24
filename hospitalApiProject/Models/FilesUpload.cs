using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class FilesUpload
{
    public int FileId { get; set; }

    public int AppointmentId { get; set; }

    public string FileName { get; set; } = null!;

    public string FileType { get; set; } = null!;

    public string FileData { get; set; } = null!;

    public DateTime? UploadDate { get; set; }
}
