using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiagnosisController : ControllerBase
    {
        private readonly IDiagnosisService _diagnosisService;

        public DiagnosisController(IDiagnosisService diagnosisService)
        {
            _diagnosisService = diagnosisService;
        }

        // GET: api/Diagnosis
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Diagnosis>>> GetDiagnoses()
        {
            var diagnoses = await _diagnosisService.GetAllDiagnosesAsync();
            return Ok(diagnoses);
        }

        // GET: api/Diagnosis/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Diagnosis>> GetDiagnosis(int id)
        {
            var diagnosis = await _diagnosisService.GetDiagnosisByIdAsync(id);

            if (diagnosis == null)
            {
                return NotFound();
            }

            return diagnosis;
        }

        // GET: api/Diagnosis/patient/5
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Diagnosis>>> GetDiagnosesByPatientId(int patientId)
        {
            var diagnoses = await _diagnosisService.GetDiagnosesByPatientIdAsync(patientId);
            return Ok(diagnoses);
        }

        // PUT: api/Diagnosis/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiagnosis(int id, Diagnosis diagnosis)
        {
            try
            {
                await _diagnosisService.UpdateDiagnosisAsync(id, diagnosis);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // POST: api/Diagnosis
        [HttpPost]
        public async Task<ActionResult<Diagnosis>> PostDiagnosis(Diagnosis diagnosis)
        {
            var createdDiagnosis = await _diagnosisService.CreateDiagnosisAsync(diagnosis);
            return CreatedAtAction(nameof(GetDiagnosis), new { id = createdDiagnosis.DiagnosisId }, createdDiagnosis);
        }

        // DELETE: api/Diagnosis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiagnosis(int id)
        {
            try
            {
                await _diagnosisService.DeleteDiagnosisAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 