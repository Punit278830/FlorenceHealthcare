using hospitalApiProject.Models;
using Services.Interfaces;
using Repositories.Interfaces;

namespace Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PatientService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            return await _unitOfWork.PatientRepository.GetPatientsWithAppointmentsAsync();
        }

        public async Task<Patient?> GetPatientByIdAsync(int id)
        {
            return await _unitOfWork.PatientRepository.GetPatientWithDetailsAsync(id);
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            var result = await _unitOfWork.PatientRepository.Insert(patient);
            _unitOfWork.SaveChanges();
            return result;
        }

        public async Task<Patient> UpdatePatientAsync(Patient patient)
        {
            var result = await _unitOfWork.PatientRepository.UpdateAsync(patient);
            _unitOfWork.SaveChanges();
            return result;
        }

        public async Task DeletePatientAsync(int id)
        {
            var patient = await _unitOfWork.PatientRepository.GetByID(id);
            if (patient != null)
            {
                _unitOfWork.PatientRepository.Update(patient);
                _unitOfWork.SaveChanges();
            }
        }

        public async Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm)
        {
            return await _unitOfWork.PatientRepository.SearchPatientsAsync(searchTerm);
        }
    }
} 