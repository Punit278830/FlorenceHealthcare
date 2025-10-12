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
          
          // Add debugging logs
          Console.WriteLine($"[DEBUG] IsSuperAdminAsync - Staff ID: {staffId}");
          Console.WriteLine($"[DEBUG] IsSuperAdminAsync - Staff found: {staff != null}");
          Console.WriteLine($"[DEBUG] IsSuperAdminAsync - Staff Hospital ID: {staff?.HospitalId}");
          Console.WriteLine($"[DEBUG] IsSuperAdminAsync - Staff Designation: {staff?.Designation}");
          Console.WriteLine($"[DEBUG] IsSuperAdminAsync - Staff Role: {staff?.Role?.RoleName}");
          
          if (staff != null)
          {
            // Check if user has GlobalSuperAdmin role OR legacy SuperAdmin designation
            bool isSuperAdmin = (staff.Role?.RoleName?.ToLower() == "globalsuperadmin" ||
                                staff.Role?.RoleName?.ToLower() == "superadmin" ||
                                staff.Designation?.ToLower() == "superadmin");
                                
            Console.WriteLine($"[DEBUG] IsSuperAdminAsync - Is Super Admin: {isSuperAdmin}");
            
            return new Tuple<bool, int?>(isSuperAdmin, staff.HospitalId);
          }
          else
          {
            Console.WriteLine($"[ERROR] IsSuperAdminAsync - Staff not found for ID: {staffId}");
          }
        }
        else
        {
          Console.WriteLine($"[ERROR] IsSuperAdminAsync - Invalid Staff ID in header: {staffIdValues.FirstOrDefault()}");
        }
      }
      else
      {
        Console.WriteLine($"[ERROR] IsSuperAdminAsync - No X-Staff-Id header found");
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

    // New method that handles hospital filtering for both regular users and super admins
    protected async Task<Tuple<bool, int?>> GetSelectedHospitalIdAsync()
    {
      var userInfo = await IsSuperAdminAsync(); // (isSuperAdmin, userHospitalId)
      var headerHospitalId = GetHospitalIdFromHeader();
      
      // Add debugging logs
      Console.WriteLine($"[DEBUG] GetSelectedHospitalIdAsync - Staff ID from header: {Request.Headers["X-Staff-Id"].FirstOrDefault()}");
      Console.WriteLine($"[DEBUG] GetSelectedHospitalIdAsync - Is Super Admin: {userInfo.Item1}");
      Console.WriteLine($"[DEBUG] GetSelectedHospitalIdAsync - User Hospital ID from DB: {userInfo.Item2}");
      Console.WriteLine($"[DEBUG] GetSelectedHospitalIdAsync - Header Hospital ID: {headerHospitalId}");
      
      // SUPER ADMIN LOGIC
      if (userInfo.Item1) // Is Super Admin
      {
        // Super admins can switch hospitals via header
        if (headerHospitalId.HasValue)
        {
          return new Tuple<bool, int?>(true, headerHospitalId.Value);
        }
        
        // If no hospital selected in header, require explicit hospital selection
        // Super admins should not have a default hospital to avoid confusion
        throw new InvalidOperationException("Super admin must select a hospital. Please select a hospital from the hospital selector.");
      }
      
      // REGULAR USER LOGIC  
      // Regular users are always tied to their assigned hospital
      // However, if the database doesn't have the hospitalId, we can use the header as fallback
      var assignedHospitalId = userInfo.Item2; // Hospital from staff record
      
      if (!assignedHospitalId.HasValue)
      {
        // FALLBACK: If staff record doesn't have hospital ID, use header hospital ID
        if (headerHospitalId.HasValue)
        {
          Console.WriteLine($"[DEBUG] Using header hospital ID as fallback: {headerHospitalId.Value}");
          return new Tuple<bool, int?>(false, headerHospitalId.Value);
        }
        
        throw new InvalidOperationException("User is not assigned to any hospital. Please contact administrator.");
      }
      
      return new Tuple<bool, int?>(false, assignedHospitalId.Value);
    }

    // Helper method to get available hospitals for super admin hospital switching
    protected async Task<List<object>> GetAvailableHospitalsAsync()
    {
      var userInfo = await IsSuperAdminAsync();
      
      if (!userInfo.Item1) // Not super admin
      {
        // Regular users can only see their own hospital
        if (userInfo.Item2.HasValue)
        {
          var userHospital = await _context.Hospitals
            .Where(h => h.HospitalId == userInfo.Item2.Value && h.IsDeleted != true)
            .Select(h => new { h.HospitalId, HospitalName = h.Name })
            .FirstOrDefaultAsync();
            
          return userHospital != null ? new List<object> { userHospital } : new List<object>();
        }
        return new List<object>();
      }
      
      // Super admin can see all active hospitals
      return await _context.Hospitals
        .Where(h => h.IsDeleted != true)
        .Select(h => new { h.HospitalId, HospitalName = h.Name })
        .Cast<object>()
        .ToListAsync();
    }
  }
}
