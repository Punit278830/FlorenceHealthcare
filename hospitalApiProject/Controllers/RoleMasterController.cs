using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleMasterController : WithHospitalController
    {
        public RoleMasterController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/RoleMaster
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleMaster>>> GetRoles()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.RoleMasters.AsQueryable();
            
            if (hospitalId != null)
            {
                query = query.Where(r => r.HospitalId == hospitalId);
            }
            
            return await query.Where(r => r.IsActive).OrderBy(r => r.RoleName).ToListAsync();
        }

        // GET: api/RoleMaster/GetRolesByHospital/1
        [HttpGet("GetRolesByHospital/{hospitalId}")]
        public async Task<ActionResult<IEnumerable<RoleMaster>>> GetRolesByHospital(int hospitalId)
        {
            var currentHospitalId = GetHospitalIdFromHeader();
            
            // Only super admins can view roles for different hospitals
            var userRole = await GetCurrentUserRole();
            if (userRole?.RoleName.ToLower() != "superadmin" && hospitalId != currentHospitalId)
            {
                return Forbid("Access denied. Only Super Admins can view roles for other hospitals.");
            }

            var roles = await _context.RoleMasters
                .Where(r => r.HospitalId == hospitalId && r.IsActive)
                .OrderBy(r => r.RoleName)
                .ToListAsync();

            return Ok(roles);
        }

        // GET: api/RoleMaster/GetUserRole/5
        [HttpGet("GetUserRole/{staffId}")]
        public async Task<ActionResult<RoleMaster>> GetUserRole(int staffId)
        {
            var hospitalId = GetHospitalIdFromHeader();
            
            var staff = await _context.StaffInfos
                .Include(s => s.Role)
                .Where(s => s.StaffId == staffId && (hospitalId == null || s.HospitalId == hospitalId))
                .FirstOrDefaultAsync();

            if (staff == null)
            {
                return NotFound("Staff member not found");
            }

            // If staff has a direct role assignment, use it
            if (staff.Role != null && staff.Role.IsActive)
            {
                return Ok(staff.Role);
            }

            // Fallback: Get role based on staff designation (for backward compatibility)
            var role = await _context.RoleMasters
                .Where(r => r.HospitalId == staff.HospitalId && 
                           r.RoleName.ToLower() == staff.Designation.ToLower() && 
                           r.IsActive)
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return NotFound("Role not found for this staff member");
            }

            return Ok(role);
        }

        // GET: api/RoleMaster/CheckSuperAdmin/5
        [HttpGet("CheckSuperAdmin/{staffId}")]
        public async Task<ActionResult<bool>> CheckSuperAdmin(int staffId)
        {
            var hospitalId = GetHospitalIdFromHeader();
            
            var staff = await _context.StaffInfos
                .Where(s => s.StaffId == staffId && (hospitalId == null || s.HospitalId == hospitalId))
                .FirstOrDefaultAsync();

            if (staff == null)
            {
                return NotFound("Staff member not found");
            }

            var isSuperAdmin = staff.Designation.ToLower() == "superadmin";
            return Ok(isSuperAdmin);
        }

        // GET: api/RoleMaster/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleMaster>> GetRole(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var role = await _context.RoleMasters
                .Where(r => r.RoleId == id && (hospitalId == null || r.HospitalId == hospitalId))
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return NotFound();
            }

            return role;
        }

        // POST: api/RoleMaster
        [HttpPost]
        public async Task<ActionResult<RoleMaster>> CreateRole(RoleMaster role)
        {
            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null)
            {
                role.HospitalId = hospitalId.Value;
            }

            role.CreatedDate = DateTime.UtcNow;
            role.IsActive = true;

            _context.RoleMasters.Add(role);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRole), new { id = role.RoleId }, role);
        }

        // PUT: api/RoleMaster/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleMaster role)
        {
            if (id != role.RoleId)
            {
                return BadRequest();
            }

            var hospitalId = GetHospitalIdFromHeader();
            var existingRole = await _context.RoleMasters
                .Where(r => r.RoleId == id && (hospitalId == null || r.HospitalId == hospitalId))
                .FirstOrDefaultAsync();

            if (existingRole == null)
            {
                return NotFound();
            }

            existingRole.RoleName = role.RoleName;
            existingRole.RoleDisplayName = role.RoleDisplayName;
            existingRole.RoleDescription = role.RoleDescription;
            existingRole.IsActive = role.IsActive;
            existingRole.ModifiedDate = DateTime.UtcNow;
            existingRole.ModifiedBy = role.ModifiedBy;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
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

        // DELETE: api/RoleMaster/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var role = await _context.RoleMasters
                .Where(r => r.RoleId == id && (hospitalId == null || r.HospitalId == hospitalId))
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return NotFound();
            }

            // Soft delete
            role.IsActive = false;
            role.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/RoleMaster/AssignRoleToStaff
        [HttpPost("AssignRoleToStaff")]
        public async Task<ActionResult> AssignRoleToStaff([FromBody] AssignRoleRequest request)
        {
            var hospitalId = GetHospitalIdFromHeader();
            
            // Get staff member
            var staff = await _context.StaffInfos
                .Where(s => s.StaffId == request.StaffId && (hospitalId == null || s.HospitalId == hospitalId))
                .FirstOrDefaultAsync();

            if (staff == null)
            {
                return NotFound("Staff member not found");
            }

            // Get role
            var role = await _context.RoleMasters
                .Where(r => r.RoleId == request.RoleId && r.HospitalId == staff.HospitalId && r.IsActive)
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return NotFound("Role not found or not available for this hospital");
            }

            // Assign role
            staff.RoleId = request.RoleId;
            
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Role assigned successfully", StaffId = staff.StaffId, RoleId = role.RoleId, RoleName = role.RoleName });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error assigning role: {ex.Message}");
            }
        }

        // GET: api/RoleMaster/GetStaffWithRoles
        [HttpGet("GetStaffWithRoles")]
        public async Task<ActionResult<IEnumerable<object>>> GetStaffWithRoles()
        {
            var hospitalId = GetHospitalIdFromHeader();
            
            var staffWithRoles = await _context.StaffInfos
                .Include(s => s.Role)
                .Where(s => hospitalId == null || s.HospitalId == hospitalId)
                .Select(s => new
                {
                    s.StaffId,
                    s.FirstName,
                    s.LastName,
                    s.Email,
                    s.Designation,
                    s.HospitalId,
                    Role = s.Role != null ? new
                    {
                        s.Role.RoleId,
                        s.Role.RoleName,
                        s.Role.RoleDisplayName
                    } : null
                })
                .ToListAsync();

            return Ok(staffWithRoles);
        }

        private bool RoleExists(int id)
        {
            return _context.RoleMasters.Any(e => e.RoleId == id);
        }

        private Task<RoleMaster?> GetCurrentUserRole()
        {
            // This would need to be implemented based on your authentication system
            // For now, returning null - you'll need to implement this based on your auth token/session
            return Task.FromResult<RoleMaster?>(null);
        }
    }

    public class AssignRoleRequest
    {
        public int StaffId { get; set; }
        public int RoleId { get; set; }
    }
}
