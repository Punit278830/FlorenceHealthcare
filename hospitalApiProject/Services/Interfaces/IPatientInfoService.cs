using hospitalApiProject.Models;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Interfaces
{
  public interface IPatientInfoService
  {
    Task<IEnumerable<PatientInfo>> GetAllPatientInfosAsync();
    Task<PatientInfo> GetPatientInfoByIdAsync(int id);
    Task<PatientInfo> UpdatePatientInfoAsync(int id, PatientInfo patientInfo);
    Task<PatientInfo> CreatePatientInfoAsync(PatientInfo patientInfo);
    Task DeletePatientInfoAsync(int id);
    Task<bool> PatientInfoExistsAsync(int id);
    Task AddPatient(PatientInfo patientInfo);
  }
}
