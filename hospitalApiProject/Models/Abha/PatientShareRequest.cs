namespace hospitalApiProject.Models;

public class PatientShareRequest
{
  //public string Intent { get; set; }
  //public MetaData MetaData { get; set; }
  //public Profile Profile { get; set; }
  //public string randomValue { get; set; }

  public string requestId { get; set; }

  public DateTime timestamp { get; set; }
  public string healthId { get; set; }
}

public class MetaData
{
  public string HipId { get; set; }
  public string Context { get; set; }
  public string HprId { get; set; }
  public string Latitude { get; set; }
  public string Longitude { get; set; }
}

public class Profile
{
  public Patient Patient { get; set; }
}

public class Patient
{
  public int AbhaNumber { get; set; }
  public string AbhaAddress { get; set; }
  public string Name { get; set; }
  public string Gender { get; set; }
  public string DayOfBirth { get; set; }
  public string MonthOfBirth { get; set; }
  public string YearOfBirth { get; set; }
  public Address Address { get; set; }
  public string PhoneNumber { get; set; }
}

public class Address
{
  public string Line { get; set; }
  public string District { get; set; }
  public string State { get; set; }
  public int PinCode { get; set; }
}
