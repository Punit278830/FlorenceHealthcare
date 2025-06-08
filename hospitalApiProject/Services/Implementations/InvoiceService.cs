using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class InvoiceService : EntityServiceBase<Invoice>, IInvoiceService
    {
        public InvoiceService(FlorenceDbContext context) : base(context)
        {
        }

        protected override int GetEntityId(Invoice entity)
        {
            return entity.InvoiceId;
        }

        public async Task<IEnumerable<Invoice>> GetAllInvoicesAsync()
        {
            return await GetAllAsync();
        }

        public async Task<Invoice> GetInvoiceByIdAsync(int id)
        {
            return await GetByIdAsync(id);
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

        public async Task<IEnumerable<Invoice>> GetInvoicesByPatientIdAsync(int patientId)
        {
            return await _context.Invoices
                .Where(i => i.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Invoice>> GetInvoicesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Invoices
                .Where(i => i.InvoiceDate >= startDate && i.InvoiceDate <= endDate)
                .ToListAsync();
        }

        public async Task<InvoiceSummaryResponse> GetInvoiceSummaryAsync(int invoiceId)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Patient)
                .Include(i => i.PaymentInfos)
                .Include(i => i.PaymentModeInfos)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);

            if (invoice == null)
                return null;

            var invoiceInfoResponse = new InvoiceInfoResponse
            {
                InvoiceId = invoice.InvoiceId,
                PatientName = $"{invoice.Patient.FirstName} {invoice.Patient.LastName}",
                InvoiceDate = invoice.InvoiceDate,
                TotalAmount = invoice.TotalAmount,
                PaidAmount = invoice.PaymentInfos.Sum(p => p.Amount),
                RemainingAmount = invoice.TotalAmount - invoice.PaymentInfos.Sum(p => p.Amount),
                PaymentModes = invoice.PaymentModeInfos.Select(p => p.PaymentMode).ToList()
            };

            return new InvoiceSummaryResponse
            {
                Invoices = new List<InvoiceInfoResponse> { invoiceInfoResponse },
                TotalOnlineAmount = invoice.PaymentModeInfos.Where(p => p.PaymentMode == "Online").Sum(p => p.Amount),
                TotalCashAmount = invoice.PaymentModeInfos.Where(p => p.PaymentMode == "Cash").Sum(p => p.Amount),
                TotalAmount = invoice.TotalAmount
            };
        }

        public async Task<InvoiceSummaryResponse> GetInvoiceWithPaymentsAsync(string paymentMode, string paymentStatus, string fromDate, string toDate)
        {
            var query = _context.Invoices.AsQueryable();

            if (!string.IsNullOrEmpty(paymentMode))
            {
                query = query.Where(i => i.PaymentMode == paymentMode);
            }

            if (!string.IsNullOrEmpty(paymentStatus))
            {
                query = query.Where(i => i.PaymentStatus == paymentStatus);
            }

            if (!string.IsNullOrEmpty(fromDate) && !string.IsNullOrEmpty(toDate))
            {
                var startDate = DateTime.Parse(fromDate);
                var endDate = DateTime.Parse(toDate);
                query = query.Where(i => i.InvoiceDate >= startDate && i.InvoiceDate <= endDate);
            }

            var invoices = await query.ToListAsync();
            var totalAmount = invoices.Sum(i => i.TotalAmount);
            var totalPaid = invoices.Sum(i => i.PaidAmount);
            var totalDue = totalAmount - totalPaid;

            return new InvoiceSummaryResponse
            {
                TotalAmount = totalAmount,
                TotalPaid = totalPaid,
                TotalDue = totalDue,
                Invoices = invoices
            };
        }

        public async Task<IEnumerable<object>> GetInvoicesForTodayAsync()
        {
            var today = DateTime.Today;
            return await _context.Invoices
                .Where(i => i.InvoiceDate.Date == today)
                .Select(i => new
                {
                    i.InvoiceId,
                    i.PatientId,
                    i.TotalAmount,
                    i.PaidAmount,
                    i.PaymentStatus
                })
                .ToListAsync();
        }

        public async Task<TotalPaymentDetailsResponse> GetTotalPaymentAmountAsync(string fromDate, string toDate)
        {
            var query = _context.Invoices.AsQueryable();

            if (!string.IsNullOrEmpty(fromDate) && !string.IsNullOrEmpty(toDate))
            {
                var startDate = DateTime.Parse(fromDate);
                var endDate = DateTime.Parse(toDate);
                query = query.Where(i => i.InvoiceDate >= startDate && i.InvoiceDate <= endDate);
            }

            var invoices = await query.ToListAsync();
            var totalAmount = invoices.Sum(i => i.TotalAmount);
            var totalPaid = invoices.Sum(i => i.PaidAmount);
            var totalDue = totalAmount - totalPaid;

            return new TotalPaymentDetailsResponse
            {
                TotalAmount = totalAmount,
                TotalPaid = totalPaid,
                TotalDue = totalDue
            };
        }

        public async Task<int> GetTotalAmountAsync()
        {
            return await _context.Invoices.SumAsync(i => i.TotalAmount);
        }

        public async Task<InvoiceInfo> CreateInvoiceInfoAsync(InvoiceInfo invoiceInfo)
        {
            _context.InvoiceInfos.Add(invoiceInfo);
            await _context.SaveChangesAsync();
            return invoiceInfo;
        }

        public async Task<PaymentModeInfo> AddPaymentModeAsync(PaymentModeInfo paymentModeInfo)
        {
            _context.PaymentModeInfos.Add(paymentModeInfo);
            await _context.SaveChangesAsync();
            return paymentModeInfo;
        }

        public async Task<InvoiceInfoDetail> GetInvoiceInfoByIdAsync(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Patient)
                .Include(i => i.PaymentInfos)
                .Include(i => i.PaymentModeInfos)
                .FirstOrDefaultAsync(i => i.InvoiceId == id);

            if (invoice == null)
            {
                throw new KeyNotFoundException($"Invoice with ID {id} not found");
            }

            return new InvoiceInfoDetail
            {
                Invoice = invoice,
                Patient = invoice.Patient,
                PaymentInfos = invoice.PaymentInfos,
                PaymentModeInfos = invoice.PaymentModeInfos
            };
        }

        public async Task<int> GetInvoiceByPatientIdAsync(int patientId)
        {
            var invoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.PatientId == patientId);

            return invoice?.InvoiceId ?? 0;
        }
    }
}
