using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineMastersController : ControllerBase
    {
        private readonly IMedicineMasterService _medicineMasterService;

        public MedicineMastersController(IMedicineMasterService medicineMasterService)
        {
            _medicineMasterService = medicineMasterService;
        }

        // GET: api/MedicineMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicineMaster>>> GetMedicineMasters()
        {
            var medicines = await _medicineMasterService.GetAllMedicineMastersAsync();
            return Ok(medicines);
        }

        // GET: api/MedicineMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicineMaster>> GetMedicineMaster(int id)
        {
            var medicineMaster = await _medicineMasterService.GetMedicineMasterByIdAsync(id);

            if (medicineMaster == null)
            {
                return NotFound();
            }

            return medicineMaster;
        }

        [HttpGet("medName/{medName}")]
        public async Task<ActionResult<bool>> SearchMedicine(string medName)
        {
            try
            {
                var medExists = await _medicineMasterService.SearchMedicineAsync(medName);
                return Ok(medExists);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("matchMedicineName/{medName}")]
        public async Task<ActionResult<IEnumerable<MedicineMaster>>> SearchAllMedicineMatchWithName(string medName)
        {
            try
            {
                var medicines = await _medicineMasterService.SearchAllMedicineMatchWithNameAsync(medName);
                return Ok(medicines);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/MedicineMasters/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicineMaster(int id, MedicineMaster medicineMaster)
        {
            try
            {
                await _medicineMasterService.UpdateMedicineMasterAsync(id, medicineMaster);
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

        // POST: api/MedicineMasters
        [HttpPost]
        public async Task<ActionResult<MedicineMaster>> PostMedicineMaster(MedicineMaster medicineMaster)
        {
            var createdMedicine = await _medicineMasterService.CreateMedicineMasterAsync(medicineMaster);
            return CreatedAtAction("GetMedicineMaster", new { id = createdMedicine.MedId }, createdMedicine);
        }

        // DELETE: api/MedicineMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicineMaster(int id)
        {
            try
            {
                await _medicineMasterService.DeleteMedicineMasterAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
