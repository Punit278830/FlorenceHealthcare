using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinesGroupController : ControllerBase
    {
        private readonly IMedicinesGroupService _medicinesGroupService;

        public MedicinesGroupController(IMedicinesGroupService medicinesGroupService)
        {
            _medicinesGroupService = medicinesGroupService;
        }

        // GET: api/MedicinesGroup
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicinesGroup>>> GetMedicinesGroup()
        {
            var medicinesGroups = await _medicinesGroupService.GetAllMedicinesGroupsAsync();
            return Ok(medicinesGroups);
        }

        // GET: api/MedicinesGroup/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicinesGroup>> GetMedicinesGroup(int id)
        {
            var medicinesGroup = await _medicinesGroupService.GetMedicinesGroupByIdAsync(id);

            if (medicinesGroup == null)
            {
                return NotFound();
            }

            return medicinesGroup;
        }

        // PUT: api/MedicinesGroup/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicinesGroup(int id, MedicinesGroup medicinesGroup)
        {
            try
            {
                await _medicinesGroupService.UpdateMedicinesGroupAsync(id, medicinesGroup);
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

        // POST: api/MedicinesGroup
        [HttpPost]
        public async Task<ActionResult<MedicinesGroup>> PostMedicinesGroup(MedicinesGroup medicinesGroup)
        {
            var createdMedicinesGroup = await _medicinesGroupService.CreateMedicinesGroupAsync(medicinesGroup);
            return CreatedAtAction("GetMedicinesGroup", new { id = createdMedicinesGroup.Id }, createdMedicinesGroup);
        }

        // DELETE: api/MedicinesGroup/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicinesGroup(int id)
        {
            try
            {
                await _medicinesGroupService.DeleteMedicinesGroupAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
