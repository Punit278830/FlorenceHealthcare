using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using Microsoft.Extensions.Hosting;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OptionsController : WithHospitalController
    {
        public OptionsController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/Options
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Option>>> GetOptions()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.Options.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(o => o.HospitalId == hospitalId);
            }
            return await query.ToListAsync();
        }

        // GET: api/Options/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Option>> GetOption(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var option = await _context.Options.FirstOrDefaultAsync(o => o.OptionId == id && (hospitalId == null || o.HospitalId == hospitalId));

            if (option == null)
            {
                return NotFound();
            }

            return option;
        }

        // PUT: api/Options/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOption(int id, Option option)
        {
            if (id != option.OptionId)
            {
                return BadRequest();
            }

            // Tag with HospitalId if provided
            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null) option.HospitalId = hospitalId;

            _context.Entry(option).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OptionExists(id))
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

        // POST: api/Options
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Option>> PostOption(List<Option> options)
        {
            if(options.Count == 0)
            {
                return NoContent();
            }
            var hospitalId = GetHospitalIdFromHeader();
            foreach (var option in options)
            {
                option.HospitalId = hospitalId; // tag if provided
                _context.Options.Add(option);
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostOption), options);
        }

        // DELETE: api/Options/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOption(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var option = await _context.Options.FirstOrDefaultAsync(o => o.OptionId == id && (hospitalId == null || o.HospitalId == hospitalId));
            if (option == null)
            {
                return NotFound();
            }

            _context.Options.Remove(option);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OptionExists(int id)
        {
            return _context.Options.Any(e => e.OptionId == id);
        }
    }
}
