using hospitalApiProject.Models;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionTemplateDetailsService : EntityServiceBase<PrescriptionTemplateDetail>, IPrescriptionTemplateDetailsService
    {
        public PrescriptionTemplateDetailsService(FlorenceDbContext context) : base(context)
        {
        }

        protected override int GetEntityId(PrescriptionTemplateDetail entity)
        {
            return entity.PrescriptionTemplateDetailId;
        }

        public async Task<IEnumerable<PrescriptionTemplateDetail>> GetAllPrescriptionTemplateDetailsAsync()
        {
            return await GetAllAsync();
        }

        public async Task<PrescriptionTemplateDetail> GetPrescriptionTemplateDetailsByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<PrescriptionTemplateDetail>> GetPrescriptionTemplateDetailsByTemplateIdAsync(int templateId)
        {
            return await _context.PrescriptionTemplateDetails
                .Where(p => p.PrescriptionTemplateId == templateId)
                .ToListAsync();
        }

        public async Task<PrescriptionTemplateDetail> UpdatePrescriptionTemplateDetailsAsync(int id, PrescriptionTemplateDetail prescriptionTemplateDetail)
        {
            return await UpdateAsync(id, prescriptionTemplateDetail);
        }

        public async Task<PrescriptionTemplateDetail> CreatePrescriptionTemplateDetailsAsync(PrescriptionTemplateDetail prescriptionTemplateDetail)
        {
            return await CreateAsync(prescriptionTemplateDetail);
        }

        public async Task DeletePrescriptionTemplateDetailsAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionTemplateDetailsExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }
    }
} 