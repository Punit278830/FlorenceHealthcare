using hospitalApiProject.Models;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class PrescriptionTemplateMasterService : EntityServiceBase<PrescriptionTemplateMaster>, IPrescriptionTemplateMasterService
    {
        public PrescriptionTemplateMasterService(FlorenceDbContext context) : base(context)
        {
        }

        protected override int GetEntityId(PrescriptionTemplateMaster entity)
        {
            return entity.PrescriptionTemplateId;
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

        public async Task<PrescriptionTemplateMaster> CreatePrescriptionTemplateMasterAsync(PrescriptionTemplateMaster prescriptionTemplateMaster)
        {
            return await CreateAsync(prescriptionTemplateMaster);
        }

        public async Task DeletePrescriptionTemplateMasterAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> PrescriptionTemplateMasterExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }
    }
} 
