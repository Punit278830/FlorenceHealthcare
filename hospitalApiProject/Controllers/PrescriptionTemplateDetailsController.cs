using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionTemplateDetailsController : ControllerBase
    {
        private readonly IPrescriptionTemplateDetailsService _prescriptionTemplateDetailsService;

        public PrescriptionTemplateDetailsController(IPrescriptionTemplateDetailsService prescriptionTemplateDetailsService)
        {
            _prescriptionTemplateDetailsService = prescriptionTemplateDetailsService;
        }

        // GET: api/PrescriptionTemplateDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptionTemplateDetails>>> GetPrescriptionTemplateDetails()
        {
            var prescriptionTemplateDetails = await _prescriptionTemplateDetailsService.GetAllPrescriptionTemplateDetailsAsync();
            return Ok(prescriptionTemplateDetails);
        }

        // GET: api/PrescriptionTemplateDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionTemplateDetails>> GetPrescriptionTemplateDetails(int id)
        {
            var prescriptionTemplateDetails = await _prescriptionTemplateDetailsService.GetPrescriptionTemplateDetailsByIdAsync(id);

            if (prescriptionTemplateDetails == null)
            {
                return NotFound();
            }

            return prescriptionTemplateDetails;
        }

        // GET: api/PrescriptionTemplateDetails/template/5
        [HttpGet("template/{templateId}")]
        public async Task<ActionResult<IEnumerable<PrescriptionTemplateDetails>>> GetPrescriptionTemplateDetailsByTemplateId(int templateId)
        {
            var prescriptionTemplateDetails = await _prescriptionTemplateDetailsService.GetPrescriptionTemplateDetailsByTemplateIdAsync(templateId);
            return Ok(prescriptionTemplateDetails);
        }

        // PUT: api/PrescriptionTemplateDetails/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrescriptionTemplateDetails(int id, PrescriptionTemplateDetails prescriptionTemplateDetails)
        {
            try
            {
                await _prescriptionTemplateDetailsService.UpdatePrescriptionTemplateDetailsAsync(id, prescriptionTemplateDetails);
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

        // POST: api/PrescriptionTemplateDetails
        [HttpPost]
        public async Task<ActionResult<PrescriptionTemplateDetails>> PostPrescriptionTemplateDetails(PrescriptionTemplateDetails prescriptionTemplateDetails)
        {
            var createdPrescriptionTemplateDetails = await _prescriptionTemplateDetailsService.CreatePrescriptionTemplateDetailsAsync(prescriptionTemplateDetails);
            return CreatedAtAction("GetPrescriptionTemplateDetails", new { id = createdPrescriptionTemplateDetails.PrescriptionTemplateDetailsId }, createdPrescriptionTemplateDetails);
        }

        // DELETE: api/PrescriptionTemplateDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrescriptionTemplateDetails(int id)
        {
            try
            {
                await _prescriptionTemplateDetailsService.DeletePrescriptionTemplateDetailsAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 