using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using Infrastructure.Implementations;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class PatientRepository : GenericRepository<Patient>, IPatientRepository
    {
        private readonly DbContext _context;

        public PatientRepository(DbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetPatientsWithAppointmentsAsync()
        {
            return await _context.Set<Patient>()
                .Include(p => p.AppointmentInfos)
                .ToListAsync();
        }

        public async Task<Patient?> GetPatientWithDetailsAsync(int id)
        {
            return await _context.Set<Patient>()
                .Include(p => p.AppointmentInfos)
                .Include(p => p.Invoices)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm)
        {
            return await _context.Set<Patient>()
                .Where(p => p.FirstName.Contains(searchTerm) || 
                           p.LastName.Contains(searchTerm) || 
                           p.Email.Contains(searchTerm))
                .ToListAsync();
        }
    }
} 