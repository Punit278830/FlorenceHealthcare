using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IFilesUploadService
    {
        Task<IEnumerable<FilesUpload>> GetAllFilesUploadsAsync();
        Task<FilesUpload> GetFilesUploadByIdAsync(int id);
        Task<List<FilesUpload>> GetFilesUploadByAppointmentIdAsync(int appointmentId);
        Task<FilesUpload> UpdateFilesUploadAsync(int id, FilesUpload filesUpload);
        Task<FilesUpload> CreateFilesUploadAsync(FilesUpload filesUpload);
        Task DeleteFilesUploadAsync(int id);
        Task<bool> FilesUploadExistsAsync(int id);
    }
} 