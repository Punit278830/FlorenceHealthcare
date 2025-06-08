using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPrescriptionTemplateDetailsService
    {
        Task<IEnumerable<PrescriptionTemplateDetails>> GetAllPrescriptionTemplateDetailsAsync();
        Task<PrescriptionTemplateDetails> GetPrescriptionTemplateDetailsByIdAsync(int id);
        Task<IEnumerable<PrescriptionTemplateDetails>> GetPrescriptionTemplateDetailsByTemplateIdAsync(int templateId);
        Task<PrescriptionTemplateDetails> UpdatePrescriptionTemplateDetailsAsync(int id, PrescriptionTemplateDetails prescriptionTemplateDetails);
        Task<PrescriptionTemplateDetails> CreatePrescriptionTemplateDetailsAsync(PrescriptionTemplateDetails prescriptionTemplateDetails);
        Task DeletePrescriptionTemplateDetailsAsync(int id);
        Task<bool> PrescriptionTemplateDetailsExistsAsync(int id);
    }
} 