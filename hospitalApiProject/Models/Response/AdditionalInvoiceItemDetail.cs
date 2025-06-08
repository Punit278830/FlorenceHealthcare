namespace hospitalApiProject.Models.Response
{
    public class AdditionalInvoiceItemDetail
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string ItemName { get; set; }
        public string Description { get; set; }
        public decimal Discount { get; set; }
        public decimal Fee { get; set; }
        public int CreatedBy { get; set; }
        public decimal FinalAmount { get; set; }
        public string Status { get; set; }
        public string TransactionId { get; set; }
        public int ItemId { get; set; }
    }
} 