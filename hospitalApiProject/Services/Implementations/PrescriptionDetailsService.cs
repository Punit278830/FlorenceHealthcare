using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionDetailsService : ServiceBase<PrescriptionDetail>, IPrescriptionDetailsService
    {
        private new readonly FlorenceDbContext _context;

        public PrescriptionDetailsService(FlorenceDbContext context) : base(context)
        {
            _context = context;
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

        public async Task<PrescriptionDetail> CreatePrescriptionDetailsAsync(PrescriptionDetail detail)
        {
            return await CreateAsync(detail);
        }

        public async Task DeletePrescriptionDetailsAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionDetailsExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(PrescriptionDetail entity)
        {
            return entity.PrescriptionDetailId;
        }
    }
} 