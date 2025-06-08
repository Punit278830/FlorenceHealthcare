using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPrescriptionTemplateDetailsService: ISimpleServiceBase
    {
        Task<IEnumerable<PrescriptionTemplateDetail>> GetAllPrescriptionTemplateDetailsAsync();
        Task<PrescriptionTemplateDetail> GetPrescriptionTemplateDetailsByIdAsync(int id);
        Task<IEnumerable<PrescriptionTemplateDetail>> GetPrescriptionTemplateDetailsByTemplateIdAsync(int templateId);
        Task<PrescriptionTemplateDetail> UpdatePrescriptionTemplateDetailsAsync(int id, PrescriptionTemplateDetail prescriptionTemplateDetail);
        Task<PrescriptionTemplateDetail> CreatePrescriptionTemplateDetailsAsync(PrescriptionTemplateDetail prescriptionTemplateDetail);
        Task DeletePrescriptionTemplateDetailsAsync(int id);
        Task<bool> PrescriptionTemplateDetailsExistsAsync(int id);
    }
} 