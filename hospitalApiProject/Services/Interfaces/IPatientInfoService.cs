using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Interfaces
{
  public interface IPatientInfoService: ISimpleServiceBase
  {
    Task<IEnumerable<PatientInfo>> GetAllPatientInfosAsync();
    Task<PatientInfo> GetPatientInfoByIdAsync(int id);
    Task<PatientInfo> UpdatePatientInfoAsync(int id, PatientInfo patientInfo);
    Task<PatientInfo> CreatePatientInfoAsync(PatientInfo patientInfo);
    Task DeletePatientInfoAsync(int id);
    Task<bool> PatientInfoExistsAsync(int id);
    Task AddPatient(PatientInfo patientInfo);
    new string ErrorMessage { get; set; }
    new bool HasError { get; }
  }
}
