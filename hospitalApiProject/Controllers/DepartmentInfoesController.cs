using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.HttpResults;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    
    [ApiController]
    public class DepartmentInfoesController : WithHospitalController
    {
        public DepartmentInfoesController(FlorenceDbContext context) : base(context)
        {
        }

    [HttpGet("PatientCountByDepartment")]
    public async Task<ActionResult<DepartmentInfo>> GetpatientCountByDepartment()
    {
      var today = DateTime.Today;
      var hospitalId = GetHospitalIdFromHeader();

      var result = await _context.AppointmentInfos
          .Where(a => a.Date.Date == today && (hospitalId == null || a.HospitalId == hospitalId))
          .GroupBy(a => a.Departmentid)
          .Select(g => new
          {
            DepartmentName = _context.DepartmentInfos
                  .Where(d => d.DepartmentId == g.Key && (hospitalId == null || d.HospitalId == hospitalId))
                  .Select(d => d.DepartmentName)
                  .FirstOrDefault(),
            DisplayName = _context.DepartmentInfos

                  .Where(d => d.DepartmentId == g.Key && (hospitalId == null || d.HospitalId == hospitalId))
                  .Select(d => d.DisplayName)
                  .FirstOrDefault(),
            PatientCount = g.Select(a => a.PatientId).Distinct().Count()
          })
          .ToListAsync();

      return Ok(result);

    }



    [HttpOptions]
        public IActionResult Options()
        {
            return Ok();
        }
        // GET: api/DepartmentInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentInfo>>> GetDepartmentInfos()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.DepartmentInfos.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(p => p.HospitalId == hospitalId);
            }
            return await query.OrderByDescending(p=>p.DepartmentId).ToListAsync();
        }

        // GET: api/DepartmentInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentInfo>> GetDepartmentInfo(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var departmentInfo = await _context.DepartmentInfos.FirstOrDefaultAsync(d => d.DepartmentId == id && (hospitalId == null || d.HospitalId == hospitalId));

            if (departmentInfo == null)
            {
                return NotFound();
            }

            return departmentInfo;
        }

        // PUT: api/DepartmentInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartmentInfo(int id, DepartmentInfo departmentInfo)
        {
            if (id != departmentInfo.DepartmentId)
            {
                return BadRequest();
            }

            // Ensure DisplayName is properly handled (can be null or empty)
            if (string.IsNullOrWhiteSpace(departmentInfo.DisplayName))
            {
                departmentInfo.DisplayName = null;
            }

            // Tag with HospitalId if provided in header
            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null) departmentInfo.HospitalId = hospitalId;

            _context.Entry(departmentInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentInfoExists(id))
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

        // POST: api/DepartmentInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DepartmentInfo>> PostDepartmentInfo(DepartmentInfo departmentInfo)
        {
            // Ensure DisplayName is properly handled (can be null or empty)
            if (string.IsNullOrWhiteSpace(departmentInfo.DisplayName))
            {
                departmentInfo.DisplayName = null;
            }

            // Tag with HospitalId if provided in header
            var hospitalId = GetHospitalIdFromHeader();
            departmentInfo.HospitalId = hospitalId;

            _context.DepartmentInfos.Add(departmentInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDepartmentInfo", new { id = departmentInfo.DepartmentId }, departmentInfo);
        }
                

        // DELETE: api/DepartmentInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartmentInfo(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var departmentInfo = await _context.DepartmentInfos.FirstOrDefaultAsync(d => d.DepartmentId == id && (hospitalId == null || d.HospitalId == hospitalId));
            if (departmentInfo == null)
            {
                return NotFound();
            }

            _context.DepartmentInfos.Remove(departmentInfo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DepartmentInfoExists(int id)
        {
            return _context.DepartmentInfos.Any(e => e.DepartmentId == id);
        }
    }
}
