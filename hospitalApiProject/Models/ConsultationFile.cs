using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class ConsultationFile
{
    public int FileId { get; set; }

    public int? AppointmentId { get; set; }

    public string? FileName { get; set; }

    public string? FileType { get; set; }

    public string? FileData { get; set; }
}
