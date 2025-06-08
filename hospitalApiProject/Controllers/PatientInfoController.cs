using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientInfoController : ControllerBase
    {
        private readonly IPatientInfoService _patientInfoService;

        public PatientInfoController(IPatientInfoService patientInfoService)
        {
            _patientInfoService = patientInfoService;
        }

        // GET: api/PatientInfo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientInfo>>> GetPatientInfos()
        {
            var patientInfos = await _patientInfoService.GetAllPatientInfosAsync();
            return Ok(patientInfos);
        }

        // GET: api/PatientInfo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientInfo>> GetPatientInfo(int id)
        {
            var patientInfo = await _patientInfoService.GetPatientInfoByIdAsync(id);

            if (patientInfo == null)
            {
                return NotFound();
            }

            return patientInfo;
        }

        // PUT: api/PatientInfo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatientInfo(int id, PatientInfo patientInfo)
        {
            try
            {
                await _patientInfoService.UpdatePatientInfoAsync(id, patientInfo);
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

        // POST: api/PatientInfo
        [HttpPost]
        public async Task<ActionResult<PatientInfo>> PostPatientInfo(PatientInfo patientInfo)
        {
            var createdPatientInfo = await _patientInfoService.CreatePatientInfoAsync(patientInfo);
            return CreatedAtAction("GetPatientInfo", new { id = createdPatientInfo.PatientId }, createdPatientInfo);
        }

        // DELETE: api/PatientInfo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatientInfo(int id)
        {
            try
            {
                await _patientInfoService.DeletePatientInfoAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 