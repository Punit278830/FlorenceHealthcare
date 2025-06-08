using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class InvoiceService : ServiceBase<Invoice>, IInvoiceService
    {
        public InvoiceService(FlorenceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Invoice>> GetAllInvoicesAsync()
        {
            return await GetAllAsync();
        }

        public async Task<Invoice> GetInvoiceByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<Invoice>> GetInvoicesByPatientIdAsync(int patientId)
        {
            return await _context.Invoices
                .Where(i => i.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<Invoice> UpdateInvoiceAsync(int id, Invoice invoice)
        {
            return await UpdateAsync(id, invoice);
        }

        public async Task<Invoice> CreateInvoiceAsync(Invoice invoice)
        {
            return await CreateAsync(invoice);
        }

        public async Task DeleteInvoiceAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> InvoiceExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        public async Task<InvoiceSummaryResponse> GetInvoiceWithPaymentsAsync(string paymentMode, string paymentStatus, string fromDate, string toDate)
        {
            // Implementation for getting invoice summary with payments
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<object>> GetInvoicesForTodayAsync()
        {
            // Implementation for getting today's invoices
            throw new NotImplementedException();
        }

        public async Task<TotalPaymentDetailsResponse> GetTotalPaymentAmountAsync(string fromDate, string toDate)
        {
            // Implementation for getting total payment amount
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalAmountAsync()
        {
            // Implementation for getting total amount
            throw new NotImplementedException();
        }

        public async Task<InvoiceInfo> CreateInvoiceInfoAsync(InvoiceInfo invoiceInfo)
        {
            // Implementation for creating invoice info
            throw new NotImplementedException();
        }

        public async Task<PaymentModeInfo> AddPaymentModeAsync(PaymentModeInfo paymentModeInfo)
        {
            // Implementation for adding payment mode
            throw new NotImplementedException();
        }

        public async Task<InvoiceInfoDetail> GetInvoiceByIdAsync(int id)
        {
            var invoiceInfo = await _context.InvoiceInfos
                .Where(i => i.InvoiceId == id)
                .Select(i => new InvoiceInfoDetail
                {
                    InvoiceId = i.InvoiceId,
                    PatientId = (int)(i.PatientId ?? 0),
                    AppointmentId = (int)(i.AppointmentId ?? 0),
                    CreatedDate = i.CreatedDate,
                    Amount = i.Amount,
                    Status = i.Status,
                    IsConsultationPaid = i.IsConsultationPaid,
                    TransactionId = (bool)i.IsConsultationPaid
                        ? _context.PaymentModeInfo
                            .Where(p => p.InvoiceId == i.InvoiceId && p.itemName == "Consultation")
                            .OrderByDescending(p => p.PaymentDate)
                            .Select(p => p.TransactionId)
                            .FirstOrDefault()
                        : null
                })
                .FirstOrDefaultAsync();

            if (invoiceInfo?.IsConsultationPaid == true)
            {
                var paymentInfo = await GetPaymentModeInfoByInvoiceId(id);
                if (paymentInfo?.Count > 0)
                {
                    invoiceInfo.TransactionId = paymentInfo[0].TransactionId ?? "Cash";
                }
                else
                {
                    invoiceInfo.TransactionId = "Cash";
                }
            }

            return invoiceInfo;
        }

        private async Task<List<PaymentModeInfo>> GetPaymentModeInfoByInvoiceId(int? id)
        {
            if (id == 0)
            {
                return null;
            }

            return await _context.PaymentModeInfo
                .Where(e => e.InvoiceId == id && e.PaymentMode == "Online" && e.itemId.Contains("Consultation"))
                .ToListAsync();
        }

        public async Task<int> GetInvoiceByPatientIdAsync(int patientId)
        {
            var maxInvoiceId = await _context.InvoiceInfos
                .Where(i => i.PatientId == patientId)
                .MaxAsync(i => i.InvoiceId);

            return maxInvoiceId;
        }

        protected override int GetEntityId(Invoice entity)
        {
            return entity.InvoiceId;
        }
    }
} 