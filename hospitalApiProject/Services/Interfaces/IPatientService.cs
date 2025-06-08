using hospitalApiProject.Models;

namespace Services.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<Patient?> GetPatientByIdAsync(int id);
        Task<Patient> CreatePatientAsync(Patient patient);
        Task<Patient> UpdatePatientAsync(Patient patient);
        Task DeletePatientAsync(int id);
        Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm);
    }
} 