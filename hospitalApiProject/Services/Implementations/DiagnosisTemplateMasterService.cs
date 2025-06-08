using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class DiagnosisTemplateMasterService : IDiagnosisTemplateMasterService
    {
        private readonly FlorenceDbContext _context;

        public DiagnosisTemplateMasterService(FlorenceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DiagnosisTemplateMaster>> GetAllDiagnosisTemplateMastersAsync()
        {
            return await _context.DiagnosisTemplateMasters.ToListAsync();
        }

        public async Task<DiagnosisTemplateMaster> GetDiagnosisTemplateMasterByIdAsync(int id)
        {
            return await _context.DiagnosisTemplateMasters.FindAsync(id);
        }

        public async Task<DiagnosisTemplateMaster> UpdateDiagnosisTemplateMasterAsync(int id, DiagnosisTemplateMaster diagnosisTemplateMaster)
        {
            if (id != diagnosisTemplateMaster.DiagnosisTemplateMasterId)
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(diagnosisTemplateMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return diagnosisTemplateMaster;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await DiagnosisTemplateMasterExistsAsync(id))
                {
                    throw new KeyNotFoundException($"DiagnosisTemplateMaster with ID {id} not found");
                }
                throw;
            }
        }

        public async Task<DiagnosisTemplateMaster> CreateDiagnosisTemplateMasterAsync(DiagnosisTemplateMaster diagnosisTemplateMaster)
        {
            _context.DiagnosisTemplateMasters.Add(diagnosisTemplateMaster);
            await _context.SaveChangesAsync();
            return diagnosisTemplateMaster;
        }

        public async Task DeleteDiagnosisTemplateMasterAsync(int id)
        {
            var diagnosisTemplateMaster = await _context.DiagnosisTemplateMasters.FindAsync(id);
            if (diagnosisTemplateMaster == null)
            {
                throw new KeyNotFoundException($"DiagnosisTemplateMaster with ID {id} not found");
            }

            _context.DiagnosisTemplateMasters.Remove(diagnosisTemplateMaster);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DiagnosisTemplateMasterExistsAsync(int id)
        {
            return await _context.DiagnosisTemplateMasters.AnyAsync(e => e.DiagnosisTemplateMasterId == id);
        }
    }
} 