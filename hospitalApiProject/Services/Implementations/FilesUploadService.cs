using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class FilesUploadService : ServiceBase<FilesUpload>, IFilesUploadService
    {
        public FilesUploadService(FlorenceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<FilesUpload>> GetAllFilesUploadsAsync()
        {
            return await GetAllAsync();
        }

        public async Task<FilesUpload> GetFilesUploadByIdAsync(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<FilesUpload>> GetFilesUploadByAppointmentIdAsync(int appointmentId)
        {
            return await _context.FilesUploads
                .Where(f => f.AppointmentId == appointmentId)
                .ToListAsync();
        }

        public async Task<FilesUpload> UpdateFilesUploadAsync(int id, FilesUpload filesUpload)
        {
            return await UpdateAsync(id, filesUpload);
        }

        public async Task<FilesUpload> CreateFilesUploadAsync(FilesUpload filesUpload)
        {
            return await CreateAsync(filesUpload);
        }

        public async Task DeleteFilesUploadAsync(int id)
        {
            await DeleteAsync(id);
        }

        public async Task<bool> FilesUploadExistsAsync(int id)
        {
            return await ExistsAsync(id);
        }

        protected override int GetEntityId(FilesUpload entity)
        {
            return entity.FilesUploadId;
        }
    }
} 