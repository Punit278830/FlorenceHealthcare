using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class MedicationGroupController : WithHospitalController
  {
    public MedicationGroupController(FlorenceDbContext context) : base(context)
    {
    }

    // GET: api/MedicationGroup
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicationGroup>>> GetMedicationGroups()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.MedicationGroups.AsQueryable();
      if (hospitalId != null)
      {
        query = query.Where(m => m.HospitalId == hospitalId);
      }
      return await query.ToListAsync();
    }

    // GET: api/MedicationGroup/5
    [HttpGet("{id}")]
    public async Task<ActionResult<List<MedicationGroup>>> GetMedicationGroup(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var medicationGroup = await _context.MedicationGroups.Where(e => e.GroupId == id && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();

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

      var hospitalId = GetHospitalIdFromHeader();
      if (hospitalId != null) medicationGroup.HospitalId = hospitalId;

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
        var hospitalId = GetHospitalIdFromHeader();
        if (medicationGroups.Count > 0)
        {
          foreach (var patientMedication in medicationGroups)
          {
            patientMedication.HospitalId = hospitalId;
            _context.MedicationGroups.Add(patientMedication);
          }
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(PostMedicationGroups), medicationGroups);
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    [Route("replace")]
    [HttpPost]
    public async Task<ActionResult<MedicationGroup>> ReplaceMedicationGroups(List<MedicationGroup> medicationGroups)
    {
      try
      {
        if (medicationGroups == null || medicationGroups.Count == 0)
        {
          return BadRequest("Medication groups cannot be empty.");
        }

        var hospitalId = GetHospitalIdFromHeader();

        // Get distinct GroupIds from the incoming list
        var groupIds = medicationGroups.Select(m => m.GroupId).Distinct().ToList();

        // Delete existing records matching these GroupIds
        var existingGroups = _context.MedicationGroups
            .Where(m => groupIds.Contains(m.GroupId) && (hospitalId == null || m.HospitalId == hospitalId));

        _context.MedicationGroups.RemoveRange(existingGroups);

        // Add new medication groups and tag hospital
        foreach (var mg in medicationGroups)
        {
          mg.HospitalId = hospitalId;
        }
        _context.MedicationGroups.AddRange(medicationGroups);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(PostMedicationGroups), medicationGroups);
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal Server Error: {ex.Message}");
      }
    }


    // DELETE: api/PatientMedications/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicationGroup(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var medicationGroup = await _context.MedicationGroups.FirstOrDefaultAsync(m => m.Id == id && (hospitalId == null || m.HospitalId == hospitalId));
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
