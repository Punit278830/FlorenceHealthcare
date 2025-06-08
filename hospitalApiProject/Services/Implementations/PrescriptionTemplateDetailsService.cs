using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionTemplateDetailsService : ServiceBase<PrescriptionTemplateDetail>, IPrescriptionTemplateDetailsService
    {
        public PrescriptionTemplateDetailsService(FlorenceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PrescriptionTemplateDetail>> GetAllPrescriptionTemplateDetailsAsync()
        {
            return await GetAllAsync();
        }

        public async Task<PrescriptionTemplateDetail> GetPrescriptionTemplateDetailByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<PrescriptionTemplateDetail>> GetPrescriptionTemplateDetailsByTemplateIdAsync(int templateId)
        {
            return await _context.PrescriptionTemplateDetails
                .Where(p => p.PrescriptionTemplateId == templateId)
                .ToListAsync();
        }

        public async Task<PrescriptionTemplateDetail> UpdatePrescriptionTemplateDetailAsync(int id, PrescriptionTemplateDetail prescriptionTemplateDetail)
        {
            return await UpdateAsync(id, prescriptionTemplateDetail);
        }

        public async Task<PrescriptionTemplateDetail> CreatePrescriptionTemplateDetailAsync(PrescriptionTemplateDetail prescriptionTemplateDetail)
        {
            return await CreateAsync(prescriptionTemplateDetail);
        }

        public async Task DeletePrescriptionTemplateDetailAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionTemplateDetailExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(PrescriptionTemplateDetail entity)
        {
            return entity.PrescriptionTemplateDetailId;
        }
    }
} 