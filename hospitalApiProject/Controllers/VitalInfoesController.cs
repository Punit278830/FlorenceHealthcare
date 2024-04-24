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
    public class VitalInfoesController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public VitalInfoesController(FlorenceDbContext context)
        {
            _context = context;
        }

        // GET: api/VitalInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VitalInfo>>> GetVitalInfos()
        {
            return await _context.VitalInfos.ToListAsync();
        }

        // GET: api/VitalInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VitalInfo>> GetVitalInfo(int id)
        {
            var vitalInfo = await _context.VitalInfos.FindAsync(id);

            if (vitalInfo == null)
            {
                return NotFound();
            }

            return vitalInfo;
        }


        [HttpGet("byAppointment/{id}")]
        public async Task<ActionResult<VitalInfo>> GetVitalInfoByAppointment(int id)
        {
            var vitalInfo = await _context.VitalInfos.Where(e=>e.AppointmentId == id).FirstOrDefaultAsync();

            if (vitalInfo == null)
            {
                return NotFound();
            }

            return Ok(vitalInfo);
        }

        // PUT: api/VitalInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVitalInfo(int id, VitalInfo vitalInfo)
        {
                
            if (id != vitalInfo.VitalId)
            {
                return BadRequest();
            }

            _context.Entry(vitalInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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

            return NoContent();
        }

        // POST: api/VitalInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<VitalInfo>> PostVitalInfo(VitalInfo vitalInfo)
        {
            _context.VitalInfos.Add(vitalInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVitalInfo", new { id = vitalInfo.VitalId }, vitalInfo);
        }

        // DELETE: api/VitalInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVitalInfo(int id)
        {
            var vitalInfo = await _context.VitalInfos.FindAsync(id);
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
