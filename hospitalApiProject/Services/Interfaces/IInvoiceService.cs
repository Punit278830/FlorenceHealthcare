using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IInvoiceService: ISimpleServiceBase
    {
        Task<IEnumerable<Invoice>> GetAllInvoicesAsync();
        Task<Invoice> GetInvoiceByIdAsync(int id);
        Task<IEnumerable<Invoice>> GetInvoicesByPatientIdAsync(int patientId);
        Task<Invoice> UpdateInvoiceAsync(int id, Invoice invoice);
        Task<Invoice> CreateInvoiceAsync(Invoice invoice);
        Task DeleteInvoiceAsync(int id);
        Task<bool> InvoiceExistsAsync(int id);
        Task<InvoiceSummaryResponse> GetInvoiceWithPaymentsAsync(string paymentMode, string paymentStatus, string fromDate, string toDate);
        Task<IEnumerable<object>> GetInvoicesForTodayAsync();
        Task<InvoiceInfoDetail> GetInvoiceInfoByIdAsync(int id);
        Task<int> GetInvoiceByPatientIdAsync(int patientId);
        Task<TotalPaymentDetailsResponse> GetTotalPaymentAmountAsync(string fromDate, string toDate);
        Task<int> GetTotalAmountAsync();
        Task<InvoiceInfo> CreateInvoiceInfoAsync(InvoiceInfo invoiceInfo);
        Task<PaymentModeInfo> AddPaymentModeAsync(PaymentModeInfo paymentModeInfo);
    }
} 