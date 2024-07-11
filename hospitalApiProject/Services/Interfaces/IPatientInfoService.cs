using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces.Shared;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Interfaces
{
  public interface IPatientInfoService : ISimpleServiceBase
  {
    Task AddPatient(PatientInfo patientInfo);
  }
}
