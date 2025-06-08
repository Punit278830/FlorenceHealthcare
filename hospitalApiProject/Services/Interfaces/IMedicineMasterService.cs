using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IMedicineMasterService: ISimpleServiceBase
    {
        Task<IEnumerable<MedicineMaster>> GetAllMedicineMastersAsync();
        Task<MedicineMaster> GetMedicineMasterByIdAsync(int id);
        Task<bool> SearchMedicineAsync(string medName);
        Task<IEnumerable<MedicineMaster>> SearchAllMedicineMatchWithNameAsync(string medName);
        Task<MedicineMaster> UpdateMedicineMasterAsync(int id, MedicineMaster medicineMaster);
        Task<MedicineMaster> CreateMedicineMasterAsync(MedicineMaster medicineMaster);
        Task DeleteMedicineMasterAsync(int id);
        Task<bool> MedicineMasterExistsAsync(int id);
    }
} 