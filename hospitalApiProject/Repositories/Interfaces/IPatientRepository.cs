using hospitalApiProject.Models;
using Infrastructure.Interfaces;

namespace Repositories.Interfaces
{
    public interface IPatientRepository : IGenericRepository<Patient>
    {
        Task<IEnumerable<Patient>> GetPatientsWithAppointmentsAsync();
        Task<Patient?> GetPatientWithDetailsAsync(int id);
        Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm);
    }
} 