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
    public class VitalInfoesController : WithHospitalController
    {
        public VitalInfoesController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/VitalInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VitalInfo>>> GetVitalInfos()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.VitalInfos.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(v => v.HospitalId == hospitalId);
            }
            return await query.ToListAsync();
        }

        // GET: api/VitalInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VitalInfo>> GetVitalInfo(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var vitalInfo = await _context.VitalInfos.FirstOrDefaultAsync(v => v.VitalId == id && (hospitalId == null || v.HospitalId == hospitalId));

            if (vitalInfo == null)
            {
                return NotFound();
            }

            return vitalInfo;
        }


        [HttpGet("byAppointment/{id}")]
        public async Task<ActionResult<VitalInfo>> GetVitalInfoByAppointment(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var vitalInfo = await _context.VitalInfos.Where(e => e.AppointmentId == id && (hospitalId == null || e.HospitalId == hospitalId)).FirstOrDefaultAsync();

            if (vitalInfo == null)
            {
                // Return an empty VitalInfo object with the AppointmentId set, so frontend can handle gracefully
                return Ok(new VitalInfo { AppointmentId = id });
            }

            return Ok(vitalInfo);
        }

        // PUT: api/VitalInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVitalInfo(int id, VitalInfo vitalInfo)
        {
            var vitalId = 0;
            try
            {
                if (id != vitalInfo.VitalId)
                {
                    return BadRequest();
                }
                var hospitalId = GetHospitalIdFromHeader();
                if (hospitalId != null) vitalInfo.HospitalId = hospitalId;
                if (id == 0)
                {
                    vitalId = _context.VitalInfos.Add(vitalInfo).Entity.VitalId;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    _context.Entry(vitalInfo).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    vitalId = id;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VitalInfoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(vitalId);
        }

        // POST: api/VitalInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<VitalInfo>> PostVitalInfo(VitalInfo vitalInfo)
        {
            var hospitalId = GetHospitalIdFromHeader();
            vitalInfo.HospitalId = hospitalId;
            _context.VitalInfos.Add(vitalInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVitalInfo", new { id = vitalInfo.VitalId }, vitalInfo);
        }

        // DELETE: api/VitalInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVitalInfo(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var vitalInfo = await _context.VitalInfos.FirstOrDefaultAsync(v => v.VitalId == id && (hospitalId == null || v.HospitalId == hospitalId));
            if (vitalInfo == null)
            {
                return NotFound();
            }

            _context.VitalInfos.Remove(vitalInfo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VitalInfoExists(int id)
        {
            return _context.VitalInfos.Any(e => e.VitalId == id);
        }
    }
}
