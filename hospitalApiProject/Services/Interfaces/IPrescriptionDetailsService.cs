using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPrescriptionDetailsService
    {
        Task<IEnumerable<PrescriptionDetails>> GetAllPrescriptionDetailsAsync();
        Task<PrescriptionDetails> GetPrescriptionDetailsByIdAsync(int id);
        Task<IEnumerable<PrescriptionDetails>> GetPrescriptionDetailsByPrescriptionIdAsync(int prescriptionId);
        Task<PrescriptionDetails> UpdatePrescriptionDetailsAsync(int id, PrescriptionDetails prescriptionDetails);
        Task<PrescriptionDetails> CreatePrescriptionDetailsAsync(PrescriptionDetails prescriptionDetails);
        Task DeletePrescriptionDetailsAsync(int id);
        Task<bool> PrescriptionDetailsExistsAsync(int id);
    }
} 