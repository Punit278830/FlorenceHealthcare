namespace hospitalApiProject.Models
{
  public class MedicinesGroup
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    // Nullable HospitalId for multi-tenant support
    public int? HospitalId { get; set; }
  }
}
