using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IDiagnosisTemplateMasterService
    {
        Task<IEnumerable<DiagnosisTemplateMaster>> GetAllDiagnosisTemplateMastersAsync();
        Task<DiagnosisTemplateMaster> GetDiagnosisTemplateMasterByIdAsync(int id);
        Task<DiagnosisTemplateMaster> UpdateDiagnosisTemplateMasterAsync(int id, DiagnosisTemplateMaster diagnosisTemplateMaster);
        Task<DiagnosisTemplateMaster> CreateDiagnosisTemplateMasterAsync(DiagnosisTemplateMaster diagnosisTemplateMaster);
        Task DeleteDiagnosisTemplateMasterAsync(int id);
        Task<bool> DiagnosisTemplateMasterExistsAsync(int id);
    }
} 