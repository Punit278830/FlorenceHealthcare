using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Interfaces
{
  public interface IPatientInfoService : ISimpleServiceBase
  {
    Task AddPatient(PatientInfo patientInfo);
  }
}
