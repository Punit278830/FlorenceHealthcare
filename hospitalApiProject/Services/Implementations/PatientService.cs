using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PatientService : ServiceBase<PatientInfo>, IPatientService
    {
        public PatientService(FlorenceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PatientInfo>> GetAllPatientsAsync()
        {
            return await GetAllAsync();
        }

        public async Task<PatientInfo> GetPatientByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<PatientInfo> UpdatePatientAsync(int id, PatientInfo patient)
        {
            return await UpdateAsync(id, patient);
        }

        public async Task<PatientInfo> CreatePatientAsync(PatientInfo patient)
        {
            return await CreateAsync(patient);
        }

        public async Task DeletePatientAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PatientExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        public async Task<PatientInfo[]> GetPatientsByDateRangeAsync(DateOnly startDate, DateOnly endDate)
        {
            return await _context.PatientInfos
                .Where(p => p.CreatedDate.Date >= startDate.ToDateTime(TimeOnly.MinValue) && 
                           p.CreatedDate.Date <= endDate.ToDateTime(TimeOnly.MaxValue))
                .ToArrayAsync();
        }

        public async Task<object> GetPatientCountByGenderAsync()
        {
            var genderCounts = await _context.PatientInfos
                .GroupBy(p => p.Gender)
                .Select(g => new { Gender = g.Key, Count = g.Count() })
                .ToListAsync();

            return genderCounts;
        }

        public async Task<IEnumerable<PatientInfo>> SearchPatientsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<PatientInfo>();

            return await _context.PatientInfos
                .Where(p => p.FirstName.Contains(searchTerm) || 
                           p.LastName.Contains(searchTerm) || 
                           p.MobileNumber.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<IEnumerable<PatientInfo>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.PatientInfos
                .Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate)
                .ToListAsync();
        }

        protected override int GetEntityId(PatientInfo entity)
        {
            return entity.PatientId;
        }
    }
} 