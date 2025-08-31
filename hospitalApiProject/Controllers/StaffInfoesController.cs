using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using System.Drawing.Text;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StaffInfoesController : WithHospitalController
  {
    public StaffInfoesController(FlorenceDbContext context) : base(context)
    {
    }

    // GET: api/GetDoctorsInfo
    [HttpGet("doctors")]
    public async Task<ActionResult<IEnumerable<StaffInfo>>> GetDoctorsInfo()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var result = await _context.StaffInfos
        .Where(e => e.Designation.ToLower() == "doctor" && (hospitalId == null || e.HospitalId == hospitalId))
        .OrderBy(e => e.FirstName)
        .ToListAsync();
      return Ok(result);
    }

    // GET: api/GetDoctorsInfo
    [HttpGet("doctorsByDepartment")]
    public async Task<ActionResult<IEnumerable<StaffInfo>>> GetDoctorsByDepartmentInfo(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var result = await _context.StaffInfos.Where(e => e.DepartmentId == id && e.ActiveStatus == 1 && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();
      return Ok(result);
    }

    // GET: api/StaffInfoes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StaffInfo>>> GetStaffInfos()
    {
      var hospitalId = GetHospitalIdFromHeader();
      return await _context.StaffInfos
        .Where(p => hospitalId == null || p.HospitalId == hospitalId)
        .OrderBy(p => p.FirstName)
        .ToListAsync();
    }

    // GET: api/StaffInfoes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<StaffInfo>> GetStaffInfo(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var staffInfo = await _context.StaffInfos.Where(s => s.StaffId == id && (hospitalId == null || s.HospitalId == hospitalId)).FirstOrDefaultAsync();

      if (staffInfo == null)
      {
        return NotFound();
      }

      return staffInfo;
    }

    [HttpGet("{email}/{password}")]
    //GET: api/StaffInfoes/
    public async Task<ActionResult<StaffInfo>> GetloginInfo(string email, string password)
    {
      // For login, we don't filter by hospital since we need to find the user first
      // The user's hospital will be determined by their StaffInfo record
      if (email != null && password != null)
      {
        List<StaffInfo> login = await _context.StaffInfos.Where(e => e.Email.Contains(email)).ToListAsync<StaffInfo>();

        if (login != null && login.Count > 0)
        {
          if (login[0].Password == password)
          {
            return login[0];
          }
        }
      }

      return NotFound();
    }
    // PUT: api/StaffInfoes/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutStaffInfo(int id, StaffInfo staffInfo)
    {
      if (id != staffInfo.StaffId)
      {
        return BadRequest();
      }

      _context.Entry(staffInfo).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!StaffInfoExists(id))
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

    // POST: api/StaffInfoes
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<StaffInfo>> PostStaffInfo(StaffInfo staffInfo)
    {
      var hospitalId = GetHospitalIdFromHeader();
      staffInfo.HospitalId = hospitalId; // tag staff with hospital if provided

      var existingStaff = await _context.StaffInfos.FirstOrDefaultAsync(p => p.IdentityNumber == staffInfo.IdentityNumber && (hospitalId == null || p.HospitalId == hospitalId));

      if (existingStaff != null)
      {
        // Return a conflict response if the IdentityNumber already exists
        return Conflict(new { message = "Identity Number already exists." });
      }
      _context.StaffInfos.Add(staffInfo);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetStaffInfo", new { id = staffInfo.StaffId }, staffInfo);
    }

    // DELETE: api/StaffInfoes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStaffInfo(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var staffInfo = await _context.StaffInfos.Where(s => s.StaffId == id && (hospitalId == null || s.HospitalId == hospitalId)).FirstOrDefaultAsync();
      if (staffInfo == null)
      {
        return NotFound();
      }

      _context.StaffInfos.Remove(staffInfo);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool StaffInfoExists(int id)
    {
      return _context.StaffInfos.Any(e => e.StaffId == id);
    }
  }



}
