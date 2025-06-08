using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PaymentModeInfoService : ServiceBase<PaymentModeInfo>, IPaymentModeInfoService
    {
        private new readonly FlorenceDbContext _context;

        public PaymentModeInfoService(FlorenceDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PaymentModeInfo>> GetAllPaymentModeInfosAsync()
        {
            return await GetAllAsync();
        }

        public async Task<PaymentModeInfo> GetPaymentModeInfoByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<PaymentModeInfo>> GetPaymentModeInfosByInvoiceIdAsync(int invoiceId)
        {
            return await _context.PaymentModeInfo
                .Where(p => p.InvoiceId == invoiceId)
                .ToListAsync();
        }

        public async Task<PaymentModeInfo> UpdatePaymentModeInfoAsync(int id, PaymentModeInfo paymentModeInfo)
        {
            return await UpdateAsync(id, paymentModeInfo);
        }

        public async Task<PaymentModeInfo> CreatePaymentModeInfoAsync(PaymentModeInfo paymentModeInfo)
        {
            return await CreateAsync(paymentModeInfo);
        }

        public async Task DeletePaymentModeInfoAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PaymentModeInfoExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(PaymentModeInfo entity)
        {
            return entity.PaymentModeInfoId;
        }
    }
} 