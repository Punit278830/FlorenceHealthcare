using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class MedicineMasterService : ServiceBase<MedicineMaster>, IMedicineMasterService
    {
        private new readonly FlorenceDbContext _context;

        public MedicineMasterService(FlorenceDbContext context) : base(context)
        {
            _context = context;
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
            if (string.IsNullOrEmpty(medName))
            {
                throw new ArgumentException("Medicine name cannot be empty");
            }
            return await _context.MedicineMasters.AnyAsync(e => e.MedName == medName);
        }

        public async Task<IEnumerable<MedicineMaster>> SearchAllMedicineMatchWithNameAsync(string medName)
        {
            if (string.IsNullOrEmpty(medName))
            {
                throw new ArgumentException("Medicine name cannot be empty");
            }
            return await _context.MedicineMasters.Where(e => EF.Functions.Like(e.MedicineName, $"%{medName}%")).ToListAsync();
        }

        public async Task<MedicineMaster> UpdateMedicineMasterAsync(int id, MedicineMaster medicine)
        {
            return await UpdateAsync(id, medicine);
        }

        public async Task<MedicineMaster> CreateMedicineMasterAsync(MedicineMaster medicine)
        {
            return await CreateAsync(medicine);
        }

        public async Task DeleteMedicineMasterAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> MedicineMasterExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(MedicineMaster entity)
        {
            return entity.MedId;
        }
    }
} 