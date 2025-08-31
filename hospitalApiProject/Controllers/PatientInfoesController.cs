using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PatientInfoesController : WithHospitalController
  {
    private readonly IPatientInfoService _patientInfoService;

    public PatientInfoesController(FlorenceDbContext context, IPatientInfoService patientInfoService) : base(context)
    {
      _patientInfoService = patientInfoService;
    }

    // GET: api/PatientInfoes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientWithPaymentStatusDto>>> GetPatientInfos()
    {
        var hospitalId = GetHospitalIdFromHeader();

        var patientsQuery = _context.PatientInfos.AsQueryable();
        if (hospitalId != null)
        {
          patientsQuery = patientsQuery.Where(p => p.HospitalId == hospitalId);
        }
        var patients = await patientsQuery.OrderByDescending(p => p.PatientId).ToListAsync();

        var invoicesQuery = _context.InvoiceInfos.AsQueryable();
        if (hospitalId != null)
        {
          invoicesQuery = invoicesQuery.Where(i => i.HospitalId == hospitalId);
        }
        var invoices = await invoicesQuery.ToListAsync();

        var result = patients.Select(p => new PatientWithPaymentStatusDto
        {
            PatientId = p.PatientId,
            FirstName = p.FirstName,
            LastName = p.LastName,
            Mobile = p.Mobile,
            Email = p.Email,
            Address = p.Address,
            Gender = p.Gender,
            Dob = p.Dob,
            PatientImage = p.PatientImage,
            RegstrationDate = p.RegstrationDate,
            IdentityName = p.IdentityName,
            IdentityNumber = p.IdentityNumber,
            IsConsultationPaid = invoices.Any(i => i.PatientId == p.PatientId && i.IsConsultationPaid == true)
        }).ToList();

        return Ok(result);
    }

    [HttpGet("registrationDateRange/{startDate}/{endDate}")]
    public async Task<ActionResult<PatientInfo[]>> GetPatientInfosByDateRange(DateTime startDate, DateTime endDate)
    {
      var hospitalId = GetHospitalIdFromHeader();

      List<PatientInfo> patientData = await _context.PatientInfos
          .Where(e => e.RegstrationDate >= startDate && e.RegstrationDate <= endDate && (hospitalId == null || e.HospitalId == hospitalId))
          .ToListAsync();

      if (patientData != null)
      {
        return Ok(patientData);
      }

      return NotFound();
    }
    // GET: api/PatientInfoes/PatientCountByGender
    [HttpGet("PatientCountByGender")]
    public async Task<ActionResult<PatientInfo>> GetPatientCountByGender()
    {
      var hospitalId = GetHospitalIdFromHeader();

      var maleCount = await _context.PatientInfos
                                .Where(p => p.Gender == "male" && (hospitalId == null || p.HospitalId == hospitalId))
                                .CountAsync();
      var femaleCount = await _context.PatientInfos
                                       .Where(p => p.Gender == "female" && (hospitalId == null || p.HospitalId == hospitalId))
                                       .CountAsync();
      var transgenderCount = await _context.PatientInfos
                                            .Where(p => p.Gender == "transgender" && (hospitalId == null || p.HospitalId == hospitalId))
                                            .CountAsync();

      // Calculate total count
      var totalCount = maleCount + femaleCount + transgenderCount;

      // Calculate percentages 
      var malePercentage = totalCount > 0 ? (int)((maleCount / (double)totalCount) * 100) : 0;
      var femalePercentage = totalCount > 0 ? (int)((femaleCount / (double)totalCount) * 100) : 0;
      var transgenderPercentage = totalCount > 0 ? (int)((transgenderCount / (double)totalCount) * 100) : 0;

      var result = new
      {
        Male = malePercentage,
        Female= femalePercentage,
        Transgender = transgenderPercentage
      };

      return Ok(result);
    }

  


    //GET: api/PatientInfoes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PatientInfo>> GetPatientInfo(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var patientInfo = await _context.PatientInfos
                        .Where(p => p.PatientId == id && (hospitalId == null || p.HospitalId == hospitalId))
                        .FirstOrDefaultAsync();

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
        var hospitalId = GetHospitalIdFromHeader();
        IQueryable<PatientInfo> query = _context.PatientInfos;
        if (!string.IsNullOrEmpty(data))
        {
          query = query.Where(e => EF.Functions.Like(e.Mobile, $"%{data}%") && (hospitalId == null || e.HospitalId == hospitalId));
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

      // Tag with HospitalId if provided (nullable for backward compatibility)
      var hospitalId = GetHospitalIdFromHeader();
      patientInfo.HospitalId = hospitalId;

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

    // GET: api/PatientInfoes/count/today
    [HttpGet("count/today")]
    public async Task<ActionResult<int>> GetNewPatientsToday()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var count = await _context.PatientInfos
          .AsNoTracking()
          .Where(p => p.RegstrationDate != null && p.RegstrationDate.Value.Date == DateTime.Today && (hospitalId == null || p.HospitalId == hospitalId))
          .Select(p => p.PatientId)
          .Distinct()
          .CountAsync();

      return Ok(count); // returns a bare JSON number
    }




    // DELETE: api/PatientInfoes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatientInfo(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var patientInfo = await _context.PatientInfos
                        .Where(p => p.PatientId == id && (hospitalId == null || p.HospitalId == hospitalId))
                        .FirstOrDefaultAsync();
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
