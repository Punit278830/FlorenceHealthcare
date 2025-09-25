using hospitalApiProject.Controllers.Base;
using hospitalApiProject.Models;
using hospitalApiProject.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SuperAdminController : WithHospitalController
  {
    private readonly ISuperAdminService _superAdminService;

    public SuperAdminController(FlorenceDbContext context, ISuperAdminService superAdminService) : base(context)
    {
      _superAdminService = superAdminService;
    }

    // GET: api/SuperAdmin/check
    [HttpGet("check")]
    public async Task<ActionResult<object>> CheckSuperAdminStatus()
    {
      try
      {
        var (isSuperAdmin, _) = await GetSelectedHospitalIdAsync();
        var globalSuperAdmin = await _superAdminService.GetGlobalSuperAdminAsync();
        
        return Ok(new 
        { 
          isCurrentUserSuperAdmin = isSuperAdmin,
          globalSuperAdminExists = globalSuperAdmin != null,
          globalSuperAdminInfo = globalSuperAdmin != null ? new 
          {
            staffId = globalSuperAdmin.StaffId,
            name = $"{globalSuperAdmin.FirstName} {globalSuperAdmin.LastName}",
            designation = globalSuperAdmin.Designation,
            hospitalId = globalSuperAdmin.HospitalId
          } : null
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }

    // POST: api/SuperAdmin/setup
    [HttpPost("setup")]
    public async Task<ActionResult> SetupGlobalSuperAdmin([FromBody] SetupSuperAdminRequest request)
    {
      try
      {
        // Only allow if no global super admin exists yet
        var canCreate = await _superAdminService.CanCreateSuperAdminAsync();
        if (!canCreate)
        {
          return BadRequest("A Global Super Admin already exists in the system.");
        }

        // Get the staff member to promote
        var staff = await _context.StaffInfos.FindAsync(request.StaffId);
        if (staff == null)
        {
          return NotFound("Staff member not found.");
        }

        // Get or create GlobalSuperAdmin role
        var globalSuperAdminRole = await _context.RoleMasters
          .FirstOrDefaultAsync(r => r.RoleName == "GlobalSuperAdmin" && r.HospitalId == null);

        if (globalSuperAdminRole == null)
        {
          globalSuperAdminRole = new RoleMaster
          {
            RoleName = "GlobalSuperAdmin",
            RoleDisplayName = "Global Super Administrator",
            RoleDescription = "Global Super Administrator with access to all hospitals and data",
            HospitalId = null,
            IsActive = true,
            CreatedDate = DateTime.Now
          };
          _context.RoleMasters.Add(globalSuperAdminRole);
          await _context.SaveChangesAsync();
        }

        // Update staff to Global Super Admin
        staff.RoleId = globalSuperAdminRole.RoleId;
        staff.HospitalId = null; // Global Super Admin is not tied to any hospital
        staff.Designation = "Global Super Administrator";

        await _context.SaveChangesAsync();

        // Ensure only one Global Super Admin exists
        await _superAdminService.EnsureOnlyOneGlobalSuperAdminAsync();

        return Ok(new { message = $"Staff {staff.FirstName} {staff.LastName} has been set as Global Super Administrator." });
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }

    // GET: api/SuperAdmin/hospitals
    [HttpGet("hospitals")]
    public async Task<ActionResult<object>> GetAvailableHospitals()
    {
      try
      {
        var hospitals = await GetAvailableHospitalsAsync();
        return Ok(new { hospitals = hospitals });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { error = ex.Message });
      }
    }

    // GET: api/SuperAdmin/all-data-summary
    [HttpGet("all-data-summary")]
    public async Task<ActionResult<object>> GetAllDataSummary()
    {
      try
      {
        var (isSuperAdmin, _) = await GetSelectedHospitalIdAsync();
        if (!isSuperAdmin)
        {
          return Forbid("Only Super Admin can access this endpoint.");
        }

        var summary = new
        {
          totalStaff = await _context.StaffInfos.CountAsync(),
          totalPatients = await _context.PatientInfos.CountAsync(),
          totalAppointments = await _context.AppointmentInfos.CountAsync(),
          totalInvoices = await _context.InvoiceInfos.CountAsync(),
          hospitalCount = await _context.StaffInfos
            .Where(s => s.HospitalId != null)
            .Select(s => s.HospitalId)
            .Distinct()
            .CountAsync()
        };

        return Ok(summary);
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }

    // GET: api/SuperAdmin/test-hospital-context
    [HttpGet("test-hospital-context")]
    public async Task<ActionResult<object>> TestHospitalContext()
    {
      try
      {
        var userInfo = await IsSuperAdminAsync();
        var headerHospitalId = GetHospitalIdFromHeader();
        var (isSuperAdmin, selectedHospitalId) = await GetSelectedHospitalIdAsync();
        
        return Ok(new 
        { 
          userType = userInfo.Item1 ? "Super Admin" : "Regular User",
          userAssignedHospitalId = userInfo.Item2,
          headerHospitalId = headerHospitalId,
          finalSelectedHospitalId = selectedHospitalId,
          isSuperAdmin = isSuperAdmin,
          message = userInfo.Item1 ? 
            "Super admin can switch hospitals via X-Hospital-Id header" : 
            "Regular user is locked to their assigned hospital"
        });
      }
      catch (Exception ex)
      {
        return Ok(new { error = ex.Message, requiresHospitalSelection = true });
      }
    }
  }

  public class SetupSuperAdminRequest
  {
    public int StaffId { get; set; }
  }
}
