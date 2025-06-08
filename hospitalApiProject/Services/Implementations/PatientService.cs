using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PatientService : ServiceBase<Patient>, IPatientService
    {
        public PatientService(FlorenceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            return await GetAllAsync();
        }

        public async Task<Patient> GetPatientByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<Patient> UpdatePatientAsync(int id, Patient patient)
        {
            return await UpdateAsync(id, patient);
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
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

        protected override int GetEntityId(Patient entity)
        {
            return entity.PatientId;
        }
    }
} 