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
        public async Task<ActionResult<IEnumerable<PrescriptionTemplateDetail>>> GetPrescriptionTemplateDetails()
        {
            var prescriptionTemplateDetails = await _prescriptionTemplateDetailsService.GetAllPrescriptionTemplateDetailsAsync();
            return Ok(prescriptionTemplateDetails);
        }

        // GET: api/PrescriptionTemplateDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionTemplateDetail>> GetPrescriptionTemplateDetails(int id)
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
        public async Task<ActionResult<IEnumerable<PrescriptionTemplateDetail>>> GetPrescriptionTemplateDetailsByTemplateId(int templateId)
        {
            var prescriptionTemplateDetails = await _prescriptionTemplateDetailsService.GetPrescriptionTemplateDetailsByTemplateIdAsync(templateId);
            return Ok(prescriptionTemplateDetails);
        }

        // PUT: api/PrescriptionTemplateDetails/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrescriptionTemplateDetails(int id, PrescriptionTemplateDetail prescriptionTemplateDetail)
        {
            try
            {
                await _prescriptionTemplateDetailsService.UpdatePrescriptionTemplateDetailsAsync(id, prescriptionTemplateDetail);
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
        public async Task<ActionResult<PrescriptionTemplateDetail>> PostPrescriptionTemplateDetails(PrescriptionTemplateDetail prescriptionTemplateDetail)
        {
            var createdPrescriptionTemplateDetails = await _prescriptionTemplateDetailsService.CreatePrescriptionTemplateDetailsAsync(prescriptionTemplateDetail);
            return CreatedAtAction("GetPrescriptionTemplateDetails", new { id = createdPrescriptionTemplateDetails.PrescriptionTemplateDetailId }, createdPrescriptionTemplateDetails);
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