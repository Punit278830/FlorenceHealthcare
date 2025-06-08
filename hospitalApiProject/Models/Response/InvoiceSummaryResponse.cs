using System.Collections.Generic;

namespace hospitalApiProject.Models.Response
{
    public class InvoiceSummaryResponse
    {
        public List<InvoiceInfoResponse> Invoices { get; set; }
        public int TotalOnlineAmount { get; set; }
        public int TotalCashAmount { get; set; }
        public int TotalAmount { get; set; }
    }
} 