using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        // GET: api/Patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        // GET: api/Patient/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        // PUT: api/Patient/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Patient>> UpdatePatient(int id, PatientInfo patientInfo)
        {
            var patient = new Patient
            {
                PatientId = id,
                FirstName = patientInfo.FirstName,
                LastName = patientInfo.LastName,
                Email = patientInfo.Email,
                Phone = patientInfo.PhoneNumber,
                DateOfBirth = patientInfo.DateOfBirth,
                Gender = patientInfo.Gender,
                Address = patientInfo.Address
            };

            await _patientService.UpdateAsync(patient);
            return Ok(patient);
        }

        // POST: api/Patient
        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient(PatientInfo patientInfo)
        {
            var patient = new Patient
            {
                FirstName = patientInfo.FirstName,
                LastName = patientInfo.LastName,
                Email = patientInfo.Email,
                Phone = patientInfo.PhoneNumber,
                DateOfBirth = patientInfo.DateOfBirth,
                Gender = patientInfo.Gender,
                Address = patientInfo.Address,
                RegistrationDate = DateTime.Now
            };

            await _patientService.AddAsync(patient);
            return Ok(patient);
        }

        // DELETE: api/Patient/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            try
            {
                await _patientService.DeletePatientAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 