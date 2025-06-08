using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class DiagnosisTemplateMasterService : ServiceBase<DiagnosisTemplateMaster>, IDiagnosisTemplateMasterService
    {
        public DiagnosisTemplateMasterService(FlorenceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<DiagnosisTemplateMaster>> GetAllDiagnosisTemplateMastersAsync()
        {
            return await GetAllAsync();
        }

        public async Task<DiagnosisTemplateMaster> GetDiagnosisTemplateMasterByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<DiagnosisTemplateMaster> UpdateDiagnosisTemplateMasterAsync(int id, DiagnosisTemplateMaster diagnosisTemplateMaster)
        {
            return await UpdateAsync(id, diagnosisTemplateMaster);
        }

        public async Task<DiagnosisTemplateMaster> CreateDiagnosisTemplateMasterAsync(DiagnosisTemplateMaster diagnosisTemplateMaster)
        {
            return await CreateAsync(diagnosisTemplateMaster);
        }

        public async Task DeleteDiagnosisTemplateMasterAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> DiagnosisTemplateMasterExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(DiagnosisTemplateMaster entity)
        {
            return entity.DiagnosisTemplateMasterId;
        }
    }
} 