using hospitalApiProject.Data;
using hospitalApiProject.Infrastructure.Repository.Interfaces;
using hospitalApiProject.Models;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Infrastructure.Repository
{
    public class InvoiceRepository : GenericRepository<Invoice>, IInvoiceRepository
    {
        private readonly FlorenceDbContext _context;

        public InvoiceRepository(FlorenceDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Invoice>> GetInvoicesByPatientIdAsync(int patientId)
        {
            return await _context.Invoices
                .Include(i => i.PaymentInfos)
                .Include(i => i.PaymentModeInfos)
                .Where(i => i.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<Invoice> GetInvoiceWithDetailsAsync(int invoiceId)
        {
            return await _context.Invoices
                .Include(i => i.PaymentInfos)
                .Include(i => i.PaymentModeInfos)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
        }

        public async Task<IEnumerable<Invoice>> GetInvoicesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Invoices
                .Include(i => i.PaymentInfos)
                .Include(i => i.PaymentModeInfos)
                .Where(i => i.InvoiceDate >= startDate && i.InvoiceDate <= endDate)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalAmountByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Invoices
                .Where(i => i.InvoiceDate >= startDate && i.InvoiceDate <= endDate)
                .SumAsync(i => i.TotalAmount);
        }

        public async Task<decimal> GetTotalPaidAmountByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Invoices
                .Where(i => i.InvoiceDate >= startDate && i.InvoiceDate <= endDate)
                .SumAsync(i => i.PaidAmount);
        }
    }
} 