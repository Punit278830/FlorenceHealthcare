using System.Threading.Tasks;
using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Services
{
  public interface IPatientService
  {
    Task<PatientInfo> GetPatientById(int patientId);
  }
} 