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
    public class AppointmentInfoesController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public AppointmentInfoesController(FlorenceDbContext context)
        {
            _context = context;
        }
        // Get Appointment Data by  Current date 
        // GET: api/AppointmentInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentInfo>>> GetAppointmentInfos()
        {
            // return await _context.AppointmentInfos.ToListAsync();
            var currentDate = DateTime.Now.Date;
            var appointmentInfo = await _context.AppointmentInfos.Where(e => e.Date == currentDate).ToListAsync();
                

            if (appointmentInfo == null || !appointmentInfo.Any()) // Check if appointments were found
            {
                //return NotFound();
                return Ok(new { message = "No records found" });
            }

            return appointmentInfo;

        }

        //Count of Appointments 
        [HttpGet("count")]
        public async Task<ActionResult<int>> GetAppointmentCount()
        {
            var currentDate = DateTime.Now.Date;
            var appointmentCount = await _context.AppointmentInfos
                .Where(e => e.Date == currentDate)
                .CountAsync();

            if (appointmentCount == 0) // Check if appointments were found
            {
                return Ok(new { message = "No appointments found for the current date" });
            }

            return Ok(appointmentCount);
        }


            //Count of Appointments by doctor id
            [HttpGet("count/{id}")]
            public async Task<ActionResult<int>> GetAppointmentCount(int id)
            {
                var currentDate = DateTime.Now.Date;
                var appointmentCount = await _context.AppointmentInfos
                    .Where(e => e.Date == currentDate && e.DoctorId==id)
                    .CountAsync();

                if (appointmentCount == 0) // Check if appointments were found
                {
                    return Ok(new { message = "No appointments found for the current date" });
                }

                return Ok(appointmentCount);
            }


        //Count of Consultation 
        [HttpGet("ConsultationCount")]
        public async Task<ActionResult<int>> GetConsultationCount()
        {
            var currentDate = DateTime.Now.Date;
            var appointmentCount = await _context.AppointmentInfos
                .Where(e => e.Date == currentDate && e.AppointmentStatus == "In Active")
                .CountAsync();

            if (appointmentCount == 0) // Check if appointments were found
            {
                return Ok(new { message = "No consultation found for the current date" });
            }

            return Ok(appointmentCount);
        }



        //Count of Consultation by doctor id
        [HttpGet("ConsultationCount/{id}")]
        public async Task<ActionResult<int>> GetConsultationCount(int id)
        {
            var currentDate = DateTime.Now.Date;
            var appointmentCount = await _context.AppointmentInfos
                .Where(e => e.Date == currentDate && e.DoctorId == id && e.AppointmentStatus=="In Active")
                .CountAsync();

            if (appointmentCount == 0) // Check if appointments were found
            {
                return Ok(new { message = "No consultation found for the current date" });
            }

            return Ok(appointmentCount);
        }

        //Earning  by doctor id
        [HttpGet("Earning/{id}")]
        public async Task<ActionResult<int>> GetEarning(int id)
        {
            var currentDate = DateTime.Now.Date;
            var Earning = 0;
            var appointments = await _context.AppointmentInfos
                .Where(e => e.Date == currentDate && e.DoctorId == id).ToListAsync();

            if (!appointments.Any()) // Check if appointments were found
            {
                return Ok(new { message = "No consultation found for the current date" });
            }

            foreach (var appointment in appointments)
            {
                Earning += appointment.Fee;

            }
            
            return Ok(Earning);
        }

        //Total Earning
        [HttpGet("Earning/")]
        public async Task<ActionResult<int>> GetEarning()
        {
            var currentDate = DateTime.Now.Date;
            var Earning = 0;
            var appointments = await _context.AppointmentInfos
                .Where(e => e.Date == currentDate).ToListAsync();

            if (!appointments.Any()) // Check if appointments were found
            {
                return Ok(new { message = "No consultation found for the current date" });
            }

            foreach (var appointment in appointments)
            {
                Earning += appointment.Fee;

            }

            return Ok(Earning);
        }





        // GET: api/AppointmentInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentInfo>> GetAppointmentInfo(int id)
        {
            var appointmentInfo = await _context.AppointmentInfos.FindAsync(id);

            if (appointmentInfo == null)
            {
                return NotFound();
            }

            return appointmentInfo;
        }


        // Get Appointment Data by Doctor Id and Current Date  
        // GET: api/AppointmentInfoes/5
        [HttpGet("doctor/{id}")]
        public async Task<ActionResult<IEnumerable<AppointmentInfo>>> GetAppointmentByDoctorId(int id)
        {
            var currentDate = DateTime.Now.Date; // Get current date without time component
            var appointmentInfo = await _context.AppointmentInfos
                .Where(e => e.DoctorId == id && e.Date == currentDate)
                .ToListAsync();

            if (appointmentInfo == null || !appointmentInfo.Any()) // Check if appointments were found
            {
                return NotFound();
            }

            return appointmentInfo;
        }

        // Get Appointment Data by Doctor Id and particular date 
        [HttpGet("doctor/{id}/{from}/{to}")]
        public async Task<ActionResult<IEnumerable<AppointmentInfo>>> GetAppointmentByDoctorId(int id,DateTime from,DateTime to)
        {
            
            var appointmentInfo = await _context.AppointmentInfos
                .Where(e => e.DoctorId == id && e.Date >= from && e.Date<=to)
                .ToListAsync();

            if (appointmentInfo == null || !appointmentInfo.Any()) // Check if appointments were found
            {
                return NotFound();
            }

            return appointmentInfo;
        }

        //Get Appointment Data for a purticular Date 
        [HttpGet("date/{from}/{to}")]
        public async Task<ActionResult<IEnumerable<AppointmentInfo>>> GetAppointmentByDate( DateTime from, DateTime to)
        {

            var appointmentInfo = await _context.AppointmentInfos
                .Where(e => e.Date >= from && e.Date <=to)
                .ToListAsync();

            if (appointmentInfo == null || !appointmentInfo.Any()) // Check if appointments were found
            {
                return NotFound();
            }

            return appointmentInfo;
        }



        // PUT: api/AppointmentInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointmentInfo(int id, AppointmentInfo appointmentInfo)
        {
            if (id != appointmentInfo.Id)
            {
                return BadRequest();
            }

            _context.Entry(appointmentInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentInfoExists(id))
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

        // POST: api/AppointmentInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AppointmentInfo>> PostAppointmentInfo(AppointmentInfo appointmentInfo)
        {
            _context.AppointmentInfos.Add(appointmentInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointmentInfo", new { id = appointmentInfo.Id }, appointmentInfo);
        }

        // DELETE: api/AppointmentInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointmentInfo(int id)
        {
            var appointmentInfo = await _context.AppointmentInfos.FindAsync(id);
            if (appointmentInfo == null)
            {
                return NotFound();
            }

            _context.AppointmentInfos.Remove(appointmentInfo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppointmentInfoExists(int id)
        {
            return _context.AppointmentInfos.Any(e => e.Id == id);
        }
        [HttpGet("appointmentList/{patientId}/{year}")]
        public async Task<ActionResult<IEnumerable<AppointmentInfo>>> AppointmentListByPatientId(int patientId, int year)
        {
                     var appointmentInfo = await _context.AppointmentInfos
                    .Where(e => e.PatientId == patientId && e.Date.Year == year)
                    .ToListAsync();

            if (appointmentInfo == null)
                {
                    return NotFound();
                }

                return appointmentInfo;
            
           
        }
    }
    
}
