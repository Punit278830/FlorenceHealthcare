using hospitalApiProject.Models;

public class InvoiceSummaryResponse
{
  public List<InvoiceInfoResponse> Invoices { get; set; }
  public decimal TotalOnlineAmount { get; set; }
  public decimal TotalCashAmount { get; set; }
  public decimal TotalAmount { get; set; }
}
