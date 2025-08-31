using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PrescriptionTemplateMasterController : WithHospitalController
  {
    public PrescriptionTemplateMasterController(FlorenceDbContext context) : base(context)
    {
    }

    // GET: api/PrescriptionTemplateMaster
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PrescriptionTemplateMaster>>> GetAllPrescriptionTemplates()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.PrescriptionTemplateMaster.AsQueryable();
      if (hospitalId != null)
      {
        query = query.Where(p => p.HospitalId == hospitalId);
      }
      return await query.OrderBy(x => x.TemplateName).ToListAsync();
    }

    // GET: api/PrescriptionTemplateMaster/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PrescriptionTemplateMaster>> GetPrescriptionTemplate(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var prescriptionTemplateMaster = await _context.PrescriptionTemplateMaster.FirstOrDefaultAsync(p => p.Id == id && (hospitalId == null || p.HospitalId == hospitalId));

      if (prescriptionTemplateMaster == null)
      {
        return NotFound();
      }

      return prescriptionTemplateMaster;
    }

    // PUT: api/PrescriptionTemplateMaster/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPrescriptionTemplate(int id, PrescriptionTemplateMaster prescriptionTemplateMaster)
    {
      if (id != prescriptionTemplateMaster.Id)
      {
        return BadRequest();
      }

      var hospitalId = GetHospitalIdFromHeader();
      if (hospitalId != null) prescriptionTemplateMaster.HospitalId = hospitalId;

      var existingTemplate = await _context.PrescriptionTemplateMaster
          .FirstOrDefaultAsync(pt => pt.TemplateName == prescriptionTemplateMaster.TemplateName && pt.Id != id && (hospitalId == null || pt.HospitalId == hospitalId));

      if (existingTemplate != null)
      {
        return Conflict(new { message = "A template with this name already exists." });
      }

      _context.Entry(prescriptionTemplateMaster).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!PrescriptionTemplateExists(id))
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

    // POST: api/PrescriptionTemplate
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<PrescriptionTemplateMaster>> PostPrescriptionTemplate(PrescriptionTemplateMaster prescriptionTemplateMaster)
    {
      var hospitalId = GetHospitalIdFromHeader();

      // Check if a template with the same name already exists within hospital scope
      var existingTemplate = await _context.PrescriptionTemplateMaster
          .FirstOrDefaultAsync(pt => pt.TemplateName == prescriptionTemplateMaster.TemplateName && (hospitalId == null || pt.HospitalId == hospitalId));

      if (existingTemplate != null)
      {
        // Return a 409 Conflict response if the template name already exists
        return Conflict(new { message = "A template with this name already exists." });
      }

      // If no duplicate is found, save the new template and tag HospitalId
      prescriptionTemplateMaster.HospitalId = hospitalId;
      _context.PrescriptionTemplateMaster.Add(prescriptionTemplateMaster);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetAllPrescriptionTemplates", new { id = prescriptionTemplateMaster.Id }, prescriptionTemplateMaster);
    }


    // DELETE: api/PrescriptionTemplateMaster/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePrescriptionTemplate(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var prescriptionTemplate = await _context.PrescriptionTemplateMaster.FirstOrDefaultAsync(p => p.Id == id && (hospitalId == null || p.HospitalId == hospitalId));
      if (prescriptionTemplate == null)
      {
        return NotFound();
      }

      _context.PrescriptionTemplateMaster.Remove(prescriptionTemplate);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool PrescriptionTemplateExists(int id)
    {
      return _context.PrescriptionTemplateMaster.Any(e => e.Id == id);
    }
  }
}
