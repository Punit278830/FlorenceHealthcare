using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class MedicationGroupController : Controller
  {
    private readonly FlorenceDbContext _context;

    public MedicationGroupController(FlorenceDbContext context)
    {
      _context = context;
    }

    // GET: api/MedicationGroup
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicationGroup>>> GetMedicationGroups()
    {
      return await _context.MedicationGroups.ToListAsync();
    }

    // GET: api/MedicationGroup/5
    [HttpGet("{id}")]
    public async Task<ActionResult<List<MedicationGroup>>> GetMedicationGroup(int id)
    {
      var medicationGroup = await _context.MedicationGroups.Where(e => e.GroupId == id).ToListAsync();

      if (medicationGroup == null)
      {
        return NotFound();
      }

      return medicationGroup;
    }

    // PUT: api/PatientMedications/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMedicationGroup(int id, MedicationGroup medicationGroup)
    {
      if (id != medicationGroup.Id)
      {
        return BadRequest();
      }

      _context.Entry(medicationGroup).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!PatientMedicationExists(id))
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

    // POST: api/MedicationGroup
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<MedicationGroup>> PostMedicationGroups(List<MedicationGroup> medicationGroups)
    {
      try
      {
        if (medicationGroups.Count > 0)
        {
          foreach (var patientMedication in medicationGroups)
            _context.MedicationGroups.Add(patientMedication);
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(PostMedicationGroups), medicationGroups);
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    // DELETE: api/PatientMedications/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicationGroup(int id)
    {
      var medicationGroup = await _context.MedicationGroups.FindAsync(id);
      if (medicationGroup == null)
      {
        return NotFound();
      }

      _context.MedicationGroups.Remove(medicationGroup);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool PatientMedicationExists(int id)
    {
      return _context.MedicationGroups.Any(e => e.Id == id);
    }

  }
}
