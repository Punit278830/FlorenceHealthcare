-- Debug script to check staff ID 14 role assignment
-- Run this to see what's happening with staff ID 14

-- Check current staff information
SELECT 
    si.StaffId,
    si.FirstName,
    si.LastName,
    si.Email,
    si.Designation,
    si.RoleId,
    si.HospitalId
FROM [StaffInfo] si
WHERE si.StaffId = 14;

-- Check if RoleId is properly assigned
SELECT 
    si.StaffId,
    si.FirstName + ' ' + ISNULL(si.LastName, '') as FullName,
    si.Designation,
    si.RoleId,
    rm.RoleName,
    rm.RoleDisplayName,
    rm.RoleDescription,
    h.Name as HospitalName
FROM [StaffInfo] si
LEFT JOIN [RoleMaster] rm ON si.RoleId = rm.RoleId
LEFT JOIN [Hospital] h ON si.HospitalId = h.HospitalId
WHERE si.StaffId = 14;

-- Check available SuperAdmin roles in the database
SELECT 
    rm.RoleId,
    rm.RoleName,
    rm.RoleDisplayName,
    rm.HospitalId,
    h.Name as HospitalName
FROM [RoleMaster] rm
INNER JOIN [Hospital] h ON rm.HospitalId = h.HospitalId
WHERE LOWER(rm.RoleName) = 'superadmin' 
    AND rm.IsActive = 1;

-- Update staff ID 14 to have SuperAdmin role (if exists)
-- First, find the correct SuperAdmin role for the staff's hospital
DECLARE @StaffHospitalId INT;
DECLARE @SuperAdminRoleId INT;

SELECT @StaffHospitalId = HospitalId FROM [StaffInfo] WHERE StaffId = 14;

SELECT @SuperAdminRoleId = RoleId 
FROM [RoleMaster] 
WHERE HospitalId = @StaffHospitalId 
    AND LOWER(RoleName) = 'superadmin' 
    AND IsActive = 1;

IF @SuperAdminRoleId IS NOT NULL
BEGIN
    UPDATE [StaffInfo] 
    SET RoleId = @SuperAdminRoleId 
    WHERE StaffId = 14;
    
    PRINT 'Staff ID 14 updated with SuperAdmin role ID: ' + CAST(@SuperAdminRoleId AS VARCHAR(10));
END
ELSE
BEGIN
    PRINT 'No SuperAdmin role found for hospital ID: ' + CAST(@StaffHospitalId AS VARCHAR(10));
    PRINT 'Available roles for this hospital:';
    
    SELECT 
        rm.RoleId,
        rm.RoleName,
        rm.RoleDisplayName
    FROM [RoleMaster] rm
    WHERE rm.HospitalId = @StaffHospitalId AND rm.IsActive = 1;
END

-- Verify the update
SELECT 
    si.StaffId,
    si.FirstName + ' ' + ISNULL(si.LastName, '') as FullName,
    si.Designation,
    si.RoleId,
    rm.RoleName,
    rm.RoleDisplayName,
    'Role assignment successful' as Status
FROM [StaffInfo] si
LEFT JOIN [RoleMaster] rm ON si.RoleId = rm.RoleId
WHERE si.StaffId = 14;
