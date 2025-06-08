using hospitalApiProject.Models;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionService : EntityServiceBase<Prescription>, IPrescriptionService
    {
        public PrescriptionService(FlorenceDbContext context) : base(context)
        {
        }

        protected override int GetEntityId(Prescription entity)
        {
            return entity.PrescriptionId;
        }

        public async Task<IEnumerable<Prescription>> GetAllPrescriptionsAsync()
        {
            return await GetAllAsync();
        }

        public async Task<Prescription> GetPrescriptionByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<Prescription>> GetPrescriptionsByPatientIdAsync(int patientId)
        {
            return await _context.Prescriptions
                .Where(p => p.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<Prescription> UpdatePrescriptionAsync(int id, Prescription prescription)
        {
            return await UpdateAsync(id, prescription);
        }

        public async Task<Prescription> CreatePrescriptionAsync(Prescription prescription)
        {
            return await CreateAsync(prescription);
        }

        public async Task DeletePrescriptionAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }
    }
} 