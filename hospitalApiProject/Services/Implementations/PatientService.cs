using hospitalApiProject.Models;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Services.Implementations
{
    public class PatientService : EntityServiceBase<PatientInfo>, IPatientService
    {
        private readonly FlorenceDbContext _context;

        public PatientService(FlorenceDbContext context) : base(context)
        {
            _context = context;
        }

        protected override int GetEntityId(PatientInfo entity)
        {
            return entity.PatientId;
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
                .Where(p => p.RegstrationDate >= startDate && p.RegstrationDate <= endDate)
                .ToArrayAsync();
        }

        public async Task<object> GetPatientCountByGenderAsync()
        {
            return await _context.PatientInfos
                .GroupBy(p => p.Gender)
                .Select(g => new { Gender = g.Key, Count = g.Count() })
                .ToListAsync();
        }

        public async Task<IEnumerable<PatientInfo>> SearchPatientsAsync(string searchTerm)
        {
            return await _context.PatientInfos
                .Where(p => p.FirstName.Contains(searchTerm) || 
                           p.LastName.Contains(searchTerm) || 
                           p.Mobile.Contains(searchTerm) ||
                           p.Email.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<IEnumerable<PatientInfo>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.PatientInfos
                .Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate)
                .ToListAsync();
        }

        public async Task<PatientInfo> GetPatientById(int patientId)
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            if (patient == null)
                return null;

            return new PatientInfo
            {
                PatientId = patient.PatientId,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                Email = patient.Email,
                DateOfBirth = patient.DateOfBirth,
                PhoneNumber = patient.PhoneNumber,
                Address = patient.Address,
                Gender = patient.Gender
            };
        }
    }
} 