-- Setup Global Super Admin - Fixed for Manual Execution
-- Run this script in SQL Server Management Studio
-- This script handles variable scope properly for manual execution

-- Step 1: Modify RoleMaster table to allow NULL HospitalId
PRINT 'Step 1: Checking RoleMaster table structure...';

IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'RoleMaster' 
    AND COLUMN_NAME = 'HospitalId' 
    AND IS_NULLABLE = 'NO'
)
BEGIN
    PRINT 'Modifying RoleMaster.HospitalId to allow NULL values...';
    ALTER TABLE RoleMaster ALTER COLUMN HospitalId INT NULL;
    PRINT 'RoleMaster.HospitalId is now nullable.';
END
ELSE
BEGIN
    PRINT 'RoleMaster.HospitalId already allows NULL values.';
END

-- Step 2: Create GlobalSuperAdmin role if it doesn't exist
PRINT 'Step 2: Creating GlobalSuperAdmin role...';

IF NOT EXISTS (SELECT 1 FROM [RoleMaster] WHERE RoleName = 'GlobalSuperAdmin' AND HospitalId IS NULL)
BEGIN
    INSERT INTO [RoleMaster] (RoleName, RoleDisplayName, RoleDescription, HospitalId, IsActive, CreatedDate)
    VALUES ('GlobalSuperAdmin', 'Global Super Administrator', 'Global Super Administrator with access to all hospitals and data', NULL, 1, GETDATE());
    
    PRINT 'Created GlobalSuperAdmin role successfully.';
END
ELSE
BEGIN
    PRINT 'GlobalSuperAdmin role already exists.';
END
GO

-- Step 3: Create the Super Admin user (separate batch to handle variables properly)
DECLARE @GlobalSuperAdminRoleId INT;

-- Get the GlobalSuperAdmin role ID
SELECT @GlobalSuperAdminRoleId = RoleId 
FROM [RoleMaster] 
WHERE RoleName = 'GlobalSuperAdmin' 
AND HospitalId IS NULL 
AND IsActive = 1;

IF @GlobalSuperAdminRoleId IS NULL
BEGIN
    PRINT 'ERROR: Could not find GlobalSuperAdmin role!';
    RETURN;
END

PRINT 'GlobalSuperAdmin role ID: ' + CAST(@GlobalSuperAdminRoleId AS VARCHAR(10));

-- Check if super admin user already exists
IF NOT EXISTS (
    SELECT 1 FROM [StaffInfo] 
    WHERE RoleId = @GlobalSuperAdminRoleId 
    AND HospitalId IS NULL
)
BEGIN
    -- Create the super admin user
    INSERT INTO [StaffInfo] (
        FirstName, LastName, Email, Phone, 
        Designation, RoleId, HospitalId, 
        ActiveStatus, CreatedDate,
        Username, Password,
        IdentityNumber
    )
    VALUES (
        'Global', 'SuperAdmin', 'superadmin@hospital.com', '1234567890',
        'Global Super Administrator', @GlobalSuperAdminRoleId, NULL,
        1, GETDATE(),
        'superadmin', 'SuperAdmin123!',
        'GLOBAL_SA_001'
    );
    
    PRINT 'Created Global Super Admin user successfully.';
    PRINT 'Username: superadmin';
    PRINT 'Password: SuperAdmin123!';
    PRINT 'Email: superadmin@hospital.com';
END
ELSE
BEGIN
    PRINT 'Global Super Admin user already exists.';
END

-- Validation: Ensure only one GlobalSuperAdmin exists
DECLARE @SuperAdminCount INT;
SELECT @SuperAdminCount = COUNT(*) FROM [StaffInfo] WHERE RoleId = @GlobalSuperAdminRoleId;

IF @SuperAdminCount > 1
BEGIN
    PRINT 'WARNING: Multiple users found with GlobalSuperAdmin role!';
    PRINT 'Total GlobalSuperAdmin users: ' + CAST(@SuperAdminCount AS VARCHAR(10));
END
ELSE
BEGIN
    PRINT 'Validation passed: Only one GlobalSuperAdmin user exists.';
END

-- Summary
PRINT '========================';
PRINT 'Setup Summary:';
PRINT '========================';

SELECT 
    'GlobalSuperAdmin Role' as ItemType,
    RoleId,
    RoleName,
    RoleDisplayName,
    HospitalId,
    IsActive,
    CreatedDate
FROM [RoleMaster] 
WHERE RoleName = 'GlobalSuperAdmin';

SELECT 
    'GlobalSuperAdmin User' as ItemType,
    StaffId,
    FirstName + ' ' + LastName as FullName,
    Username,
    Email,
    RoleId,
    HospitalId,
    ActiveStatus,
    CreatedDate
FROM [StaffInfo] 
WHERE RoleId = @GlobalSuperAdminRoleId;

PRINT '========================';
PRINT 'Global Super Admin setup completed successfully!';
PRINT 'You can now login with:';
PRINT 'Username: superadmin';
PRINT 'Password: SuperAdmin123!';
PRINT '========================';
GO
