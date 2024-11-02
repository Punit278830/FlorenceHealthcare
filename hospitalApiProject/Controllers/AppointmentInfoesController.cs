using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
      //var appointmentInfo = await _context.AppointmentInfos.Where(e => e.Date == currentDate).ToListAsync();
      var appointmentInfo = await _context.AppointmentInfos.OrderByDescending(p=>p.Id).ToListAsync();


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
          .Where(e => e.DoctorId == id && e.Date == currentDate)
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
          .Where(e => e.Date == currentDate && e.AppointmentStatus == "Active")
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
          .Where(e => e.DoctorId == id && e.AppointmentStatus == "Active" && e.Date == currentDate)
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
          .Where(e => e.DoctorId == id && e.AppointmentStatus == "Active").ToListAsync();

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
    [HttpGet("TotalEarning/")]
    public async Task<ActionResult<int>> GetEarning()
    {
     // var currentDate = DateTime.Now.Date;
      var Earning = 0;
      var appointments = await _context.AppointmentInfos
          .ToListAsync();

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

    //Today Earning
    [HttpGet("TodayEarning/")]
    public async Task<ActionResult<int>> GetTodayEarning()
    {
      var currentDate = DateTime.Now.Date;
      var TodayEarning = 0;
      var appointments = await _context.AppointmentInfos
          .Where(e => e.Date == currentDate).ToListAsync();

      if (!appointments.Any()) // Check if appointments were found
      {
        return Ok(new { message = "No consultation found for the current date" });
      }

      foreach (var appointment in appointments)
      {
        TodayEarning += appointment.Fee;
      }

      return Ok(TodayEarning);
    }

    //Today Earning
    [HttpGet("TotalEarnings/Doctor/{id}")]
    public async Task<ActionResult<int>> GetTodayEarningDoctor(int id)
    {
      DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
      int? TodayEarning = 0;
      var totalAmount = await _context.InvoiceInfos
        .Join(_context.AppointmentInfos, V1 => V1.AppointmentId, V2 => V2.Id, (v1, v2) => new { v1, v2 })
          .Where(e => e.v1.IsConsultationPaid == true && e.v2.DoctorId == id && e.v1.CreatedDate == currentDate).ToListAsync();

      if (totalAmount.Count == 0) // Check if appointments were found
      {
        return Ok(new { message = "No consultation found for the current date" });
      }

      foreach (var appointment in totalAmount)
      {
        TodayEarning += appointment.v1.Amount;

      }

      return Ok(TodayEarning);
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
    public async Task<ActionResult<IEnumerable<AppointmentInfo>>> GetAppointmentByDoctorId(int id, DateTime from, DateTime to)
    {

      var appointmentInfo = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.Date >= from && e.Date <= to)
          .ToListAsync();

      if (appointmentInfo == null || !appointmentInfo.Any()) // Check if appointments were found
      {
        return NotFound();
      }

      return appointmentInfo;
    }

    //Get Appointment Data for a purticular Date 
    [HttpGet("date/{from}/{to}")]
    public async Task<ActionResult> GetAppointmentByDate(DateTime from, DateTime to)
    {
      var appointmentWithInvoices = await _context.AppointmentInfos
          .Where(e => e.Date >= from && e.Date <= to)
          .Join(
              _context.InvoiceInfos,
              appointment => appointment.Id,      // AppointmentInfos.Id
              invoice => invoice.AppointmentId,   // InvoiceInfos.AppointmentId
              (appointment, invoice) => new AppointmentWithInvoiceDto  // Single object projection
              {
                Id = appointment.Id,                  // Assuming AppointmentInfo.Id
                PatientId = appointment.PatientId,              // Date from Appointment
                Departmentid = appointment.Departmentid,  // Appointment-specific field
                DoctorId = appointment.DoctorId,       // Invoice-specific field
                IsConsultationPaid = invoice.IsConsultationPaid ,     // to show the payment status in appoinment list get the consultationpaid data here
                ScheduledByid = appointment.ScheduledByid,
                Date = appointment.Date,
                Notes = appointment.Notes,
                AppointTime = appointment.AppointTime,
                AppointmentStatus = appointment.AppointmentStatus,
                Fee = appointment.Fee,
              }
          )
          .ToListAsync();



      if (appointmentWithInvoices == null) // Check if appointments were found
      {
        return NotFound();
      }

      return Ok(appointmentWithInvoices);
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
    public async Task<ActionResult<AppointmentInvoiceResponse>> PostAppointmentInfo(AppointmentInfo appointmentInfo)
    {
      int invoiceId = 0;

      try
      {
        // Add and save the appointment information
        _context.AppointmentInfos.Add(appointmentInfo);
        await _context.SaveChangesAsync();

        if (AppointmentInfoExists(appointmentInfo.Id))
        {
          // Create and save the invoice information
          var invoiceInfo = new InvoiceInfo()
          {
            Amount = appointmentInfo.Fee,
            AppointmentId = appointmentInfo.Id,
            CreatedDate = DateOnly.FromDateTime(appointmentInfo.Date),
            PatientId = appointmentInfo.PatientId,
            Status = "Unpaid",
            IsConsultationPaid = false
          };

          _context.InvoiceInfos.Add(invoiceInfo);
          await _context.SaveChangesAsync();

          // Get the newly created invoiceId
          invoiceId = invoiceInfo.InvoiceId;
        }
      }
      catch (Exception ex)
      {
        var message = ex.ToString();
        throw;
      }

      // Create the response with appointment info and invoiceId
      var response = new AppointmentInvoiceResponse
      {
        AppointmentInfo = appointmentInfo,
        InvoiceId = invoiceId
      };

      return CreatedAtAction("GetAppointmentInfo", new { id = appointmentInfo.Id }, response);
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
