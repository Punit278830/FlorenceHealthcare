using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPrescriptionService: ISimpleServiceBase
    {
        Task<IEnumerable<Prescription>> GetAllPrescriptionsAsync();
        Task<Prescription> GetPrescriptionByIdAsync(int id);
        Task<IEnumerable<Prescription>> GetPrescriptionsByPatientIdAsync(int patientId);
        Task<Prescription> UpdatePrescriptionAsync(int id, Prescription prescription);
        Task<Prescription> CreatePrescriptionAsync(Prescription prescription);
        Task DeletePrescriptionAsync(int id);
        Task<bool> PrescriptionExistsAsync(int id);
    }
} 