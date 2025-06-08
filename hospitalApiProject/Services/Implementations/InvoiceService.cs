using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Models.Response;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Infrastructure.Repository.Interfaces;
using hospitalApiProject.Models.DTOs;

namespace hospitalApiProject.Services.Implementations
{
    public class InvoiceService : ServiceBase<Invoice>, IInvoiceService
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IGenericRepository<PaymentInfo> _paymentInfoRepository;
        private readonly IGenericRepository<PaymentModeInfo> _paymentModeInfoRepository;

        public InvoiceService(
            FlorenceDbContext context,
            IInvoiceRepository invoiceRepository,
            IGenericRepository<PaymentInfo> paymentInfoRepository,
            IGenericRepository<PaymentModeInfo> paymentModeInfoRepository) : base(context)
        {
            _invoiceRepository = invoiceRepository;
            _paymentInfoRepository = paymentInfoRepository;
            _paymentModeInfoRepository = paymentModeInfoRepository;
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
            return await _invoiceRepository.GetInvoicesByPatientIdAsync(patientId);
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
                TotalAmount = i.TotalAmount,
                TotalPaid = i.PaidAmount,
                TotalUnpaid = i.TotalAmount - i.PaidAmount,
                Status = i.PaymentStatus,
                PaymentModes = string.Join(",", i.PaymentModeInfos.Select(p => p.PaymentMode)),
                PaymentDetails = i.PaymentModeInfos.Select(p => new PaymentDetailResponse
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount ?? 0,
                    PaymentMode = p.PaymentMode,
                    PaymentDate = p.PaymentDate
                }).ToList()
            }).ToList();

            return new InvoiceSummaryResponse
            {
                Invoices = invoiceResponses,
                TotalOnlineAmount = (int)invoices.Sum(i => i.PaymentModeInfos.Where(p => p.PaymentMode == "Online").Sum(p => p.Amount ?? 0)),
                TotalCashAmount = (int)invoices.Sum(i => i.PaymentModeInfos.Where(p => p.PaymentMode == "Cash").Sum(p => p.Amount ?? 0)),
                TotalAmount = (int)invoices.Sum(i => i.TotalAmount)
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
            var startDate = DateTime.Parse(fromDate);
            var endDate = DateTime.Parse(toDate);

            var totalAmount = await _invoiceRepository.GetTotalAmountByDateRangeAsync(startDate, endDate);
            var totalPaid = await _invoiceRepository.GetTotalPaidAmountByDateRangeAsync(startDate, endDate);

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

        public async Task<InvoiceInfoResponse> GetInvoiceById(int invoiceId)
        {
            var invoice = await _invoiceRepository.GetInvoiceWithDetailsAsync(invoiceId);

            if (invoice == null)
                return null;

            return new InvoiceInfoResponse
            {
                InvoiceId = invoice.InvoiceId,
                PatientId = invoice.PatientId,
                AppointmentId = invoice.AppointmentId,
                CreatedDate = DateOnly.FromDateTime(invoice.CreatedDate),
                TotalAmount = invoice.TotalAmount,
                TotalPaid = invoice.PaidAmount,
                TotalUnpaid = invoice.TotalAmount - invoice.PaidAmount,
                Status = invoice.PaymentStatus,
                PaymentModes = string.Join(",", invoice.PaymentModeInfos?.Select(p => p.PaymentMode) ?? new List<string>()),
                PaymentDetails = invoice.PaymentModeInfos?.Select(p => new PaymentDetailResponse
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount ?? 0,
                    PaymentMode = p.PaymentMode,
                    PaymentDate = p.PaymentDate
                }).ToList() ?? new List<PaymentDetailResponse>()
            };
        }

        public async Task<InvoiceInfoResponse> GetInvoiceByAppointmentId(int appointmentId)
        {
            var invoice = await _context.Invoices
                .Include(i => i.PaymentModeInfos)
                .FirstOrDefaultAsync(i => i.AppointmentId == appointmentId);

            if (invoice == null)
                return null;

            return new InvoiceInfoResponse
            {
                InvoiceId = invoice.InvoiceId,
                PatientId = invoice.PatientId,
                AppointmentId = invoice.AppointmentId,
                CreatedDate = DateOnly.FromDateTime(invoice.CreatedDate),
                TotalAmount = invoice.TotalAmount,
                TotalPaid = invoice.PaidAmount,
                TotalUnpaid = invoice.TotalAmount - invoice.PaidAmount,
                Status = invoice.PaymentStatus,
                PaymentModes = string.Join(",", invoice.PaymentModeInfos?.Select(p => p.PaymentMode) ?? new List<string>()),
                PaymentDetails = invoice.PaymentModeInfos?.Select(p => new PaymentDetailResponse
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount ?? 0,
                    PaymentMode = p.PaymentMode,
                    PaymentDate = p.PaymentDate
                }).ToList() ?? new List<PaymentDetailResponse>()
            };
        }

        public async Task<InvoiceInfoResponse> CreateInvoice(NewInvoiceDto invoiceDto)
        {
            var invoice = new Invoice
            {
                PatientId = invoiceDto.PatientId,
                AppointmentId = invoiceDto.AppointmentId,
                CreatedDate = DateTime.UtcNow,
                TotalAmount = invoiceDto.TotalAmount,
                PaidAmount = 0,
                PaymentStatus = "Pending"
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return new InvoiceInfoResponse
            {
                InvoiceId = invoice.InvoiceId,
                PatientId = invoice.PatientId,
                AppointmentId = invoice.AppointmentId,
                CreatedDate = DateOnly.FromDateTime(invoice.CreatedDate),
                TotalAmount = invoice.TotalAmount,
                TotalPaid = invoice.PaidAmount,
                TotalUnpaid = invoice.TotalAmount - invoice.PaidAmount,
                Status = invoice.PaymentStatus,
                PaymentModes = string.Join(",", invoice.PaymentModeInfos?.Select(p => p.PaymentMode) ?? new List<string>()),
                PaymentDetails = invoice.PaymentModeInfos?.Select(p => new PaymentDetailResponse
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount ?? 0,
                    PaymentMode = p.PaymentMode,
                    PaymentDate = p.PaymentDate
                }).ToList() ?? new List<PaymentDetailResponse>()
            };
        }

        public async Task<InvoiceInfoResponse> UpdateInvoicePayment(InvoicePaymentDto paymentDto)
        {
            var invoice = await _invoiceRepository.GetInvoiceWithDetailsAsync(paymentDto.InvoiceInfo.InvoiceId);

            if (invoice == null)
                return null;

            invoice.PaidAmount += paymentDto.Amount;
            invoice.PaymentStatus = invoice.PaidAmount >= invoice.TotalAmount ? "Paid" : "Partially Paid";

            var paymentMode = new PaymentModeInfo
            {
                InvoiceId = invoice.InvoiceId,
                PaymentMode = paymentDto.PaymentMode,
                Amount = paymentDto.Amount,
                PaymentDate = DateTime.UtcNow
            };

            invoice.PaymentModeInfos.Add(paymentMode);
            await _context.SaveChangesAsync();

            return new InvoiceInfoResponse
            {
                InvoiceId = invoice.InvoiceId,
                PatientId = invoice.PatientId,
                AppointmentId = invoice.AppointmentId,
                CreatedDate = DateOnly.FromDateTime(invoice.CreatedDate),
                TotalAmount = invoice.TotalAmount,
                TotalPaid = invoice.PaidAmount,
                TotalUnpaid = invoice.TotalAmount - invoice.PaidAmount,
                Status = invoice.PaymentStatus,
                PaymentModes = string.Join(",", invoice.PaymentModeInfos?.Select(p => p.PaymentMode) ?? new List<string>()),
                PaymentDetails = invoice.PaymentModeInfos?.Select(p => new PaymentDetailResponse
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount ?? 0,
                    PaymentMode = p.PaymentMode,
                    PaymentDate = p.PaymentDate
                }).ToList() ?? new List<PaymentDetailResponse>()
            };
        }

        public async Task<InvoiceInfoDetail> GetInvoiceInfoByIdAsync(int id)
        {
            var invoice = await _invoiceRepository.GetInvoiceWithDetailsAsync(id);

            if (invoice == null)
                return null;

            var additionalItems = await _context.AdditionalInvoiceItems
                .Where(e => e.InvoiceId == id)
                .Join(
                    _context.InvoiceItemMasters,
                    e => e.ItemName,
                    im => im.ItemName,
                    (e, im) => new AdditionalInvoiceItemDetail
                    {
                        Id = e.Id,
                        InvoiceId = e.InvoiceId,
                        ItemName = e.ItemName,
                        Description = e.Description,
                        Discount = e.Discount,
                        Fee = e.Fee,
                        CreatedBy = e.CreatedBy,
                        FinalAmount = e.FinalAmount,
                        Status = e.Status,
                        TransactionId = e.TransactionId,
                        ItemId = im.ItemId
                    })
                .ToListAsync();

            return new InvoiceInfoDetail
            {
                InvoiceId = invoice.InvoiceId,
                PatientId = invoice.PatientId,
                AppointmentId = invoice.AppointmentId,
                CreatedDate = invoice.CreatedDate,
                TotalAmount = invoice.TotalAmount,
                TotalPaid = invoice.PaidAmount,
                TotalUnpaid = invoice.TotalAmount - invoice.PaidAmount,
                Status = invoice.PaymentStatus,
                PaymentDetails = invoice.PaymentModeInfos?.Select(p => new PaymentDetailResponse
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount ?? 0,
                    PaymentMode = p.PaymentMode,
                    PaymentDate = p.PaymentDate
                }).ToList() ?? new List<PaymentDetailResponse>(),
                AdditionalItems = additionalItems
            };
        }
    }
}
