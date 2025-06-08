using hospitalApiProject.Models;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class DiagnosisService : EntityServiceBase<Diagnosis>, IDiagnosisService
    {
        public DiagnosisService(FlorenceDbContext context) : base(context)
        {
        }

        protected override int GetEntityId(Diagnosis entity)
        {
            return entity.DiagnosisId;
        }

        public async Task<IEnumerable<Diagnosis>> GetAllDiagnosesAsync()
        {
            return await GetAllAsync();
        }

        public async Task<Diagnosis> GetDiagnosisByIdAsync(int id)
        {
            return await GetByIdAsync(id);
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

        public async Task<IEnumerable<Diagnosis>> GetDiagnosesByPatientIdAsync(int patientId)
        {
            return await _context.Diagnoses
                .Where(d => d.PatientId == patientId)
                .ToListAsync();
        }
    }
} 