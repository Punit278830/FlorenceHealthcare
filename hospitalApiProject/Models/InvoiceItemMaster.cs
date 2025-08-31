using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class InvoiceItemMaster
{
    public int ItemId { get; set; }

    public string? ItemName { get; set; }

    public string? Description { get; set; }

    public int? Discount { get; set; }

    public decimal? Fee { get; set; }

    // Nullable HospitalId for multi-tenant support
    public int? HospitalId { get; set; }
}
