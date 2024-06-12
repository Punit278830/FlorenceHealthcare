using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using System.Drawing.Text;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffInfoesController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public StaffInfoesController(FlorenceDbContext context)
        {
            _context = context;
        }

        // GET: api/GetDoctorsInfo
        [HttpGet("doctors")]
        public async Task<ActionResult<IEnumerable<StaffInfo>>> GetDoctorsInfo()
        {

            var result = await _context.StaffInfos.Where(e => e.Designation.ToLower() == "doctor").ToListAsync();
            return Ok(result);
        }

        // GET: api/GetDoctorsInfo
        [HttpGet("doctorsByDepartment")]
        public async Task<ActionResult<IEnumerable<StaffInfo>>> GetDoctorsByDepartmentInfo(int id)
        {

            var result = await _context.StaffInfos.Where(e => e.DepartmentId==id && e.ActiveStatus==1).ToListAsync();
            return Ok(result);
        }

        // GET: api/StaffInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffInfo>>> GetStaffInfos()
        {
            return await _context.StaffInfos.OrderByDescending(p=>p.StaffId).ToListAsync();
        }

        // GET: api/StaffInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffInfo>> GetStaffInfo(int id)
        {
            var staffInfo = await _context.StaffInfos.FindAsync(id);

            if (staffInfo == null)
            {
                return NotFound();
            }

            return staffInfo;
        }

        [HttpGet("{email}/{password}")]
        //GET: api/StaffInfoes/
        public async Task<ActionResult<StaffInfo>> GetloginInfo(string email,string password)
        {
            if(email!= null && password!= null) {
                List<StaffInfo> login = await _context.StaffInfos.Where(e => e.Email.Contains(email)).ToListAsync<StaffInfo>();

                if (login != null && login.Count>0)
                {
                    if (login[0].Password == password)
                        return login[0];
                    {



                    }

                }
                
            }
            

            
            return NotFound();

            
        }
        // PUT: api/StaffInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaffInfo(int id, StaffInfo staffInfo)
        {
            if (id != staffInfo.StaffId)
            {
                return BadRequest();
            }

            _context.Entry(staffInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffInfoExists(id))
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

        // POST: api/StaffInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StaffInfo>> PostStaffInfo(StaffInfo staffInfo)
        {
            _context.StaffInfos.Add(staffInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStaffInfo", new { id = staffInfo.StaffId }, staffInfo);
        }

        // DELETE: api/StaffInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaffInfo(int id)
        {
            var staffInfo = await _context.StaffInfos.FindAsync(id);
            if (staffInfo == null)
            {
                return NotFound();
            }

            _context.StaffInfos.Remove(staffInfo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StaffInfoExists(int id)
        {
            return _context.StaffInfos.Any(e => e.StaffId == id);
        }
    }
    
    

}
