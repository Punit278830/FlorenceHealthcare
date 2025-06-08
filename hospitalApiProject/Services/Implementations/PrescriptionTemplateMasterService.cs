using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionTemplateMasterService : ServiceBase<PrescriptionTemplateMaster>, IPrescriptionTemplateMasterService
    {
        private new readonly FlorenceDbContext _context;

        public PrescriptionTemplateMasterService(FlorenceDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PrescriptionTemplateMaster>> GetAllPrescriptionTemplateMastersAsync()
        {
            return await GetAllAsync();
        }

        public async Task<PrescriptionTemplateMaster> GetPrescriptionTemplateMasterByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<PrescriptionTemplateMaster> UpdatePrescriptionTemplateMasterAsync(int id, PrescriptionTemplateMaster prescriptionTemplateMaster)
        {
            return await UpdateAsync(id, prescriptionTemplateMaster);
        }

        public async Task<PrescriptionTemplateMaster> CreatePrescriptionTemplateMasterAsync(PrescriptionTemplateMaster template)
        {
            return await CreateAsync(template);
        }

        public async Task DeletePrescriptionTemplateMasterAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionTemplateMasterExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(PrescriptionTemplateMaster entity)
        {
            return entity.PrescriptionTemplateMasterId;
        }
    }
} 