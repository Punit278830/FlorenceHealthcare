using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPaymentModeInfoService: ISimpleServiceBase
    {
        Task<IEnumerable<PaymentModeInfo>> GetAllPaymentModeInfosAsync();
        Task<PaymentModeInfo> GetPaymentModeInfoByIdAsync(int id);
        Task<IEnumerable<PaymentModeInfo>> GetPaymentModeInfosByInvoiceIdAsync(int invoiceId);
        Task<PaymentModeInfo> UpdatePaymentModeInfoAsync(int id, PaymentModeInfo paymentModeInfo);
        Task<PaymentModeInfo> CreatePaymentModeInfoAsync(PaymentModeInfo paymentModeInfo);
        Task DeletePaymentModeInfoAsync(int id);
        Task<bool> PaymentModeInfoExistsAsync(int id);
    }
} 