using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Models.Response;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Infrastructure.Repository.Interfaces;

namespace hospitalApiProject.Services.Implementations
{
    public class InvoiceService : EntityServiceBase<Invoice>, IInvoiceService
    {
        private readonly IGenericRepository<Invoice> _invoiceRepository;
        private readonly IGenericRepository<PaymentInfo> _paymentInfoRepository;

        public InvoiceService(FlorenceDbContext context, IGenericRepository<Invoice> invoiceRepository, IGenericRepository<PaymentInfo> paymentInfoRepository) : base(context)
        {
            _invoiceRepository = invoiceRepository;
            _paymentInfoRepository = paymentInfoRepository;
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
            invoice.CreatedDate = DateTime.UtcNow;
            invoice.InvoiceDate = DateTime.UtcNow;
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

        public async Task<InvoiceInfoResponse> GetInvoiceSummaryAsync(int invoiceId)
        {
            var invoice = await _context.Invoices
                .Include(i => i.PaymentInfos)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);

            if (invoice == null)
                return null;

            var totalPaid = invoice.PaymentInfos?.Sum(p => p.Amount ?? 0) ?? 0;
            var totalUnpaid = invoice.TotalAmount - totalPaid;

            return new InvoiceInfoResponse
            {
                InvoiceId = invoice.InvoiceId,
                PatientId = invoice.PatientId,
                AppointmentId = invoice.AppointmentId,
                TotalAmount = invoice.TotalAmount,
                TotalPaid = totalPaid,
                TotalUnpaid = totalUnpaid,
                Status = invoice.PaymentStatus,
                PaymentModes = invoice.PaymentInfos?.Select(p => p.PaymentMode).Distinct().ToArray() ?? Array.Empty<string>(),
                PaymentDetails = invoice.PaymentInfos?.Select(p => new PaymentDetailResponse
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount ?? 0,
                    PaymentMode = p.PaymentMode,
                    PaymentDate = p.PaymentDate
                }).ToList() ?? new List<PaymentDetailResponse>()
            };
        }

        public async Task<InvoiceSummaryResponse> GetInvoiceWithPaymentsAsync(string paymentMode, string paymentStatus, string fromDate, string toDate)
        {
            var query = _context.Invoices.AsQueryable();

            if (!string.IsNullOrEmpty(paymentMode))
            {
                query = query.Where(i => i.PaymentModeInfos.Any(p => p.PaymentMode == paymentMode));
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

            var invoices = await query
                .Include(i => i.PaymentModeInfos)
                .ToListAsync();

            var invoiceResponses = invoices.Select(i => new InvoiceInfoResponse
            {
                InvoiceId = i.InvoiceId,
                PatientId = i.PatientId,
                AppointmentId = i.AppointmentId,
                CreatedDate = DateOnly.FromDateTime(i.CreatedDate),
                Amount = (int)i.TotalAmount,
                TotalUnpaidAmount = i.TotalAmount - i.PaidAmount,
                Status = i.PaymentStatus,
                PaymentModes = string.Join(",", i.PaymentModeInfos.Select(p => p.PaymentMode)),
                PaymentDetails = i.PaymentModeInfos.ToList()
            }).ToList();

            return new InvoiceSummaryResponse
            {
                Invoices = invoiceResponses,
                TotalOnlineAmount = invoices.Sum(i => i.PaymentModeInfos.Where(p => p.PaymentMode == "Online").Sum(p => p.Amount)),
                TotalCashAmount = invoices.Sum(i => i.PaymentModeInfos.Where(p => p.PaymentMode == "Cash").Sum(p => p.Amount)),
                TotalAmount = invoices.Sum(i => i.TotalAmount)
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

        public async Task<TotalPaymentDetailsResponse> GetTotalAmountAsync(int patientId)
        {
            var invoices = await _invoiceRepository.GetAll()
                .Include(i => i.PaymentInfos)
                .Where(i => i.PatientId == patientId)
                .ToListAsync();

            var totalAmount = invoices.Sum(i => i.TotalAmount);
            var totalPaid = invoices.Sum(i => i.PaymentInfos?.Sum(p => p.Amount ?? 0) ?? 0);

            return new TotalPaymentDetailsResponse
            {
                TotalAmount = (int)totalAmount,
                TotalPaid = (int)totalPaid,
                TotalDue = (int)(totalAmount - totalPaid)
            };
        }

        public async Task<int> GetTotalAmountAsync()
        {
            return (int)await _context.Invoices.SumAsync(i => i.TotalAmount);
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
                InvoiceId = invoice.InvoiceId,
                PatientId = invoice.PatientId,
                AppointmentId = invoice.AppointmentId,
                CreatedDate = DateOnly.FromDateTime(invoice.CreatedDate),
                Amount = (int)invoice.TotalAmount,
                Status = invoice.PaymentStatus,
                IsConsultationPaid = invoice.PaidAmount >= invoice.TotalAmount,
                TransactionId = invoice.PaymentModeInfos.FirstOrDefault()?.TransactionId
            };
        }

        public async Task<int> GetInvoiceByPatientIdAsync(int patientId)
        {
            var invoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.PatientId == patientId);

            return invoice?.InvoiceId ?? 0;
        }

        public async Task<TotalPaymentDetailsResponse> GetTotalPaymentAmountAsync(string fromDate, string toDate)
        {
            throw new NotImplementedException();
        }

        public async Task<InvoiceSummaryResponse> GetInvoiceSummaryAsync(int patientId)
        {
            var invoices = await _invoiceRepository.GetAll()
                .Include(i => i.PaymentInfos)
                .Where(i => i.PatientId == patientId)
                .ToListAsync();

            var totalPaid = invoices.Sum(i => i.PaymentInfos?.Sum(p => p.Amount ?? 0) ?? 0);
            var totalUnpaid = invoices.Sum(i => i.TotalAmount - (i.PaymentInfos?.Sum(p => p.Amount ?? 0) ?? 0));

            var paymentModes = invoices
                .SelectMany(i => i.PaymentInfos ?? Enumerable.Empty<PaymentInfo>())
                .Select(p => p.PaymentMode)
                .Distinct()
                .ToList();

            var paymentDetails = invoices
                .SelectMany(i => i.PaymentInfos ?? Enumerable.Empty<PaymentInfo>())
                .Select(p => new PaymentDetailResponse
                {
                    Amount = p.Amount ?? 0,
                    PaymentMode = p.PaymentMode,
                    PaymentDate = p.PaymentDate
                })
                .ToList();

            return new InvoiceSummaryResponse
            {
                Invoices = invoices,
                TotalPaid = (int)totalPaid,
                TotalDue = (int)totalUnpaid,
                PaymentModes = paymentModes,
                PaymentDetails = paymentDetails
            };
        }
    }
}
