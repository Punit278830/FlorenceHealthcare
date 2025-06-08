using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionTemplateDetailsService : ServiceBase<PrescriptionTemplateDetail>, IPrescriptionTemplateDetailsService
    {
        private new readonly FlorenceDbContext _context;

        public PrescriptionTemplateDetailsService(FlorenceDbContext context) : base(context)
        {
            _context = context;
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

        public async Task<PrescriptionTemplateDetail> CreatePrescriptionTemplateDetailsAsync(PrescriptionTemplateDetail detail)
        {
            return await CreateAsync(detail);
        }

        public async Task DeletePrescriptionTemplateDetailsAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionTemplateDetailsExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(PrescriptionTemplateDetail entity)
        {
            return entity.PrescriptionTemplateDetailId;
        }
    }
} 