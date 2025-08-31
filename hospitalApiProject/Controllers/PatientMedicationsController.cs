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
    public class PatientMedicationsController : WithHospitalController
    {
        public PatientMedicationsController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/PatientMedications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientMedication>>> GetPatientMedications()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.PatientMedications.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(pm => pm.HospitalId == hospitalId);
            }
            return await query.ToListAsync();
        }

        // GET: api/PatientMedications/by Appointment id
        [HttpGet("{id}")]
        public async Task<ActionResult<List<PatientMedication>>> GetPatientMedication(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var patientMedication = await _context.PatientMedications.Where(e=>e.AppointmentId==id && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();

            if (patientMedication == null)
            {
                return NotFound();
            }

            return patientMedication;
        }

        // PUT: api/PatientMedications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatientMedication(int id, PatientMedication patientMedication)
        {
            if (id != patientMedication.MedicationId)
            {
                return BadRequest();
            }

            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null) patientMedication.HospitalId = hospitalId;

            _context.Entry(patientMedication).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientMedicationExists(id))
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

        // POST: api/PatientMedications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PatientMedication>> PostPatientMedication(List<PatientMedication> patientMedications)
        {
            if(patientMedications.Count>0)
            {
               var hospitalId = GetHospitalIdFromHeader();
               foreach(var patientMedication in patientMedications)
               {
                 patientMedication.HospitalId = hospitalId;
                 _context.PatientMedications.Add(patientMedication);
               }
            }
            
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostPatientMedication), patientMedications);
        }

        // DELETE: api/PatientMedications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatientMedication(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var patientMedication = await _context.PatientMedications.FirstOrDefaultAsync(pm => pm.MedicationId == id && (hospitalId == null || pm.HospitalId == hospitalId));
            if (patientMedication == null)
            {
                return NotFound();
            }

            _context.PatientMedications.Remove(patientMedication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PatientMedicationExists(int id)
        {
            return _context.PatientMedications.Any(e => e.MedicationId == id);
        }
    }
}
