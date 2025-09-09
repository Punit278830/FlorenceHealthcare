using hospitalApiProject.Models;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services
{
  public interface ISuperAdminService
  {
    Task<bool> IsGlobalSuperAdminAsync(int staffId);
    Task<bool> CanCreateSuperAdminAsync();
    Task<bool> EnsureOnlyOneGlobalSuperAdminAsync();
    Task<StaffInfo?> GetGlobalSuperAdminAsync();
  }

  public class SuperAdminService : ISuperAdminService
  {
    private readonly FlorenceDbContext _context;

    public SuperAdminService(FlorenceDbContext context)
    {
      _context = context;
    }

    public async Task<bool> IsGlobalSuperAdminAsync(int staffId)
    {
      var staff = await _context.StaffInfos
        .Include(s => s.Role)
        .FirstOrDefaultAsync(s => s.StaffId == staffId);

      if (staff?.Role != null)
      {
        return staff.Role.RoleName?.ToLower() == "globalsuperadmin" ||
               staff.Role.RoleName?.ToLower() == "superadmin" ||
               staff.Designation?.ToLower() == "superadmin";
      }

      return false;
    }

    public async Task<bool> CanCreateSuperAdminAsync()
    {
      var existingSuperAdmin = await GetGlobalSuperAdminAsync();
      return existingSuperAdmin == null;
    }

    public async Task<bool> EnsureOnlyOneGlobalSuperAdminAsync()
    {
      var globalSuperAdminRole = await _context.RoleMasters
        .FirstOrDefaultAsync(r => r.RoleName == "GlobalSuperAdmin" && r.HospitalId == null);

      if (globalSuperAdminRole == null)
      {
        return true; // No global super admin role exists, so constraint is satisfied
      }

      var superAdmins = await _context.StaffInfos
        .Where(s => s.RoleId == globalSuperAdminRole.RoleId)
        .ToListAsync();

      if (superAdmins.Count <= 1)
      {
        return true; // 0 or 1 super admin is fine
      }

      // If more than one exists, keep the first one and remove others
      var keepSuperAdmin = superAdmins.First();
      var removeList = superAdmins.Skip(1).ToList();

      foreach (var staff in removeList)
      {
        // Convert them to regular admin or remove super admin privilege
        var adminRole = await _context.RoleMasters
          .FirstOrDefaultAsync(r => r.RoleName.ToLower() == "admin" && r.HospitalId == staff.HospitalId);

        if (adminRole != null)
        {
          staff.RoleId = adminRole.RoleId;
        }
        else
        {
          // Create a default admin role for their hospital
          var newAdminRole = new RoleMaster
          {
            RoleName = "Admin",
            RoleDisplayName = "Administrator",
            RoleDescription = "Hospital Administrator",
            HospitalId = staff.HospitalId.HasValue ? staff.HospitalId.Value : 1,
            IsActive = true,
            CreatedDate = DateTime.Now
          };
          _context.RoleMasters.Add(newAdminRole);
          await _context.SaveChangesAsync();
          
          staff.RoleId = newAdminRole.RoleId;
        }
      }

      await _context.SaveChangesAsync();
      return true;
    }

    public async Task<StaffInfo?> GetGlobalSuperAdminAsync()
    {
      var globalSuperAdminRole = await _context.RoleMasters
        .FirstOrDefaultAsync(r => r.RoleName == "GlobalSuperAdmin" && r.HospitalId == null);

      if (globalSuperAdminRole == null)
      {
        return null;
      }

      return await _context.StaffInfos
        .Include(s => s.Role)
        .FirstOrDefaultAsync(s => s.RoleId == globalSuperAdminRole.RoleId);
    }
  }
}
