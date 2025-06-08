using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using hospitalApiProject.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IInvoiceService
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
        Task<TotalPaymentDetailsResponse> GetTotalPaymentAmountAsync(string fromDate, string toDate);
        Task<int> GetTotalAmountAsync();
        Task<InvoiceInfo> CreateInvoiceInfoAsync(InvoiceInfo invoiceInfo);
        Task<PaymentModeInfo> AddPaymentModeAsync(PaymentModeInfo paymentModeInfo);
        Task<InvoiceInfoResponse> GetInvoiceById(int invoiceId);
        Task<InvoiceInfoResponse> GetInvoiceByAppointmentId(int appointmentId);
        Task<InvoiceInfoResponse> CreateInvoice(NewInvoiceDto invoiceDto);
        Task<InvoiceInfoResponse> UpdateInvoicePayment(InvoicePaymentDto paymentDto);
        Task<InvoiceInfoDetail> GetInvoiceInfoByIdAsync(int id);
    }
} 