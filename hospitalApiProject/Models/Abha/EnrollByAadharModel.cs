using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class EnrollByAadharModel : EncryptedDataModel
{
  public string TxnId { get; set; }
  public string MobileNumber { get; set; }
}
