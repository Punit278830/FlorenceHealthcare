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
        [HttpGet("roles/{hospitalId}")]
        public async Task<ActionResult<IEnumerable<RoleMaster>>> GetRoles(int hospitalId)
        {
            // Load all active roles regardless of hospital for simplicity
            var roles = await _context.RoleMasters
                .Where(r => r.IsActive && r.HospitalId != hospitalId)
                .OrderBy(r => r.HospitalId)
                .ThenBy(r => r.RoleName)
                .ToListAsync();
            
            return Ok(roles);
        }

        // GET: api/RoleMaster/GetRolesByHospital/1
        [HttpGet("GetRolesByHospital/{hospitalId}")]
        public async Task<ActionResult<IEnumerable<RoleMaster>>> GetRolesByHospital(int hospitalId)
        {
            // Allow loading roles for any hospital without authentication checks
            // Exclude super admin roles from dropdown selections
            var roles = await _context.RoleMasters
                .Where(r => (r.HospitalId == hospitalId || r.HospitalId == null) && r.IsActive
                    && r.RoleName.ToLower() != "superadmin" 
                    && r.RoleName.ToLower() != "globalsuperadmin")
                .OrderBy(r => r.RoleName)
                .ToListAsync();

            return Ok(roles);
        }

        // GET: api/RoleMaster/GetUserRole/5
        [HttpGet("GetUserRole/{staffId}")]
        public async Task<ActionResult<RoleMaster>> GetUserRole(int staffId)
        {
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            
            // For super admin context, don't apply hospital filtering when looking up staff
            var staff = isSuperAdmin 
                ? await _context.StaffInfos
                    .Include(s => s.Role)
                    .Where(s => s.StaffId == staffId)
                    .FirstOrDefaultAsync()
                : await _context.StaffInfos
                    .Include(s => s.Role)
                    .Where(s => s.StaffId == staffId && s.HospitalId == hospitalId)
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
            // For super admin context, don't filter by hospital
            var role = isSuperAdmin
                ? await _context.RoleMasters
                    .Where(r => r.RoleName.ToLower() == staff.Designation.ToLower() && r.IsActive)
                    .FirstOrDefaultAsync()
                : await _context.RoleMasters
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
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            
            var staff = await _context.StaffInfos
                .Where(s => s.StaffId == staffId && (hospitalId == null || s.HospitalId == hospitalId))
                .FirstOrDefaultAsync();

            if (staff == null)
            {
                return NotFound("Staff member not found");
            }

            var isStaffSuperAdmin = staff.Designation.ToLower() == "superadmin";
            return Ok(isStaffSuperAdmin);
        }

        // GET: api/RoleMaster/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleMaster>> GetRole(int id)
        {
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
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
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
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

            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
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
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
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
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            
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
            var (isSuperAdmin, hospitalId) = await GetSelectedHospitalIdAsync();
            
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

        // POST: api/RoleMaster/SeedDefaultRoles
        [HttpPost("SeedDefaultRoles")]
        public async Task<ActionResult> SeedDefaultRoles()
        {
            try
            {
                // Get all hospitals
                var hospitals = await _context.Hospitals.Where(h => h.IsActive == true).ToListAsync();
                
                if (!hospitals.Any())
                {
                    // Add a default hospital if none exists
                    var defaultHospital = new Hospital
                    {
                        Name = "Default Hospital",
                        AddressLine1 = "Default Address",
                        ContactNumber = "1234567890",
                        Email = "default@hospital.com",
                        IsActive = true,
                        CreatedOn = DateTime.UtcNow
                    };
                    _context.Hospitals.Add(defaultHospital);
                    await _context.SaveChangesAsync();
                    hospitals.Add(defaultHospital);
                }

                var roleTemplates = new[]
                {
                    new { Name = "SuperAdmin", DisplayName = "Super Administrator", Description = "Full system access with all permissions" },
                    new { Name = "Admin", DisplayName = "Administrator", Description = "Hospital administrator with management permissions" },
                    new { Name = "Doctor", DisplayName = "Doctor", Description = "Medical practitioner with patient consultation permissions" },
                    new { Name = "Nurse", DisplayName = "Nurse", Description = "Nursing staff with patient care access" },
                    new { Name = "Receptionist", DisplayName = "Receptionist", Description = "Front desk operations and appointment scheduling" }
                };

                foreach (var hospital in hospitals)
                {
                    foreach (var template in roleTemplates)
                    {
                        var existingRole = await _context.RoleMasters
                            .FirstOrDefaultAsync(r => r.HospitalId == hospital.HospitalId && r.RoleName == template.Name);

                        if (existingRole == null)
                        {
                            var role = new RoleMaster
                            {
                                RoleName = template.Name,
                                RoleDisplayName = template.DisplayName,
                                RoleDescription = template.Description,
                                HospitalId = hospital.HospitalId,
                                IsActive = true,
                                CreatedDate = DateTime.UtcNow
                            };
                            _context.RoleMasters.Add(role);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Default roles seeded successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error seeding roles: {ex.Message}" });
            }
        }

        private bool RoleExists(int id)
        {
            return _context.RoleMasters.Any(e => e.RoleId == id);
        }
    }

    public class AssignRoleRequest
    {
        public int StaffId { get; set; }
        public int RoleId { get; set; }
    }
}
