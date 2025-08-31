-- Simple script to set staff ID 14 as SuperAdmin
-- First run the migration script to add RoleId column if not done already

-- Check current state
SELECT 'BEFORE UPDATE:' as Stage, StaffId, FirstName, LastName, Designation, RoleId, HospitalId
FROM [StaffInfo] 
WHERE StaffId = 14;

-- Find the SuperAdmin role for the staff's hospital
DECLARE @HospitalId INT = (SELECT HospitalId FROM [StaffInfo] WHERE StaffId = 14);
DECLARE @SuperAdminRoleId INT = (
    SELECT TOP 1 RoleId 
    FROM [RoleMaster] 
    WHERE HospitalId = @HospitalId 
    AND LOWER(RoleName) = 'superadmin' 
    AND IsActive = 1
);

-- If no SuperAdmin role exists, create one
IF @SuperAdminRoleId IS NULL
BEGIN
    INSERT INTO [RoleMaster] (RoleName, RoleDisplayName, RoleDescription, HospitalId, IsActive, CreatedDate)
    VALUES ('SuperAdmin', 'Super Administrator', 'Super Administrator with full access', @HospitalId, 1, GETDATE());
    
    SET @SuperAdminRoleId = SCOPE_IDENTITY();
    PRINT 'Created new SuperAdmin role with ID: ' + CAST(@SuperAdminRoleId AS VARCHAR(10));
END

-- Update staff ID 14 with SuperAdmin role
UPDATE [StaffInfo] 
SET RoleId = @SuperAdminRoleId
WHERE StaffId = 14;

-- Verify the update
SELECT 'AFTER UPDATE:' as Stage, 
       si.StaffId, 
       si.FirstName, 
       si.LastName, 
       si.Designation, 
       si.RoleId, 
       si.HospitalId,
       rm.RoleName,
       rm.RoleDisplayName
FROM [StaffInfo] si
LEFT JOIN [RoleMaster] rm ON si.RoleId = rm.RoleId
WHERE si.StaffId = 14;

PRINT 'Staff ID 14 role update completed';
