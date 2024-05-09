using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class EnrollByAadharModel
{
  public string EncryptedData { get; set; }
  public string TxnId { get; set; }
  public string MobileNumber { get; set; }
}
