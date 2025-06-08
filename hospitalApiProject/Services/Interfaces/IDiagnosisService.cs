using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IDiagnosisService
    {
        Task<IEnumerable<Diagnosis>> GetAllDiagnosesAsync();
        Task<Diagnosis> GetDiagnosisByIdAsync(int id);
        Task<IEnumerable<Diagnosis>> GetDiagnosesByPatientIdAsync(int patientId);
        Task<Diagnosis> UpdateDiagnosisAsync(int id, Diagnosis diagnosis);
        Task<Diagnosis> CreateDiagnosisAsync(Diagnosis diagnosis);
        Task DeleteDiagnosisAsync(int id);
        Task<bool> DiagnosisExistsAsync(int id);
    }
} 