using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPatientService: ISimpleServiceBase
    {
        Task<IEnumerable<PatientInfo>> GetAllPatientsAsync();
        Task<PatientInfo> GetPatientByIdAsync(int id);
        Task<PatientInfo> UpdatePatientAsync(int id, PatientInfo patient);
        Task<PatientInfo> CreatePatientAsync(PatientInfo patient);
        Task DeletePatientAsync(int id);
        Task<bool> PatientExistsAsync(int id);
        Task<PatientInfo[]> GetPatientsByDateRangeAsync(DateOnly startDate, DateOnly endDate);
        Task<object> GetPatientCountByGenderAsync();
        Task<IEnumerable<PatientInfo>> SearchPatientsAsync(string searchTerm);
        Task<IEnumerable<PatientInfo>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 