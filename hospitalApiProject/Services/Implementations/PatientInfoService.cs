using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Base;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
  public class PatientInfoService : EntityServiceBase<PatientInfo>, IPatientInfoService
  {
    public PatientInfoService(FlorenceDbContext context) : base(context)
    {
    }

    public async Task AddPatient(PatientInfo patientInfo)
    {
      await CreateAsync(patientInfo);
    }

    public async Task<IEnumerable<PatientInfo>> GetAllPatientInfosAsync()
    {
      return await GetAllAsync();
    }

    public async Task<PatientInfo> GetPatientInfoByIdAsync(int id)
    {
      return await GetByIdAsync(id);
    }

    public async Task<PatientInfo> UpdatePatientInfoAsync(int id, PatientInfo patientInfo)
    {
      return await UpdateAsync(id, patientInfo);
    }

    public async Task<PatientInfo> CreatePatientInfoAsync(PatientInfo patientInfo)
    {
      return await CreateAsync(patientInfo);
    }

    public async Task DeletePatientInfoAsync(int id)
    {
      await DeleteAsync(id);
    }

    public async Task<bool> PatientInfoExistsAsync(int id)
    {
      return await ExistsAsync(id);
    }

    protected override int GetEntityId(PatientInfo entity)
    {
      return entity.PatientId;
    }
  }
}
