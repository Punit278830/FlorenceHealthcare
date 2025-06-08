using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionTemplateMasterController : ControllerBase
    {
        private readonly IPrescriptionTemplateMasterService _prescriptionTemplateMasterService;

        public PrescriptionTemplateMasterController(IPrescriptionTemplateMasterService prescriptionTemplateMasterService)
        {
            _prescriptionTemplateMasterService = prescriptionTemplateMasterService;
        }

        // GET: api/PrescriptionTemplateMaster
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptionTemplateMaster>>> GetPrescriptionTemplateMasters()
        {
            var prescriptionTemplateMasters = await _prescriptionTemplateMasterService.GetAllPrescriptionTemplateMastersAsync();
            return Ok(prescriptionTemplateMasters);
        }

        // GET: api/PrescriptionTemplateMaster/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionTemplateMaster>> GetPrescriptionTemplateMaster(int id)
        {
            var prescriptionTemplateMaster = await _prescriptionTemplateMasterService.GetPrescriptionTemplateMasterByIdAsync(id);

            if (prescriptionTemplateMaster == null)
            {
                return NotFound();
            }

            return prescriptionTemplateMaster;
        }

        // PUT: api/PrescriptionTemplateMaster/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrescriptionTemplateMaster(int id, PrescriptionTemplateMaster prescriptionTemplateMaster)
        {
            try
            {
                await _prescriptionTemplateMasterService.UpdatePrescriptionTemplateMasterAsync(id, prescriptionTemplateMaster);
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

        // POST: api/PrescriptionTemplateMaster
        [HttpPost]
        public async Task<ActionResult<PrescriptionTemplateMaster>> PostPrescriptionTemplateMaster(PrescriptionTemplateMaster prescriptionTemplateMaster)
        {
            var createdPrescriptionTemplateMaster = await _prescriptionTemplateMasterService.CreatePrescriptionTemplateMasterAsync(prescriptionTemplateMaster);
            return CreatedAtAction("GetPrescriptionTemplateMaster", new { id = createdPrescriptionTemplateMaster.PrescriptionTemplateId }, createdPrescriptionTemplateMaster);
        }

        // DELETE: api/PrescriptionTemplateMaster/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrescriptionTemplateMaster(int id)
        {
            try
            {
                await _prescriptionTemplateMasterService.DeletePrescriptionTemplateMasterAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
