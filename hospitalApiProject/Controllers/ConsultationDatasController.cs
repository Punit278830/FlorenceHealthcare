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
    public class ConsultationDatasController : WithHospitalController
    {
        public ConsultationDatasController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/ConsultationDatas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultationDatum>>> GetConsultationData()
        {
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            var query = _context.ConsultationData.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(c => c.HospitalId == hospitalId);
            }
            return await query.ToListAsync();
        }

        // GET: api/ConsultationDatas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultationDatum>> GetConsultationDatum(int id)
        {
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            var consultationDatum = await _context.ConsultationData.Where(e => e.AppointmentId == id && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();

            if (consultationDatum.Count == 0)
            {
                return NotFound();
            }

            return Ok(consultationDatum);
        }

        // PUT: api/ConsultationDatas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsultationDatum(int id, ConsultationDatum consultationDatum)
        {
            if (id != consultationDatum.Id)
            {
                return BadRequest();
            }

            // Tag with HospitalId if provided
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            if (hospitalId != null) consultationDatum.HospitalId = hospitalId;

            _context.Entry(consultationDatum).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsultationDatumExists(id))
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

        // POST: api/ConsultationDatas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ConsultationDatum>> PostConsultationDatum(ConsultationDatum consultationDatum)
        {
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            consultationDatum.HospitalId = hospitalId;
            _context.ConsultationData.Add(consultationDatum);
            await _context.SaveChangesAsync();
            var appointment=await _context.AppointmentInfos.FindAsync(consultationDatum.AppointmentId);
            if(appointment==null)
            {
                return NotFound("Appointment Not found");
            }
            appointment.AppointmentStatus = "In Active";
            await _context.SaveChangesAsync();


            return  Ok(consultationDatum);
        }

        // DELETE: api/ConsultationDatas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsultationDatum(int id)
        {
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            var consultationDatum = await _context.ConsultationData.FirstOrDefaultAsync(c => c.Id == id && (hospitalId == null || c.HospitalId == hospitalId));
            if (consultationDatum == null)
            {
                return NotFound();
            }

            _context.ConsultationData.Remove(consultationDatum);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsultationDatumExists(int id)
        {
            return _context.ConsultationData.Any(e => e.Id == id);
        }
    }
}
