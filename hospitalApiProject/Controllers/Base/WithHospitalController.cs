using Microsoft.AspNetCore.Mvc;
using hospitalApiProject.Models;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Controllers.Base
{
  [ApiController]
  public abstract class WithHospitalController : ControllerBase
  {
    protected readonly FlorenceDbContext _context;
    protected WithHospitalController(FlorenceDbContext context)
    {
      _context = context;
    }

    protected int? GetHospitalIdFromHeader()
    {
      if (Request.Headers.TryGetValue("X-Hospital-Id", out var values))
      {
        if (int.TryParse(values.FirstOrDefault(), out var hid))
          return hid;
      }
      return null; // null for backward compatibility
    }

    protected string GetTimeZoneFromHeader()
    {
      if (Request.Headers.TryGetValue("X-Time-Zone", out var values))
      {
        return values.FirstOrDefault() ?? "UTC";
      }
      return "UTC"; // Default to UTC if header is not present
    }

    // New method to check if current user is Super Admin
    protected async Task<Tuple<bool, int?>> IsSuperAdminAsync()
    {
      if (Request.Headers.TryGetValue("X-Staff-Id", out var staffIdValues))
      {
        if (int.TryParse(staffIdValues.FirstOrDefault(), out var staffId))
        {
          var staff = await _context.StaffInfos
            .Include(s => s.Role)  // Include the role information
            .Where(s => s.StaffId == staffId)
            .FirstOrDefaultAsync();
          
          if (staff?.Role != null)
          {
            // Check if user has GlobalSuperAdmin role OR legacy SuperAdmin designation
            return new Tuple<bool, int?>(
              staff.Role.RoleName?.ToLower() == "globalsuperadmin" ||
              staff.Role.RoleName?.ToLower() == "superadmin" ||
              staff.Designation?.ToLower() == "superadmin",
              staff.HospitalId
            );
          }
        }
      }
      return new Tuple<bool, int?>(false, null);
    }

    // Enhanced method that returns null for Super Admin (no hospital filtering)
    protected async Task<Tuple<bool, int?>> GetHospitalIdForFilteringAsync()
    {
      var isSuperAdmin = await IsSuperAdminAsync();
      
      // Super Admin sees everything - no hospital filtering
      if (isSuperAdmin.Item1 || isSuperAdmin.Item2 != null)
      {
        return new Tuple<bool, int?>(true, isSuperAdmin.Item2);
      }
      
      // Regular users are filtered by their hospital
      return new Tuple<bool, int?>(false, GetHospitalIdFromHeader());
    }
  }
}
