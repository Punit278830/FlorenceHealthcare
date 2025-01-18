using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class MedicinesGroupController : ControllerBase
  {

    private readonly FlorenceDbContext _context;

    public MedicinesGroupController(FlorenceDbContext context)
    {
      _context = context;
    }

    // GET: api/MedicinesGroup
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicinesGroup>>> GetMedicinesGroup()
    {
      return await _context.MedicinesGroups.OrderByDescending(x => x.Id).ToListAsync();
    }

    // GET: api/MedicinesGroup/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MedicinesGroup>> GetMedicinesGroup(int id)
    {
      var medicinesGroup = await _context.MedicinesGroups.FindAsync(id);

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
      _context.MedicinesGroups.Add(medicinesGroup);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetMedicinesGroup", new { id = medicinesGroup.Id }, medicinesGroup);
    }

    // DELETE: api/MedicinesGroup/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicinesGroup(int id)
    {
      var medicinesGroup = await _context.MedicinesGroups.FindAsync(id);
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
