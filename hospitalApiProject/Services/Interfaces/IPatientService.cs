using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<Patient> GetPatientByIdAsync(int id);
        Task<Patient> UpdatePatientAsync(int id, Patient patient);
        Task<Patient> CreatePatientAsync(Patient patient);
        Task DeletePatientAsync(int id);
        Task<bool> PatientExistsAsync(int id);
    }
} 