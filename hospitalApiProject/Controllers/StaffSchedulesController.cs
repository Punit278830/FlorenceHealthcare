using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffSchedulesController : WithHospitalController
    {
        public StaffSchedulesController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/StaffSchedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffSchedule>>> GetStaffSchedules()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.StaffSchedules.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(p => p.HospitalId == hospitalId);
            }
            return await query.OrderByDescending(p=>p.ScheduleId).ToListAsync();
        }

        // GET: api/StaffSchedules/5
        [HttpGet("StaffId/{StaffId}")]
        public async Task<ActionResult<List<StaffSchedule>>> GetStaffSchedule(int StaffId)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var staffSchedule = await _context.StaffSchedules.Where(e => e.StaffId == StaffId && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();
            if (staffSchedule == null)
            {
                return NotFound();
            }

            return staffSchedule;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffSchedule>> GetStaffScheduleById(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var staffSchedule = await _context.StaffSchedules.FirstOrDefaultAsync(e => e.ScheduleId == id && (hospitalId == null || e.HospitalId == hospitalId));

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
            staffSchedule.ApplyScheduleDate = DateTime.UtcNow.Date;

            // Tag with HospitalId for safety if provided
            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null) staffSchedule.HospitalId = hospitalId;

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
                staffSchedule.ApplyScheduleDate = DateTime.UtcNow.Date;

                // Tag with HospitalId if header provided
                var hospitalId = GetHospitalIdFromHeader();
                staffSchedule.HospitalId = hospitalId;

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
            var hospitalId = GetHospitalIdFromHeader();
            var staffSchedule = await _context.StaffSchedules.FirstOrDefaultAsync(e => e.ScheduleId == id && (hospitalId == null || e.HospitalId == hospitalId));
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
        public async Task<ActionResult<List<StaffSchedule>>> GetStaffOnLeave(int depId, DateTime appointmentDate)
        {
            try {
                var hospitalId = GetHospitalIdFromHeader();
                var staffSchedule = await _context.StaffSchedules.Where(e => e.DepartmentId == depId && e.LeaveStatus == 2 && e.ScheduleDate == appointmentDate && e.Status == "Approved" && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();

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
