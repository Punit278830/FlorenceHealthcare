using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPrescriptionDetailsService
    {
        Task<IEnumerable<PrescriptionDetail>> GetAllPrescriptionDetailsAsync();
        Task<PrescriptionDetail> GetPrescriptionDetailsByIdAsync(int id);
        Task<IEnumerable<PrescriptionDetail>> GetPrescriptionDetailsByPrescriptionIdAsync(int prescriptionId);
        Task<PrescriptionDetail> UpdatePrescriptionDetailsAsync(int id, PrescriptionDetail prescriptionDetail);
        Task<PrescriptionDetail> CreatePrescriptionDetailsAsync(PrescriptionDetail prescriptionDetail);
        Task DeletePrescriptionDetailsAsync(int id);
        Task<bool> PrescriptionDetailsExistsAsync(int id);
    }
} 