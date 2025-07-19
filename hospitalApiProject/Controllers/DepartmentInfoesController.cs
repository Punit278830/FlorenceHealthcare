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

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    
    [ApiController]
    public class DepartmentInfoesController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public DepartmentInfoesController(FlorenceDbContext context)
        {
            _context = context;
        }

    [HttpGet("PatientCountByDepartment")]
    public async Task<ActionResult<DepartmentInfo>> GetpatientCountByDepartment()
    {
      var today = DateTime.Today;

      var result = await _context.AppointmentInfos
          .Where(a => a.Date.Date == today)
          .GroupBy(a => a.Departmentid)
          .Select(g => new
          {
            DepartmentName = _context.DepartmentInfos
                  .Where(d => d.DepartmentId == g.Key)
                  .Select(d => d.DepartmentName)
                  .FirstOrDefault(),
            DisplayName = _context.DepartmentInfos
                  .Where(d => d.DepartmentId == g.Key)
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
            return await _context.DepartmentInfos.OrderByDescending(p=>p.DepartmentId).ToListAsync();
        }

        // GET: api/DepartmentInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentInfo>> GetDepartmentInfo(int id)
        {
            var departmentInfo = await _context.DepartmentInfos.FindAsync(id);

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

            _context.DepartmentInfos.Add(departmentInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDepartmentInfo", new { id = departmentInfo.DepartmentId }, departmentInfo);
        }
                

        // DELETE: api/DepartmentInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartmentInfo(int id)
        {
            var departmentInfo = await _context.DepartmentInfos.FindAsync(id);
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
