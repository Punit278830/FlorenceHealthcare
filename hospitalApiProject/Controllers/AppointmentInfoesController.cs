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

    private static DateTime GetCurrentISTDate()
    {
      TimeZoneInfo indiaTimeZone;
      try
      {
        indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"); // Windows
      }
      catch (TimeZoneNotFoundException)
      {
        indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata"); // Linux
      }

      return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indiaTimeZone).Date;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentInfo>>> GetAppointmentInfos()
    {
      var appointmentInfo = await _context.AppointmentInfos.OrderByDescending(p => p.Id).ToListAsync();

      if (appointmentInfo == null || !appointmentInfo.Any())
        return Ok(new { message = "No records found" });

      return appointmentInfo;
    }

    [HttpGet("count")]
    public async Task<ActionResult<int>> GetAppointmentCount()
    {
      var currentDate = GetCurrentISTDate();
      var appointmentCount = await _context.AppointmentInfos
          .Where(e => e.Date == currentDate)
          .CountAsync();

      if (appointmentCount == 0)
        return Ok(new { message = "No appointments found for the current date" });

      return Ok(appointmentCount);
    }

    [HttpGet("count/{id}")]
    public async Task<ActionResult<int>> GetAppointmentCount(int id)
    {
      var currentDate = GetCurrentISTDate();
      var appointmentCount = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.Date == currentDate)
          .CountAsync();

      if (appointmentCount == 0)
        return Ok(new { message = "No appointments found for the current date" });

      return Ok(appointmentCount);
    }

    [HttpGet("ConsultationCount")]
    public async Task<ActionResult<int>> GetConsultationCount()
    {
      var currentDate = GetCurrentISTDate();
      var appointmentCount = await _context.AppointmentInfos
          .Where(e => e.Date == currentDate && e.AppointmentStatus == "Active")
          .CountAsync();

      if (appointmentCount == 0)
        return Ok(new { message = "No consultation found for the current date" });

      return Ok(appointmentCount);
    }

    [HttpGet("ConsultationCount/{id}")]
    public async Task<ActionResult<int>> GetConsultationCount(int id)
    {
      var currentDate = GetCurrentISTDate();
      var appointmentCount = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.AppointmentStatus == "Active" && e.Date == currentDate)
          .CountAsync();

      if (appointmentCount == 0)
        return Ok(new { message = "No consultation found for the current date" });

      return Ok(appointmentCount);
    }

    [HttpGet("Earning/{id}")]
    public async Task<ActionResult<int>> GetEarning(int id)
    {
      var appointments = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.AppointmentStatus == "Active")
          .ToListAsync();

      if (!appointments.Any())
        return Ok(new { message = "No consultation found for the current date" });

      var Earning = appointments.Sum(appointment => appointment.Fee);
      return Ok(Earning);
    }

    [HttpGet("TotalEarning/")]
    public async Task<ActionResult<int>> GetEarning()
    {
      var appointments = await _context.AppointmentInfos.ToListAsync();

      if (!appointments.Any())
        return Ok(new { message = "No consultation found for the current date" });

      var Earning = appointments.Sum(appointment => appointment.Fee);
      return Ok(Earning);
    }

    [HttpGet("TodayEarning/")]
    public async Task<ActionResult<int>> GetTodayEarning()
    {
      var currentDate = GetCurrentISTDate();
      var appointments = await _context.AppointmentInfos
          .Where(e => e.Date == currentDate)
          .ToListAsync();

      if (!appointments.Any())
        return Ok(new { message = "No consultation found for the current date" });

      var TodayEarning = appointments.Sum(appointment => appointment.Fee);
      return Ok(TodayEarning);
    }

    [HttpGet("TotalEarnings/Doctor/{id}")]
    public async Task<ActionResult<int>> GetTodayEarningDoctor(int id)
    {
      var currentDate = DateOnly.FromDateTime(GetCurrentISTDate());
      var totalAmount = await _context.InvoiceInfos
          .Join(_context.AppointmentInfos, V1 => V1.AppointmentId, V2 => V2.Id, (v1, v2) => new { v1, v2 })
          .Where(e => e.v1.IsConsultationPaid == true && e.v2.DoctorId == id && e.v1.CreatedDate == currentDate)
          .ToListAsync();

      if (totalAmount.Count == 0)
        return Ok(new { message = "No consultation found for the current date" });

      var TodayEarning = totalAmount.Sum(item => item.v1.Amount);
      return Ok(TodayEarning);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppointmentInfo>> GetAppointmentInfo(int id)
    {
      var appointmentInfo = await _context.AppointmentInfos.FindAsync(id);

      if (appointmentInfo == null)
        return NotFound();

      return appointmentInfo;
    }

    [HttpGet("doctor/{id}")]
    public async Task<ActionResult<IEnumerable<AppointmentInfo>>> GetAppointmentByDoctorId(int id)
    {
      var currentDate = GetCurrentISTDate();
      var appointmentInfo = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.Date == currentDate)
          .ToListAsync();

      if (!appointmentInfo.Any())
        return NotFound();

      return appointmentInfo;
    }

    [HttpGet("doctor/{id}/{from}/{to}")]
    public async Task<ActionResult> GetAppointmentByDoctorId(int id, DateTime from, DateTime to)
    {
      var appointmentInfo = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.Date >= from && e.Date <= to)
          .Join(_context.InvoiceInfos,
                appointment => appointment.Id,
                invoice => invoice.AppointmentId,
                (appointment, invoice) => new AppointmentWithInvoiceDto
                {
                  Id = appointment.Id,
                  PatientId = appointment.PatientId,
                  Departmentid = appointment.Departmentid,
                  DoctorId = appointment.DoctorId,
                  IsConsultationPaid = invoice.IsConsultationPaid,
                  ScheduledByid = appointment.ScheduledByid,
                  Date = appointment.Date,
                  Notes = appointment.Notes,
                  AppointTime = appointment.AppointTime,
                  AppointmentStatus = appointment.AppointmentStatus,
                  Fee = appointment.Fee,
                })
          .ToListAsync();

      if (appointmentInfo == null)
        return NotFound();

      return Ok(appointmentInfo);
    }

    [HttpGet("date/{from}/{to}")]
    public async Task<ActionResult> GetAppointmentByDate(DateTime from, DateTime to)
    {
      var appointmentWithInvoices = await _context.AppointmentInfos
          .Where(e => e.Date >= from && e.Date <= to)
          .Join(_context.InvoiceInfos,
                appointment => appointment.Id,
                invoice => invoice.AppointmentId,
                (appointment, invoice) => new AppointmentWithInvoiceDto
                {
                  Id = appointment.Id,
                  PatientId = appointment.PatientId,
                  Departmentid = appointment.Departmentid,
                  DoctorId = appointment.DoctorId,
                  IsConsultationPaid = invoice.IsConsultationPaid,
                  ScheduledByid = appointment.ScheduledByid,
                  Date = appointment.Date,
                  Notes = appointment.Notes,
                  AppointTime = appointment.AppointTime,
                  AppointmentStatus = appointment.AppointmentStatus,
                  Fee = appointment.Fee,
                })
          .ToListAsync();

      if (appointmentWithInvoices == null)
        return NotFound();

      return Ok(appointmentWithInvoices);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAppointmentInfo(int id, AppointmentInfo appointmentInfo)
    {
      if (id != appointmentInfo.Id)
        return BadRequest();

      _context.Entry(appointmentInfo).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!AppointmentInfoExists(id))
          return NotFound();
        else
          throw;
      }

      return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentInvoiceResponse>> PostAppointmentInfo(AppointmentInfo appointmentInfo)
    {
      int invoiceId = 0;

      try
      {
        _context.AppointmentInfos.Add(appointmentInfo);
        await _context.SaveChangesAsync();

        var lastAppointment = await _context.AppointmentInfos
            .Where(a => a.PatientId == appointmentInfo.PatientId && a.Id != appointmentInfo.Id)
            .OrderByDescending(a => a.Date)
            .FirstOrDefaultAsync();

        bool isRepeatWithin6Days = false;
        if (lastAppointment != null)
        {
          var daysDiff = (appointmentInfo.Date - lastAppointment.Date).TotalDays;
          if (daysDiff > 0 && daysDiff <= 6)
            isRepeatWithin6Days = true;
        }

        var invoiceInfo = new InvoiceInfo()
        {
          Amount = isRepeatWithin6Days ? 0 : appointmentInfo.Fee,
          AppointmentId = appointmentInfo.Id,
          CreatedDate = DateOnly.FromDateTime(appointmentInfo.Date),
          PatientId = appointmentInfo.PatientId,
          Status = "Unpaid",
          IsConsultationPaid = isRepeatWithin6Days
        };

        _context.InvoiceInfos.Add(invoiceInfo);
        await _context.SaveChangesAsync();
        invoiceId = invoiceInfo.InvoiceId;
      }
      catch (Exception ex)
      {
        var message = ex.ToString();
        throw;
      }

      var response = new AppointmentInvoiceResponse
      {
        AppointmentInfo = appointmentInfo,
        InvoiceId = invoiceId
      };

      return CreatedAtAction("GetAppointmentInfo", new { id = appointmentInfo.Id }, response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointmentInfo(int id)
    {
      var appointmentInfo = await _context.AppointmentInfos.FindAsync(id);
      if (appointmentInfo == null)
        return NotFound();

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
        return NotFound();

      return appointmentInfo;
    }
  }
}
