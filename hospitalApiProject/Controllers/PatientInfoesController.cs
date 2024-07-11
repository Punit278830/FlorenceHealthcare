using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PatientInfoesController : ControllerBase
  {
    private readonly FlorenceDbContext _context;
    private readonly IPatientInfoService _patientInfoService;

    public PatientInfoesController(FlorenceDbContext context, IPatientInfoService patientInfoService)
    {
      _context = context;
      _patientInfoService = patientInfoService;
    }

    // GET: api/PatientInfoes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientInfo>>> GetPatientInfos()
    {
      return await _context.PatientInfos.OrderByDescending(p => p.PatientId).ToListAsync();
    }

    [HttpGet("regestrationDateRange/{startDate}/{endDate}")]
    public async Task<ActionResult<PatientInfo[]>> GetPatientInfosByDateRange(DateOnly startDate, DateOnly endDate)
    {


      List<PatientInfo> patientData = await _context.PatientInfos
          .Where(e => e.RegstrationDate >= startDate && e.RegstrationDate <= endDate)
          .ToListAsync();


      if (patientData != null)
      {
        return Ok(patientData);
      }

      return NotFound();
    }

    // GET: api/PatientInfoes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PatientInfo>> GetPatientInfo(int id)
    {
      var patientInfo = await _context.PatientInfos.FindAsync(id);


      if (patientInfo == null)
      {
        return NotFound();
      }

      return patientInfo;
    }
    // GET: api/PatientInfoes/searchData
    [HttpGet("SearchData")]
    public async Task<IActionResult> SearchPatient(string data)
    {
      try
      {

        IQueryable<PatientInfo> query = _context.PatientInfos;
        if (!string.IsNullOrEmpty(data))
        {
          query = query.Where(e => EF.Functions.Like(e.Mobile, $"%{data}%"));
          List<PatientInfo> result = await query.ToListAsync();
          return Ok(result);
        }
        return NotFound();
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    // PUT: api/PatientInfoes/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPatientInfo(int id, PatientInfo patientInfo)
    {
      if (id != patientInfo.PatientId)
      {
        return BadRequest();
      }

      _context.Entry(patientInfo).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!PatientInfoExists(id))
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

    // POST: api/PatientInfoes
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<PatientInfo>> PostPatientInfo(PatientInfo patientInfo)
    {
      if (patientInfo == null)
      {
        return BadRequest("Invalid input request provided.");
      }
      // Check if a patient with the same IdentityNumber already exists
      await _patientInfoService.AddPatient(patientInfo);

      if (_patientInfoService.HasError)
      {
        // Return a conflict response if the IdentityNumber already exists
        if (_patientInfoService.ErrorMessage == "Identity Number already exists.")
        {
          return Conflict(new { message = _patientInfoService.ErrorMessage });
        }

        return StatusCode(500, new { message = _patientInfoService.ErrorMessage });
      }

      return CreatedAtAction("GetPatientInfo", new { id = patientInfo.PatientId }, patientInfo);
    }


    // DELETE: api/PatientInfoes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatientInfo(int id)
    {
      var patientInfo = await _context.PatientInfos.FindAsync(id);
      if (patientInfo == null)
      {
        return NotFound();
      }

      _context.PatientInfos.Remove(patientInfo);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool PatientInfoExists(int id)
    {
      return _context.PatientInfos.Any(e => e.PatientId == id);
    }


  }
}
