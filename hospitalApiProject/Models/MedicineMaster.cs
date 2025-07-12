using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class MedicineMaster
{
    public int MedId { get; set; }

    public string MedName { get; set; } = null!;

    public string GenericName { get; set; } = null!;

    public string ManufactureName { get; set; } = null!;

    public string MedType { get; set; } = null!;

    public string? Unit { get; set; }

    public int HospitalId { get; set; }
    public Hospital? Hospital { get; set; }
}
