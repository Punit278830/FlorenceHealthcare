using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IPrescriptionTemplateMasterService: ISimpleServiceBase
    {
        Task<IEnumerable<PrescriptionTemplateMaster>> GetAllPrescriptionTemplateMastersAsync();
        Task<PrescriptionTemplateMaster> GetPrescriptionTemplateMasterByIdAsync(int id);
        Task<PrescriptionTemplateMaster> UpdatePrescriptionTemplateMasterAsync(int id, PrescriptionTemplateMaster prescriptionTemplateMaster);
        Task<PrescriptionTemplateMaster> CreatePrescriptionTemplateMasterAsync(PrescriptionTemplateMaster prescriptionTemplateMaster);
        Task DeletePrescriptionTemplateMasterAsync(int id);
        Task<bool> PrescriptionTemplateMasterExistsAsync(int id);
    }
} 