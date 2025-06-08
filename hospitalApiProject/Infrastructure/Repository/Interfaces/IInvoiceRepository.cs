using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository.Interfaces
{
    public interface IInvoiceRepository : IGenericRepository<Invoice>
    {
        Task<IEnumerable<Invoice>> GetInvoicesByPatientIdAsync(int patientId);
        Task<Invoice> GetInvoiceWithDetailsAsync(int invoiceId);
        Task<IEnumerable<Invoice>> GetInvoicesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<decimal> GetTotalAmountByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<decimal> GetTotalPaidAmountByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 