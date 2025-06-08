using hospitalApiProject.Models;
using hospitalApiProject.Services.Base;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class MedicineMasterService : EntityServiceBase<MedicineMaster>, IMedicineMasterService
    {
        public MedicineMasterService(FlorenceDbContext context) : base(context)
        {
        }

        protected override int GetEntityId(MedicineMaster entity)
        {
            return entity.MedicineId;
        }

        public async Task<IEnumerable<MedicineMaster>> GetAllMedicineMastersAsync()
        {
            return await GetAllAsync();
        }

        public async Task<MedicineMaster> GetMedicineMasterByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<bool> SearchMedicineAsync(string medName)
        {
            return await _context.MedicineMasters
                .AnyAsync(m => m.MedicineName.Contains(medName));
        }

        public async Task<IEnumerable<MedicineMaster>> SearchAllMedicineMatchWithNameAsync(string medName)
        {
            return await _context.MedicineMasters
                .Where(m => m.MedicineName.Contains(medName))
                .ToListAsync();
        }

        public async Task<MedicineMaster> UpdateMedicineMasterAsync(int id, MedicineMaster medicineMaster)
        {
            return await UpdateAsync(id, medicineMaster);
        }

        public async Task<MedicineMaster> CreateMedicineMasterAsync(MedicineMaster medicineMaster)
        {
            return await CreateAsync(medicineMaster);
        }

        public async Task DeleteMedicineMasterAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> MedicineMasterExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }
    }
} 