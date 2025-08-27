using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class HospitalsController : ControllerBase
  {
    private readonly FlorenceDbContext _context;

    public HospitalsController(FlorenceDbContext context)
    {
      _context = context;
    }

    // GET: api/Hospitals
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Hospital>>> GetHospitals()
    {
      try
      {
        var hospitals = await _context.Hospitals.OrderBy(h => h.Name).ToListAsync();
        return Ok(hospitals);
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }

    // GET: api/Hospitals/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Hospital>> GetHospital(int id)
    {
      var hospital = await _context.Hospitals.FindAsync(id);
      if (hospital == null) return NotFound();
      return Ok(hospital);
    }

    // POST: api/Hospitals
    [HttpPost]
    public async Task<ActionResult<Hospital>> CreateHospital(Hospital hospital)
    {
      // Minimal validation to keep compatibility
      if (string.IsNullOrWhiteSpace(hospital.Name))
      {
        return BadRequest("Hospital name is required");
      }

      _context.Hospitals.Add(hospital);
      await _context.SaveChangesAsync();
      return CreatedAtAction(nameof(GetHospital), new { id = hospital.HospitalId }, hospital);
    }

    // PUT: api/Hospitals/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHospital(int id, Hospital hospital)
    {
      if (id != hospital.HospitalId) return BadRequest();
      _context.Entry(hospital).State = EntityState.Modified;
      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!_context.Hospitals.Any(h => h.HospitalId == id)) return NotFound();
        throw;
      }
      return NoContent();
    }

    // DELETE: api/Hospitals/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHospital(int id)
    {
      var hospital = await _context.Hospitals.FindAsync(id);
      if (hospital == null) return NotFound();
      _context.Hospitals.Remove(hospital);
      await _context.SaveChangesAsync();
      return NoContent();
    }
  }
}
