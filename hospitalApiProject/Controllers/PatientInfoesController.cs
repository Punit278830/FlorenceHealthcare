using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientInfoesController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientInfoesController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        // GET: api/PatientInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientInfo>>> GetPatientInfos()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        // GET: api/PatientInfoes/date-range
        [HttpGet("date-range")]
        public async Task<ActionResult<PatientInfo[]>> GetPatientInfosByDateRange([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            var patients = await _patientService.GetPatientsByDateRangeAsync(startDate, endDate);
            return Ok(patients);
        }

        // GET: api/PatientInfoes/gender-count
        [HttpGet("gender-count")]
        public async Task<ActionResult<object>> GetPatientCountByGender()
        {
            var genderCount = await _patientService.GetPatientCountByGenderAsync();
            return Ok(genderCount);
        }

        // GET: api/PatientInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientInfo>> GetPatientInfo(int id)
        {
            var patientInfo = await _patientService.GetPatientByIdAsync(id);

            if (patientInfo == null)
            {
                return NotFound();
            }

            return patientInfo;
        }

        // GET: api/PatientInfoes/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PatientInfo>>> SearchPatients([FromQuery] string searchTerm)
        {
            var patients = await _patientService.SearchPatientsAsync(searchTerm);
            return Ok(patients);
        }

        // PUT: api/PatientInfoes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatientInfo(int id, PatientInfo patientInfo)
        {
            try
            {
                await _patientService.UpdatePatientAsync(id, patientInfo);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
        }

        // POST: api/PatientInfoes
        [HttpPost]
        public async Task<ActionResult<PatientInfo>> PostPatientInfo(PatientInfo patientInfo)
        {
            try
            {
                var createdPatient = await _patientService.CreatePatientAsync(patientInfo);
                return CreatedAtAction("GetPatientInfo", new { id = createdPatient.PatientId }, createdPatient);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/PatientInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatientInfo(int id)
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
