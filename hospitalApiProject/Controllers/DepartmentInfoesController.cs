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
        try
        {
            var hospitalIdTuple = await GetHospitalIdForFilteringAsync();
            int? hospitalId = null;
            if (hospitalIdTuple is Tuple<bool, int?> tuple)
            {
                hospitalId = tuple.Item2;
            }
            var userTimeZone = GetTimeZoneFromHeader(); // Get user's timezone from header
            
            // Get user's timezone info
            TimeZoneInfo timeZoneInfo;
            try
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(userTimeZone);
            }
            catch
            {
                // Fallback to UTC if timezone is not found
                timeZoneInfo = TimeZoneInfo.Utc;
            }
            
            // Get today's date in user's timezone
            var utcNow = DateTime.UtcNow;
            var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
            var todayStart = localNow.Date;
            var todayEnd = todayStart.AddDays(1);
            
            // Convert back to UTC for database query
            var todayStartUtc = TimeZoneInfo.ConvertTimeToUtc(todayStart, timeZoneInfo);
            var todayEndUtc = TimeZoneInfo.ConvertTimeToUtc(todayEnd, timeZoneInfo);

            var result = await _context.AppointmentInfos
                .Where(a => a.Date >= todayStartUtc && a.Date < todayEndUtc && (hospitalId == null || a.HospitalId == hospitalId))
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
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetpatientCountByDepartment: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            
            return StatusCode(500, new { message = "Error retrieving patient count by department", error = ex.Message });
        }
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
            try
            {
                var hospitalIdTuple = await GetHospitalIdForFilteringAsync();
                int? hospitalId = null;
                if (hospitalIdTuple is Tuple<bool, int?> tuple)
                {
                    hospitalId = tuple.Item2;
                }
                
                // If super admin (hospitalId is null), return all departments
                // Otherwise, filter by hospital
                var departments = await _context.DepartmentInfos
                    .Where(d => hospitalId == null || d.HospitalId == hospitalId)
                    .OrderByDescending(p => p.DepartmentId)
                    .ToListAsync();
                
                return Ok(departments);
            }
            catch (Exception ex)
            {
                // Log the specific error for debugging
                Console.WriteLine($"Error in GetDepartmentInfos: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return StatusCode(500, new { message = "Error retrieving departments", error = ex.Message });
            }
        }

        // GET: api/DepartmentInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentInfo>> GetDepartmentInfo(int id)
        {
            try
            {
                var hospitalIdTuple = await GetHospitalIdForFilteringAsync();
                int? hospitalId = null;
                if (hospitalIdTuple is Tuple<bool, int?> tuple)
                {
                    hospitalId = tuple.Item2;
                }
                
                // Filter by hospital if not super admin
                var departmentInfo = await _context.DepartmentInfos
                    .Where(d => d.DepartmentId == id && (hospitalId == null || d.HospitalId == hospitalId))
                    .FirstOrDefaultAsync();

                if (departmentInfo == null)
                {
                    return NotFound();
                }

                return departmentInfo;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetDepartmentInfo: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return StatusCode(500, new { message = "Error retrieving department", error = ex.Message });
            }
        }

        // PUT: api/DepartmentInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartmentInfo(int id, DepartmentInfo departmentInfo)
        {
            try
            {
                if (id != departmentInfo.DepartmentId)
                {
                    return BadRequest();
                }

                var hospitalIdTuple = await GetHospitalIdForFilteringAsync();
                int? hospitalId = null;
                if (hospitalIdTuple is Tuple<bool, int?> tuple)
                {
                    hospitalId = tuple.Item2;
                }
                var existingDepartment = await _context.DepartmentInfos
                    .Where(d => d.DepartmentId == id && (hospitalId == null || d.HospitalId == hospitalId))
                    .FirstOrDefaultAsync();

                if (existingDepartment == null)
                {
                    return NotFound();
                }

                // Ensure DisplayName is properly handled (can be null or empty)
                if (string.IsNullOrWhiteSpace(departmentInfo.DisplayName))
                {
                    departmentInfo.DisplayName = null;
                }

                // Update the existing department
                existingDepartment.DepartmentName = departmentInfo.DepartmentName;
                existingDepartment.DisplayName = departmentInfo.DisplayName;
                existingDepartment.DepartmentStatus = departmentInfo.DepartmentStatus;

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
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutDepartmentInfo: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return StatusCode(500, new { message = "Error updating department", error = ex.Message });
            }
        }

        // POST: api/DepartmentInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DepartmentInfo>> PostDepartmentInfo(DepartmentInfo departmentInfo)
        {
            try
            {
                // Ensure DisplayName is properly handled (can be null or empty)
                if (string.IsNullOrWhiteSpace(departmentInfo.DisplayName))
                {
                    departmentInfo.DisplayName = null;
                }

                // Set hospital ID if provided (for multi-tenant support)
                var hospitalIdTuple = await GetHospitalIdForFilteringAsync();
                if (hospitalIdTuple is Tuple<bool, int?> tuple)
                {
                    departmentInfo.HospitalId = tuple.Item2;
                }

                _context.DepartmentInfos.Add(departmentInfo);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetDepartmentInfo", new { id = departmentInfo.DepartmentId }, departmentInfo);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostDepartmentInfo: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return StatusCode(500, new { message = "Error creating department", error = ex.Message });
            }
        }
                

        // DELETE: api/DepartmentInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartmentInfo(int id)
        {
            try
            {
                var hospitalIdTuple = await GetHospitalIdForFilteringAsync();
                int? hospitalId = null;
                if (hospitalIdTuple is Tuple<bool, int?> tuple)
                {
                    hospitalId = tuple.Item2;
                }
                
                // Filter by hospital if not super admin
                var departmentInfo = await _context.DepartmentInfos
                    .Where(d => d.DepartmentId == id && (hospitalId == null || d.HospitalId == hospitalId))
                    .FirstOrDefaultAsync();
                    
                if (departmentInfo == null)
                {
                    return NotFound();
                }

                _context.DepartmentInfos.Remove(departmentInfo);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteDepartmentInfo: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return StatusCode(500, new { message = "Error deleting department", error = ex.Message });
            }
        }

        private bool DepartmentInfoExists(int id)
        {
            try
            {
                return _context.DepartmentInfos.Any(e => e.DepartmentId == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DepartmentInfoExists: {ex.Message}");
                return false; // Return false if there's an error checking existence
            }
        }
    }
}
