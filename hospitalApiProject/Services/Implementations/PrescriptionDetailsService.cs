using hospitalApiProject.Models;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionDetailsService : EntityServiceBase<PrescriptionDetail>, IPrescriptionDetailsService
    {
        public PrescriptionDetailsService(FlorenceDbContext context) : base(context)
        {
        }

        protected override int GetEntityId(PrescriptionDetail entity)
        {
            return entity.PrescriptionDetailId;
        }

        public async Task<IEnumerable<PrescriptionDetail>> GetAllPrescriptionDetailsAsync()
        {
            return await GetAllAsync();
        }

        public async Task<PrescriptionDetail> GetPrescriptionDetailsByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<PrescriptionDetail>> GetPrescriptionDetailsByPrescriptionIdAsync(int prescriptionId)
        {
            return await _context.PrescriptionDetails
                .Where(p => p.PrescriptionId == prescriptionId)
                .ToListAsync();
        }

        public async Task<PrescriptionDetail> UpdatePrescriptionDetailsAsync(int id, PrescriptionDetail prescriptionDetail)
        {
            return await UpdateAsync(id, prescriptionDetail);
        }

        public async Task<PrescriptionDetail> CreatePrescriptionDetailsAsync(PrescriptionDetail prescriptionDetail)
        {
            return await CreateAsync(prescriptionDetail);
        }

        public async Task DeletePrescriptionDetailsAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionDetailsExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }
    }
}
