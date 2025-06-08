using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionDetailsController : ControllerBase
    {
        private readonly IPrescriptionDetailsService _prescriptionDetailsService;

        public PrescriptionDetailsController(IPrescriptionDetailsService prescriptionDetailsService)
        {
            _prescriptionDetailsService = prescriptionDetailsService;
        }

        // GET: api/PrescriptionDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptionDetail>>> GetPrescriptionDetails()
        {
            var prescriptionDetails = await _prescriptionDetailsService.GetAllPrescriptionDetailsAsync();
            return Ok(prescriptionDetails);
        }

        // GET: api/PrescriptionDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionDetail>> GetPrescriptionDetails(int id)
        {
            var prescriptionDetails = await _prescriptionDetailsService.GetPrescriptionDetailsByIdAsync(id);

            if (prescriptionDetails == null)
            {
                return NotFound();
            }

            return prescriptionDetails;
        }

        // GET: api/PrescriptionDetails/prescription/5
        [HttpGet("prescription/{prescriptionId}")]
        public async Task<ActionResult<IEnumerable<PrescriptionDetail>>> GetPrescriptionDetailsByPrescriptionId(int prescriptionId)
        {
            var prescriptionDetails = await _prescriptionDetailsService.GetPrescriptionDetailsByPrescriptionIdAsync(prescriptionId);
            return Ok(prescriptionDetails);
        }

        // PUT: api/PrescriptionDetails/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrescriptionDetails(int id, PrescriptionDetail prescriptionDetail)
        {
            try
            {
                await _prescriptionDetailsService.UpdatePrescriptionDetailsAsync(id, prescriptionDetail);
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

        // POST: api/PrescriptionDetails
        [HttpPost]
        public async Task<ActionResult<PrescriptionDetail>> PostPrescriptionDetails(PrescriptionDetail prescriptionDetail)
        {
            var createdPrescriptionDetails = await _prescriptionDetailsService.CreatePrescriptionDetailsAsync(prescriptionDetail);
            return CreatedAtAction("GetPrescriptionDetails", new { id = createdPrescriptionDetails.PrescriptionDetailId }, createdPrescriptionDetails);
        }

        // DELETE: api/PrescriptionDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrescriptionDetails(int id)
        {
            try
            {
                await _prescriptionDetailsService.DeletePrescriptionDetailsAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 