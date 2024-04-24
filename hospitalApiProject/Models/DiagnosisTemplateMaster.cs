using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class DiagnosisTemplateMaster
{
    public int DiagnosId { get; set; }

    public string DiagnosName { get; set; } = null!;

    public string DiagnosText { get; set; } = null!;

    public int DiagnosStatus { get; set; }
}
