using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffSchedulesController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public StaffSchedulesController(FlorenceDbContext context)
        {
            _context = context;
        }

        // GET: api/StaffSchedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffSchedule>>> GetStaffSchedules()
        {
            return await _context.StaffSchedules.ToListAsync();
        }

        // GET: api/StaffSchedules/5
        [HttpGet("StaffId/{StaffId}")]
        public async Task<ActionResult<List<StaffSchedule>>> GetStaffSchedule(int StaffId)
        {
            var staffSchedule = await _context.StaffSchedules.Where(e => e.StaffId == StaffId).ToListAsync();
            //var staffSchedule = await _context.StaffSchedules.FindAsync(id);

            if (staffSchedule == null)
            {
                return NotFound();
            }

            return staffSchedule;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffSchedule>> GetStaffScheduleById(int id)
        {
            
            var staffSchedule = await _context.StaffSchedules.FindAsync(id);

            if (staffSchedule == null)
            {
                return NotFound();
            }

            return staffSchedule;
        }

        // PUT: api/StaffSchedules/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaffSchedule(int id, StaffSchedule staffSchedule)
        {
            if (id != staffSchedule.ScheduleId)
            {
                return BadRequest();
            }
            staffSchedule.ApplyScheduleDate = DateOnly.FromDateTime(DateTime.Today);
            _context.Entry(staffSchedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffScheduleExists(id))
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

        // POST: api/StaffSchedules
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StaffSchedule>> PostStaffSchedule(StaffSchedule staffSchedule)
        {
            try
            {
                staffSchedule.ApplyScheduleDate = DateOnly.FromDateTime(DateTime.Today);

                _context.StaffSchedules.Add(staffSchedule);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetStaffScheduleById", new { id = staffSchedule.ScheduleId }, staffSchedule);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal Server Error");
            }
        }


        // DELETE: api/StaffSchedules/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaffSchedule(int id)
        {
            var staffSchedule = await _context.StaffSchedules.FindAsync(id);
            if (staffSchedule == null)
            {
                return NotFound();
            }

            _context.StaffSchedules.Remove(staffSchedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StaffScheduleExists(int id)
        {
            return _context.StaffSchedules.Any(e => e.ScheduleId == id);
        }

        [HttpGet("{depId}/{appointmentDate}")]
        public async Task<ActionResult<List<StaffSchedule>>> GetStaffOnLeave(int depId, DateOnly appointmentDate)
        {
            try {
                var staffSchedule = await _context.StaffSchedules.Where(e => e.DepartmentId == depId && e.LeaveStatus == 2 && e.ScheduleDate == appointmentDate).ToListAsync();
                //var staffSchedule = await _context.StaffSchedules.FindAsync(id);

                if (staffSchedule == null)
                {
                    return NotFound();
                }

                return staffSchedule;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
