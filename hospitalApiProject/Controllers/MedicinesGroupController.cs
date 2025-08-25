using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class MedicinesGroupController : WithHospitalController
  {

    public MedicinesGroupController(FlorenceDbContext context) : base(context)
    {
    }

    // GET: api/MedicinesGroup
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicinesGroup>>> GetMedicinesGroup()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.MedicinesGroups.AsQueryable();
      if (hospitalId != null)
      {
        query = query.Where(m => m.HospitalId == hospitalId);
      }
      return await query.OrderByDescending(x => x.Id).ToListAsync();
    }

    // GET: api/MedicinesGroup/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MedicinesGroup>> GetMedicinesGroup(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var medicinesGroup = await _context.MedicinesGroups.FirstOrDefaultAsync(m => m.Id == id && (hospitalId == null || m.HospitalId == hospitalId));

      if (medicinesGroup == null)
      {
        return NotFound();
      }

      return medicinesGroup;
    }

    // PUT: api/MedicinesGroup/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMedicinesGroup(int id, MedicinesGroup medicinesGroup)
    {
      if (id != medicinesGroup.Id)
      {
        return BadRequest();
      }

      var hospitalId = GetHospitalIdFromHeader();
      if (hospitalId != null) medicinesGroup.HospitalId = hospitalId;

      _context.Entry(medicinesGroup).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!MedicinesGroupExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // POST: api/MedicinesGroup
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<MedicinesGroup>> PostMedicinesGroup(MedicinesGroup medicinesGroup)
    {
      var hospitalId = GetHospitalIdFromHeader();
      medicinesGroup.HospitalId = hospitalId;
      _context.MedicinesGroups.Add(medicinesGroup);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetMedicinesGroup", new { id = medicinesGroup.Id }, medicinesGroup);
    }

    // DELETE: api/MedicinesGroup/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicinesGroup(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var medicinesGroup = await _context.MedicinesGroups.FirstOrDefaultAsync(m => m.Id == id && (hospitalId == null || m.HospitalId == hospitalId));
      if (medicinesGroup == null)
      {
        return NotFound();
      }

      _context.MedicinesGroups.Remove(medicinesGroup);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool MedicinesGroupExists(int id)
    {
      return _context.MedicinesGroups.Any(e => e.Id == id);
    }


  }
}
