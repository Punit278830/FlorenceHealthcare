using hospitalApiProject.Models;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PaymentInfoService : EntityServiceBase<PaymentInfo>, IPaymentInfoService
    {
        public PaymentInfoService(FlorenceDbContext context) : base(context)
        {
        }

        protected override int GetEntityId(PaymentInfo entity)
        {
            return entity.PaymentInfoId;
        }

        public async Task<IEnumerable<PaymentInfo>> GetAllPaymentInfosAsync()
        {
            return await GetAllAsync();
        }

        public async Task<PaymentInfo> GetPaymentInfoByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<PaymentInfo>> GetPaymentInfosByInvoiceIdAsync(int invoiceId)
        {
            return await _context.PaymentInfos
                .Where(p => p.InvoiceId == invoiceId)
                .ToListAsync();
        }

        public async Task<PaymentInfo> UpdatePaymentInfoAsync(int id, PaymentInfo paymentInfo)
        {
            return await UpdateAsync(id, paymentInfo);
        }

        public async Task<PaymentInfo> CreatePaymentInfoAsync(PaymentInfo paymentInfo)
        {
            return await CreateAsync(paymentInfo);
        }

        public async Task DeletePaymentInfoAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PaymentInfoExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }
    }
} 