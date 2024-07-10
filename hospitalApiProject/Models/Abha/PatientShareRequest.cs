namespace hospitalApiProject.Models;

public class PatientShareRequest
{
  //public string Intent { get; set; }
  //public MetaData MetaData { get; set; }
  //public Profile Profile { get; set; }
  //public string randomValue { get; set; }

  public string requestId { get; set; }

  public string timestamp { get; set; }
  public string healthId { get; set; }
  public Patient patient { get; set; }
}

public class Patient
{
  public string abhaNumber { get; set; }
  public string abhaAddress { get; set; }
  public string name { get; set; }
  public string gender { get; set; }
  public string dayOfBirth { get; set; }
  public string monthOfBirth { get; set; }
  public string yearOfBirth { get; set; }
  public Address? address { get; set; }
  public string phoneNumber { get; set; }
}

public class Address
{
  public string? line { get; set; }
  public string? district { get; set; } 
  public string? state { get; set; }
  public string? pincode { get; set; }
}
