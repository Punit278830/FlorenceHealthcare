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
    public class MedicineMastersController : WithHospitalController
    {
        public MedicineMastersController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/MedicineMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicineMaster>>> GetMedicineMasters()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.MedicineMasters.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(m => m.HospitalId == hospitalId);
            }
            return await query.OrderByDescending(x => x.MedId).ToListAsync();
        }

        // GET: api/MedicineMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicineMaster>> GetMedicineMaster(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var medicineMaster = await _context.MedicineMasters.FirstOrDefaultAsync(m => m.MedId == id && (hospitalId == null || m.HospitalId == hospitalId));

            if (medicineMaster == null)
            {
                return NotFound();
            }

            return medicineMaster;
        }


        [HttpGet("medName/{medName}")]
        public async Task<ActionResult<Boolean>> SearchMedicine(string medName)
        {
            if (!string.IsNullOrEmpty(medName))
            {
                var hospitalId = GetHospitalIdFromHeader();
                var medExists = await _context.MedicineMasters.AnyAsync(e => e.MedName == medName && (hospitalId == null || e.HospitalId == hospitalId));
                return Ok(medExists);
            }
            else
            {
                return BadRequest("Bad Request");
            }
        }

        [HttpGet("matchMedicineName/{medName}")]
        public async Task<ActionResult<IEnumerable<MedicineMaster>>> SearchAllMedicineMatchWithName(string medName)
        {
            if (!string.IsNullOrEmpty(medName))
            {
                var hospitalId = GetHospitalIdFromHeader();
                var medExists = await _context.MedicineMasters
            .Where(e => e.MedName.Contains(medName) && (hospitalId == null || e.HospitalId == hospitalId))
            .ToListAsync();
                if(medExists.Any())
                {
                    return Ok(medExists);
                }
                else
                {
                    return NotFound("No Match found");
                }
                
            }
            else
            {
                return BadRequest("Bad Request");
            }
        }




        // PUT: api/MedicineMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicineMaster(int id, MedicineMaster medicineMaster)
        {
            if (id != medicineMaster.MedId)
            {
                return BadRequest();
            }

            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null) medicineMaster.HospitalId = hospitalId;

            _context.Entry(medicineMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicineMasterExists(id))
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

        // POST: api/MedicineMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MedicineMaster>> PostMedicineMaster(MedicineMaster medicineMaster)
        {
            var hospitalId = GetHospitalIdFromHeader();
            medicineMaster.HospitalId = hospitalId;
            _context.MedicineMasters.Add(medicineMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMedicineMaster", new { id = medicineMaster.MedId }, medicineMaster);
        }

        // DELETE: api/MedicineMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicineMaster(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var medicineMaster = await _context.MedicineMasters.FirstOrDefaultAsync(m => m.MedId == id && (hospitalId == null || m.HospitalId == hospitalId));
            if (medicineMaster == null)
            {
                return NotFound();
            }

            _context.MedicineMasters.Remove(medicineMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MedicineMasterExists(int id)
        {
            return _context.MedicineMasters.Any(e => e.MedId == id);
        }
    }
}
