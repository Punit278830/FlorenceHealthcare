using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class DiagnosisService : ServiceBase<Diagnosis>, IDiagnosisService
    {
        private new readonly FlorenceDbContext _context;

        public DiagnosisService(FlorenceDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Diagnosis>> GetAllDiagnosesAsync()
        {
            return await GetAllAsync();
        }

        public async Task<Diagnosis> GetDiagnosisByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<Diagnosis>> GetDiagnosesByPatientIdAsync(int patientId)
        {
            return await _context.Diagnoses
                .Where(d => d.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<Diagnosis> UpdateDiagnosisAsync(int id, Diagnosis diagnosis)
        {
            return await UpdateAsync(id, diagnosis);
        }

        public async Task<Diagnosis> CreateDiagnosisAsync(Diagnosis diagnosis)
        {
            return await CreateAsync(diagnosis);
        }

        public async Task DeleteDiagnosisAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> DiagnosisExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(Diagnosis entity)
        {
            return entity.DiagnosisId;
        }
    }
} 