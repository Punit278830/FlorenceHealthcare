using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PrescriptionTemplateMasterController : ControllerBase
  {
    private readonly FlorenceDbContext _context;

    public PrescriptionTemplateMasterController(FlorenceDbContext context)
    {
      _context = context;
    }

    // GET: api/PrescriptionTemplateMaster
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PrescriptionTemplateMaster>>> GetAllPrescriptionTemplates()
    {
      return await _context.PrescriptionTemplateMaster.ToListAsync();
    }

    // GET: api/PrescriptionTemplateMaster/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PrescriptionTemplateMaster>> GetPrescriptionTemplate(int id)
    {
      var prescriptionTemplateMaster = await _context.PrescriptionTemplateMaster.FindAsync(id);

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

      var existingTemplate = await _context.PrescriptionTemplateMaster
          .FirstOrDefaultAsync(pt => pt.TemplateName == prescriptionTemplateMaster.TemplateName && pt.Id != id);

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
      // Check if a template with the same name already exists
      var existingTemplate = await _context.PrescriptionTemplateMaster
          .FirstOrDefaultAsync(pt => pt.TemplateName == prescriptionTemplateMaster.TemplateName);

      if (existingTemplate != null)
      {
        // Return a 409 Conflict response if the template name already exists
        return Conflict(new { message = "A template with this name already exists." });
      }

      // If no duplicate is found, save the new template
      _context.PrescriptionTemplateMaster.Add(prescriptionTemplateMaster);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetAllPrescriptionTemplates", new { id = prescriptionTemplateMaster.Id }, prescriptionTemplateMaster);
    }


    // DELETE: api/PrescriptionTemplateMaster/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePrescriptionTemplate(int id)
    {
      var prescriptionTemplate = await _context.PrescriptionTemplateMaster.FindAsync(id);
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
