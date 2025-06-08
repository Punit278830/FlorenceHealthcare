using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPaymentInfoService: ISimpleServiceBase
    {
        Task<IEnumerable<PaymentInfo>> GetAllPaymentInfosAsync();
        Task<PaymentInfo> GetPaymentInfoByIdAsync(int id);
        Task<IEnumerable<PaymentInfo>> GetPaymentInfosByInvoiceIdAsync(int invoiceId);
        Task<PaymentInfo> UpdatePaymentInfoAsync(int id, PaymentInfo paymentInfo);
        Task<PaymentInfo> CreatePaymentInfoAsync(PaymentInfo paymentInfo);
        Task DeletePaymentInfoAsync(int id);
        Task<bool> PaymentInfoExistsAsync(int id);
    }
} 