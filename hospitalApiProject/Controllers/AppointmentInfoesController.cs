using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AppointmentInfoesController : WithHospitalController
  {
    public AppointmentInfoesController(FlorenceDbContext context) : base(context)
    {
    }
    // Get Appointment Data by  Current date 
    // GET: api/AppointmentInfoes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentInfo>>> GetAppointmentInfos()
    {
      // return await _context.AppointmentInfos.ToListAsync();
      var currentDate = DateTime.Now.Date;
      var hospitalIdTuple = await GetSelectedHospitalIdAsync(); // Super Admin sees all hospitals
      var hospitalId = hospitalIdTuple.Item2; // Extract the hospital ID from the tuple
      var appointmentInfo = await _context.AppointmentInfos
          .Where(a => a.IsDeleted != true && (hospitalId == null || a.HospitalId == hospitalId))
          .OrderByDescending(p => p.Id)
          .ToListAsync();

      if (appointmentInfo == null || !appointmentInfo.Any()) // Check if appointments were found
      {
        //return NotFound();
        return Ok(new { message = "No records found" });
      }

      return appointmentInfo;
    }

    [HttpGet("count")]
    public async Task<ActionResult<int>> GetAppointmentCount()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var userTimeZone = GetTimeZoneFromHeader(); // Get user's timezone from header
      
      // Get user's timezone info
      TimeZoneInfo timeZoneInfo;
      try
      {
        timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(userTimeZone);
      }
      catch
      {
        // Fallback to UTC if timezone is not found
        timeZoneInfo = TimeZoneInfo.Utc;
      }
      
      // Get today's date in user's timezone
      var utcNow = DateTime.UtcNow;
      var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
      var todayStart = localNow.Date;
      var todayEnd = todayStart.AddDays(1);
      
      // Convert back to UTC for database query (assuming appointments are stored in UTC)
      var todayStartUtc = TimeZoneInfo.ConvertTimeToUtc(todayStart, timeZoneInfo);
      var todayEndUtc = TimeZoneInfo.ConvertTimeToUtc(todayEnd, timeZoneInfo);

      var appointmentCount = await _context.AppointmentInfos
          .Where(e => e.Date >= todayStartUtc && e.Date < todayEndUtc && (hospitalId == null || e.HospitalId == hospitalId))
          .CountAsync();



      if (appointmentCount == 0) // Check if appointments were found
      {
        return Ok(appointmentCount);
      }

      return Ok(appointmentCount);
    }


    //Count of Consultation 
    [HttpGet("ConsultationCount")]
    public async Task<ActionResult<int>> GetConsultationCount()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var userTimeZone = GetTimeZoneFromHeader();
      
      // Get user's timezone info
      TimeZoneInfo timeZoneInfo;
      try
      {
        timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(userTimeZone);
      }
      catch
      {
        timeZoneInfo = TimeZoneInfo.Utc;
      }
      
      // Get today's date range in user's timezone, then convert to UTC
      var utcNow = DateTime.UtcNow;
      var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
      var todayStart = localNow.Date;
      var todayEnd = todayStart.AddDays(1);
      var todayStartUtc = TimeZoneInfo.ConvertTimeToUtc(todayStart, timeZoneInfo);
      var todayEndUtc = TimeZoneInfo.ConvertTimeToUtc(todayEnd, timeZoneInfo);
      
      var appointmentCount = await _context.AppointmentInfos
          .Where(e => e.Date >= todayStartUtc && e.Date < todayEndUtc && e.AppointmentStatus == "Active" && e.IsDeleted != true && (hospitalId == null || e.HospitalId == hospitalId))
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
      var hospitalId = GetHospitalIdFromHeader();
      var userTimeZone = GetTimeZoneFromHeader();
      
      // Get user's timezone info
      TimeZoneInfo timeZoneInfo;
      try
      {
        timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(userTimeZone);
      }
      catch
      {
        timeZoneInfo = TimeZoneInfo.Utc;
      }
      
      // Get today's date range in user's timezone, then convert to UTC
      var utcNow = DateTime.UtcNow;
      var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
      var todayStart = localNow.Date;
      var todayEnd = todayStart.AddDays(1);
      var todayStartUtc = TimeZoneInfo.ConvertTimeToUtc(todayStart, timeZoneInfo);
      var todayEndUtc = TimeZoneInfo.ConvertTimeToUtc(todayEnd, timeZoneInfo);
      
      var appointmentCount = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.AppointmentStatus == "Active" && e.Date >= todayStartUtc && e.Date < todayEndUtc && e.IsDeleted != true && (hospitalId == null || e.HospitalId == hospitalId))
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
      var hospitalId = GetHospitalIdFromHeader();
      var Earning = 0;
      var appointments = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.AppointmentStatus == "Active" && e.IsDeleted != true && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();

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
      var hospitalId = GetHospitalIdFromHeader();
      var Earning = 0;
      var appointments = await _context.AppointmentInfos
          .Where(a => a.IsDeleted != true && (hospitalId == null || a.HospitalId == hospitalId))
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
      var hospitalId = GetHospitalIdFromHeader();
      var userTimeZone = GetTimeZoneFromHeader();
      
      // Get user's timezone info
      TimeZoneInfo timeZoneInfo;
      try
      {
        timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(userTimeZone);
      }
      catch
      {
        timeZoneInfo = TimeZoneInfo.Utc;
      }
      
      // Get today's date range in user's timezone, then convert to UTC
      var utcNow = DateTime.UtcNow;
      var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
      var todayStart = localNow.Date;
      var todayEnd = todayStart.AddDays(1);
      var todayStartUtc = TimeZoneInfo.ConvertTimeToUtc(todayStart, timeZoneInfo);
      var todayEndUtc = TimeZoneInfo.ConvertTimeToUtc(todayEnd, timeZoneInfo);
      
      var TodayEarning = 0;
      var appointments = await _context.AppointmentInfos
          .Where(e => e.Date >= todayStartUtc && e.Date < todayEndUtc && e.IsDeleted != true && (hospitalId == null || e.HospitalId == hospitalId)).ToListAsync();

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
      DateTime currentDate = DateTime.UtcNow.Date;
      int? TodayEarning = 0;
      var hospitalId = GetHospitalIdFromHeader();
      var totalAmount = await _context.InvoiceInfos
        .Join(_context.AppointmentInfos, V1 => V1.AppointmentId, V2 => V2.Id, (v1, v2) => new { v1, v2 })
          .Where(e => e.v1.IsConsultationPaid == true && e.v2.DoctorId == id && e.v1.CreatedDate.HasValue && e.v1.CreatedDate.Value.Date == currentDate && (hospitalId == null || e.v1.HospitalId == hospitalId))
          .ToListAsync();

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
      var hospitalId = GetHospitalIdFromHeader();
      var appointmentInfo = await _context.AppointmentInfos
          .Where(a => a.Id == id && a.IsDeleted != true && (hospitalId == null || a.HospitalId == hospitalId))
          .FirstOrDefaultAsync();

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
      var hospitalId = GetHospitalIdFromHeader();
      var userTimeZone = GetTimeZoneFromHeader();
      
      // Get user's timezone info
      TimeZoneInfo timeZoneInfo;
      try
      {
        timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(userTimeZone);
      }
      catch
      {
        timeZoneInfo = TimeZoneInfo.Utc;
      }
      
      // Get today's date range in user's timezone, then convert to UTC
      var utcNow = DateTime.UtcNow;
      var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
      var todayStart = localNow.Date;
      var todayEnd = todayStart.AddDays(1);
      var todayStartUtc = TimeZoneInfo.ConvertTimeToUtc(todayStart, timeZoneInfo);
      var todayEndUtc = TimeZoneInfo.ConvertTimeToUtc(todayEnd, timeZoneInfo);
      
      var appointmentInfo = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.Date >= todayStartUtc && e.Date < todayEndUtc && e.IsDeleted != true && (hospitalId == null || e.HospitalId == hospitalId))
          .ToListAsync();

      if (appointmentInfo == null || !appointmentInfo.Any()) // Check if appointments were found
      {
        return NotFound();
      }

      return appointmentInfo;
    }

    // Get Appointment Data by Doctor Id and particular date 
    [HttpGet("doctor/{id}/{from}/{to}")]
    public async Task<ActionResult> GetAppointmentByDoctorId(int id, DateTime from, DateTime to)
    {

      var hospitalId = GetHospitalIdFromHeader();
      var appointmentInfo = await _context.AppointmentInfos
          .Where(e => e.DoctorId == id && e.Date >= from && e.Date <= to && e.IsDeleted != true && (hospitalId == null || e.HospitalId == hospitalId))
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
                IsConsultationPaid = invoice.IsConsultationPaid,     // to show the payment status in appoinment list get the consultationpaid data here
                ScheduledByid = appointment.ScheduledByid,
                Date = appointment.Date,
                Notes = appointment.Notes,
                AppointTime = appointment.AppointTime,
                AppointmentStatus = appointment.AppointmentStatus,
                Fee = appointment.Fee,
              }
          )
          .ToListAsync();



      if (appointmentInfo == null) // Check if appointments were found
      {
        return NotFound();
      }

      return Ok(appointmentInfo);
    }

    //Get Appointment Data for a purticular Date 
    [HttpGet("date/{from}/{to}")]
    public async Task<ActionResult> GetAppointmentByDate(DateTime from, DateTime to)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var appointmentWithInvoices = await _context.AppointmentInfos
          .Where(e => e.Date >= from && e.Date <= to && e.IsDeleted != true && (hospitalId == null || e.HospitalId == hospitalId))
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
      DateTime? previousAppointmentDate = null;
      bool isRepeatWithin6Days = false;
      try
      {
        var hospitalId = GetHospitalIdFromHeader();
        appointmentInfo.HospitalId = hospitalId; // tag appointment
        // Add and save the appointment information
        _context.AppointmentInfos.Add(appointmentInfo);
        await _context.SaveChangesAsync();

        // Check for previous appointment within prescription validity window (forward or backward)
        var lastAppointment = await _context.AppointmentInfos
            .Where(a => a.PatientId == appointmentInfo.PatientId && a.Id != appointmentInfo.Id)
            .OrderByDescending(a => a.Date)
            .FirstOrDefaultAsync();

        var StaffInfo = await _context.StaffInfos
            .Where(s => s.StaffId == appointmentInfo.DoctorId)
            .FirstOrDefaultAsync();

        int prescriptionValidity = StaffInfo?.PrescriptionValidity ?? 6; // Default to 6 if null

        if (lastAppointment != null)
        {
          var daysDiff = (appointmentInfo.Date - lastAppointment.Date).TotalDays;
          // If the new appointment is within prescription validity window (forward or backward), do not charge
          if (Math.Abs(daysDiff) <= prescriptionValidity && daysDiff != 0)
          {
            isRepeatWithin6Days = true;
            previousAppointmentDate = lastAppointment.Date;
          }
        }

        // Create and save the invoice information
        var invoiceInfo = new InvoiceInfo()
        {
          Amount = isRepeatWithin6Days ? 0 : appointmentInfo.Fee,
          AppointmentId = appointmentInfo.Id,
          CreatedDate = DateTime.UtcNow, // Use UTC for consistency
          PatientId = appointmentInfo.PatientId,
          Status = "Unpaid",
          IsConsultationPaid = isRepeatWithin6Days ? true : false,
          HospitalId = hospitalId
        };

        _context.InvoiceInfos.Add(invoiceInfo);
        await _context.SaveChangesAsync();

        // Get the newly created invoiceId
        invoiceId = invoiceInfo.InvoiceId;
      }
      catch (Exception ex)
      {
        var message = ex.ToString();
        throw;
      }

      // Create the response with appointment info, invoiceId, and previous appointment date
      var response = new AppointmentInvoiceResponse
      {
        AppointmentInfo = appointmentInfo,
        InvoiceId = invoiceId,
        PreviousAppointmentDate = previousAppointmentDate
      };

      return CreatedAtAction("GetAppointmentInfo", new { id = appointmentInfo.Id }, response);
    }

    // DELETE: api/AppointmentInfoes/5 (Soft Delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointmentInfo(int id)
    {
        var appointmentInfo = await _context.AppointmentInfos
            .Where(a => a.Id == id && a.IsDeleted != true)
            .FirstOrDefaultAsync();
            
        if (appointmentInfo == null)
        {
            return NotFound(new { message = "Appointment not found or already deleted." });
        }

        // Check if appointment is already deleted
        if (appointmentInfo.IsDeleted == true)
        {
            return BadRequest(new { message = "Appointment is already deleted." });
        }

        try
        {
            // Soft delete the appointment
            appointmentInfo.IsDeleted = true;
            appointmentInfo.DeletedDate = DateTime.UtcNow;
            // Note: You can add DeletedBy field based on current user context
            // appointmentInfo.DeletedBy = GetCurrentUserId(); 

            // Also soft delete related invoices
            var relatedInvoices = await _context.InvoiceInfos
                .Where(i => i.AppointmentId == id && (i.IsDeleted == null || i.IsDeleted != true))
                .ToListAsync();

            foreach (var invoice in relatedInvoices)
            {
                invoice.IsDeleted = true;
                invoice.DeletedDate = DateTime.UtcNow;
                // invoice.DeletedBy = GetCurrentUserId();
            }

            // Update entities instead of removing them
            _context.AppointmentInfos.Update(appointmentInfo);
            if (relatedInvoices.Any())
            {
                _context.InvoiceInfos.UpdateRange(relatedInvoices);
            }

            await _context.SaveChangesAsync();

            return Ok(new { 
                success = true,
                message = $"Appointment (ID: {id}) has been successfully deleted along with {relatedInvoices.Count} related invoice(s).",
                appointmentId = id,
                deletedInvoicesCount = relatedInvoices.Count,
                deletedDate = appointmentInfo.DeletedDate
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                success = false,
                message = "An error occurred while deleting the appointment.",
                error = ex.Message 
            });
        }
    }

    private bool AppointmentInfoExists(int id)
    {
      return _context.AppointmentInfos.Any(e => e.Id == id && e.IsDeleted != true);
    }
    [HttpGet("appointmentList/{patientId}/{year}")]
    public async Task<ActionResult<IEnumerable<AppointmentInfo>>> AppointmentListByPatientId(int patientId, int year)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var appointmentInfo = await _context.AppointmentInfos
     .Where(e => e.PatientId == patientId && e.Date.Year == year && e.IsDeleted != true && (hospitalId == null || e.HospitalId == hospitalId))
     .ToListAsync();

      if (appointmentInfo == null)
      {
        return NotFound();
      }

      return appointmentInfo;


    }

    [HttpPost("Search")]
    public async Task<SearchResponseBase<AppointmentInfoResponse>> SearchAppointments([FromBody] AppointmentSearch criteria)
    {
        var response = new SearchResponseBase<AppointmentInfoResponse>();
        try
        {
            var hospitalId = await GetSelectedHospitalIdAsync(); // Super Admin sees all hospitals
            
            // Base appointments query (server-side filtering + sorting, then paginate)
            var appointmentsQuery = _context.AppointmentInfos
                .AsNoTracking()
                .Where(a => a.IsDeleted != true && (!hospitalId.Item2.HasValue || a.HospitalId == hospitalId.Item2))
                .AsQueryable();

            // Date filters:
            // - If from/to provided: filter by Appointment.Date (date only)
            // - If not provided: do NOT apply any date filter (return all)
            if (!string.IsNullOrWhiteSpace(criteria.FromDate) && DateTime.TryParse(criteria.FromDate, out var fromDate)
                && !string.IsNullOrWhiteSpace(criteria.ToDate) && DateTime.TryParse(criteria.ToDate, out var toDate))
            {
                fromDate = fromDate.Date;
                toDate = toDate.Date;
                appointmentsQuery = appointmentsQuery.Where(a => a.Date.Date >= fromDate && a.Date.Date <= toDate);
            }

            // Filter by appointment status
            if (criteria.AppointmentStatus.HasValue && criteria.AppointmentStatus.Value != AppointmentStatus.All)
            {
                var status = criteria.AppointmentStatus.Value.ToString();
                appointmentsQuery = appointmentsQuery.Where(a => a.AppointmentStatus != null && a.AppointmentStatus.ToLower() == status.ToLower());
            }

            // Filter by doctor
            if (criteria.DoctorId.HasValue && criteria.DoctorId.Value > 0)
            {
                appointmentsQuery = appointmentsQuery.Where(a => a.DoctorId == criteria.DoctorId.Value);
            }

            // Search by patient name or general search term (only within the filtered hospital)
            if (!string.IsNullOrWhiteSpace(criteria.PatientName) || !string.IsNullOrWhiteSpace(criteria.SearchTerm))
            {
                var searchTerm = !string.IsNullOrWhiteSpace(criteria.PatientName) ? criteria.PatientName : criteria.SearchTerm;
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    // Filter patients by hospital first, then by search term
                    appointmentsQuery = appointmentsQuery.Where(a => 
                        _context.PatientInfos.Any(p => p.PatientId == a.PatientId && 
                            (!hospitalId.Item2.HasValue || p.HospitalId == hospitalId.Item2) && // Ensure patient belongs to the same hospital
                            ((p.FirstName != null && p.FirstName.ToLower().Contains(searchTerm.ToLower())) || 
                             (p.LastName != null && p.LastName.ToLower().Contains(searchTerm.ToLower())) ||
                             (p.Mobile != null && p.Mobile.Contains(searchTerm)))));
                }
            }

            // Sorting
            if (!string.IsNullOrEmpty(criteria.SortFieldName))
            {
                if ((SortDirection)criteria.SortDirection == SortDirection.Descending)
                    appointmentsQuery = appointmentsQuery.OrderByDescending(e => EF.Property<object>(e, criteria.SortFieldName));
                else
                    appointmentsQuery = appointmentsQuery.OrderBy(e => EF.Property<object>(e, criteria.SortFieldName));
            }
            else
            {
                appointmentsQuery = appointmentsQuery.OrderByDescending(e => e.Id);
            }

            // Total count BEFORE paging
            var totalCount = await appointmentsQuery.CountAsync();

            // Paging
            var pageNumber = criteria.PageNumber <= 0 ? 1 : criteria.PageNumber;
            var pageSize = criteria.PageSize <= 0 ? 50 : criteria.PageSize; // Smaller default page size for appointments
            var skip = (pageNumber - 1) * pageSize;

            // Select minimal fields for the current page
            var pageAppointments = await appointmentsQuery
                .Skip(skip)
                .Take(pageSize)
                .Select(a => new {
                    a.Id,
                    a.PatientId,
                    a.DoctorId,
                    a.Departmentid,
                    a.Date,
                    AppointTime = a.AppointTime,
                    a.AppointmentStatus,
                    a.Notes,
                    a.HospitalId,
                    a.Fee,
                   
                })
                .ToListAsync();

            var patientIds = pageAppointments.Select(a => a.PatientId).Distinct().ToList();
            var doctorIds = pageAppointments.Select(a => a.DoctorId).Distinct().ToList();
            var departmentIds = pageAppointments.Where(a => a.Departmentid.HasValue).Select(a => a.Departmentid!.Value).Distinct().ToList();
            var hospitalIds = pageAppointments.Where(a => a.HospitalId.HasValue).Select(a => a.HospitalId!.Value).Distinct().ToList();
            var appointmentIds = pageAppointments.Select(a => a.Id).Distinct().ToList();

            // Load related data for the selected appointments (single round trip per set)
            var patients = await _context.PatientInfos
                .AsNoTracking()
                .Where(p => patientIds.Contains(p.PatientId))
                .Select(p => new { p.PatientId, p.FirstName, p.LastName, p.Mobile, p.Gender, p.Dob })
                .ToListAsync();

            var doctors = await _context.StaffInfos
                .AsNoTracking()
                .Where(s => doctorIds.Contains(s.StaffId))
                .Select(s => new { s.StaffId, s.FirstName, s.LastName })
                .ToListAsync();

            var departments = await _context.DepartmentInfos
                .AsNoTracking()
                .Where(d => departmentIds.Contains(d.DepartmentId))
                .Select(d => new { d.DepartmentId, d.DepartmentName, d.DisplayName })
                .ToListAsync();

            var hospitals = await _context.Hospitals
                .AsNoTracking()
                .Where(h => hospitalIds.Contains(h.HospitalId))
                .Select(h => new { h.HospitalId, h.Name })
                .ToListAsync();

            // Load invoice information to determine payment status
            var invoices = await _context.InvoiceInfos
                .AsNoTracking()
                .Where(i => appointmentIds.Contains(i.AppointmentId) && i.IsDeleted != true)
                .Select(i => new { i.AppointmentId, i.IsConsultationPaid })
                .ToListAsync();

            // Create lookup dictionaries
            var patientDict = patients.ToDictionary(p => p.PatientId, p => p);
            var doctorDict = doctors.ToDictionary(d => d.StaffId, d => d);
            var departmentDict = departments.ToDictionary(d => d.DepartmentId, d => d);
            var hospitalDict = hospitals.ToDictionary(h => h.HospitalId, h => h);
            var invoiceDict = invoices.ToDictionary(i => i.AppointmentId, i => i);

            var results = pageAppointments.Select(a =>
            {
                var patient = patientDict.TryGetValue(a.PatientId, out var p) ? p : null;
                var doctor = doctorDict.TryGetValue(a.DoctorId, out var d) ? d : null;
                var department = a.Departmentid.HasValue && departmentDict.TryGetValue(a.Departmentid.Value, out var dept) ? dept : null;
                var hospital = a.HospitalId.HasValue && hospitalDict.TryGetValue(a.HospitalId.Value, out var h) ? h : null;
                var invoice = invoiceDict.TryGetValue(a.Id, out var inv) ? inv : null;

                var age = patient?.Dob != null ? 
                    DateTime.Now.Year - patient.Dob.Year - (DateTime.Now.DayOfYear < patient.Dob.DayOfYear ? 1 : 0) : 
                    (int?)null;

                return new AppointmentInfoResponse
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientName = patient != null ? $"{patient.FirstName} {patient.LastName}".Trim() : "Unknown",
                    PatientMobile = patient?.Mobile ?? "",
                    DoctorId = a.DoctorId,
                    DoctorName = doctor != null ? $"{doctor.FirstName} {doctor.LastName}".Trim() : "Unknown",
                    Date = a.Date,
                    Time = a.AppointTime ?? "",
                    AppointmentStatus = a.AppointmentStatus ?? "Unknown",
                    Reason = department?.DisplayName ?? department?.DepartmentName ?? "General", // Use department as reason/service
                    Notes = a.Notes,
                    HospitalId = a.HospitalId ?? 0,
                    HospitalName = hospital?.Name ?? "Unknown",
                    CreatedDate = null, // Not available in current model
                    Gender = patient?.Gender ?? "",
                    Dob = patient?.Dob,
                    Age = age,
                    IsConsultationPaid = invoice?.IsConsultationPaid ?? false,
                    Fee = a.Fee,
                    DepartmentName = department?.DepartmentName ?? "General"
                };
            }).ToList();

            response.Results = results;
            response.TotalCount = totalCount;
            response.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            response.ErrorMessage = "";

            return response;
        }
        catch (Exception ex)
        {
            response.ErrorMessage = $"Error searching appointments: {ex.Message}";
            response.Results = new List<AppointmentInfoResponse>();
            response.TotalCount = 0;
            response.TotalPages = 0;
            return response;
        }
    }

  
  }
}
