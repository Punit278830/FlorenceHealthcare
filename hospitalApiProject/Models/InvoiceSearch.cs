using System;
using System.Text.Json.Serialization;

public class InvoiceSearch : SearchCriteriaBase
{
    [JsonPropertyName("fromDate")]
    public string FromDate { get; set; } // Accept as string
    [JsonPropertyName("toDate")]
    public string ToDate { get; set; } // Accept as string
    [JsonPropertyName("paymentStatus")]
    public PaymentStatus? PaymentStatus { get; set; } // Make nullable
    [JsonPropertyName("paymentMode")]
    public PaymentMode? PaymentMode { get; set; } // Make nullable
}

public enum PaymentStatus
{
    All = 0,
    Paid = 1,
    Unpaid = 2,
    PartialPaid = 3
}

public enum PaymentMode
{
    All = 0,
    Cash = 1,
    Online = 2
}
