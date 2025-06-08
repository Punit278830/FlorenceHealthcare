using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionDetailsService : ServiceBase<PrescriptionDetail>, IPrescriptionDetailsService
    {
        public PrescriptionDetailsService(FlorenceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PrescriptionDetail>> GetAllPrescriptionDetailsAsync()
        {
            return await GetAllAsync();
        }

        public async Task<PrescriptionDetail> GetPrescriptionDetailByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<PrescriptionDetail>> GetPrescriptionDetailsByPrescriptionIdAsync(int prescriptionId)
        {
            return await _context.PrescriptionDetails
                .Where(p => p.PrescriptionId == prescriptionId)
                .ToListAsync();
        }

        public async Task<PrescriptionDetail> UpdatePrescriptionDetailAsync(int id, PrescriptionDetail prescriptionDetail)
        {
            return await UpdateAsync(id, prescriptionDetail);
        }

        public async Task<PrescriptionDetail> CreatePrescriptionDetailAsync(PrescriptionDetail prescriptionDetail)
        {
            return await CreateAsync(prescriptionDetail);
        }

        public async Task DeletePrescriptionDetailAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionDetailExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(PrescriptionDetail entity)
        {
            return entity.PrescriptionDetailId;
        }
    }
} 