-- Setup Global Super Admin - Manual Execution Script
-- This script is designed for manual execution in SQL Server Management Studio
-- Execute each section one by one, or select all and execute

-- Step 1: Modify RoleMaster table to allow NULL HospitalId
PRINT 'Step 1: Checking and modifying RoleMaster table structure...';

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

-- Step 3: Create Super Admin user (this section can be run independently)
PRINT 'Step 3: Creating Super Admin user...';

-- Get the GlobalSuperAdmin role ID (fresh lookup each time)
DECLARE @GlobalSuperAdminRoleId INT;
SELECT @GlobalSuperAdminRoleId = RoleId 
FROM [RoleMaster] 
WHERE RoleName = 'GlobalSuperAdmin' 
AND HospitalId IS NULL 
AND IsActive = 1;

IF @GlobalSuperAdminRoleId IS NULL
BEGIN
    PRINT 'ERROR: GlobalSuperAdmin role not found! Please run Step 2 first.';
END
ELSE
BEGIN
    PRINT 'Found GlobalSuperAdmin role ID: ' + CAST(@GlobalSuperAdminRoleId AS VARCHAR(10));
    
    -- Check if super admin user already exists
    IF NOT EXISTS (
        SELECT 1 FROM [StaffInfo] 
        WHERE RoleId = @GlobalSuperAdminRoleId 
        AND HospitalId IS NULL
    )
    BEGIN
        -- Create the super admin user
        INSERT INTO [StaffInfo] (
            FirstName, LastName, Email, Mobile, 
            Designation, RoleId, HospitalId, 
            ActiveStatus, Doj, Password,
            IdentityNumber, DepartmentId, Dob, Gender, Education
        )
        VALUES (
            'Global', 'SuperAdmin', 'superadmin@hospital.com', '1234567890',
            'Global Super Administrator', @GlobalSuperAdminRoleId, NULL,
            1, GETDATE(), 'SuperAdmin123!',
            'GLOBAL_SA_001', 1, '1980-01-01', 'Other', 'Administration'
        );
        
        PRINT 'Created Global Super Admin user successfully.';
        PRINT 'Email: superadmin@hospital.com';
        PRINT 'Password: SuperAdmin123!';
        PRINT 'Login using email as username.';
    END
    ELSE
    BEGIN
        PRINT 'Global Super Admin user already exists.';
    END
    
    -- Validation: Ensure only one GlobalSuperAdmin exists
    DECLARE @SuperAdminCount INT;
    SELECT @SuperAdminCount = COUNT(*) FROM [StaffInfo] 
    WHERE RoleId = @GlobalSuperAdminRoleId;
    
    IF @SuperAdminCount > 1
    BEGIN
        PRINT 'WARNING: Multiple users found with GlobalSuperAdmin role!';
        PRINT 'Total GlobalSuperAdmin users: ' + CAST(@SuperAdminCount AS VARCHAR(10));
        PRINT 'Please review and ensure only one GlobalSuperAdmin exists.';
    END
    ELSE
    BEGIN
        PRINT 'Validation passed: Only one GlobalSuperAdmin user exists.';
    END
END

-- Step 4: Display Summary
PRINT 'Step 4: Setup Summary...';
PRINT '========================';

-- Show the GlobalSuperAdmin role
SELECT 
    'GlobalSuperAdmin Role' as Item,
    RoleId,
    RoleName,
    RoleDisplayName,
    HospitalId,
    IsActive,
    CreatedDate
FROM [RoleMaster] 
WHERE RoleName = 'GlobalSuperAdmin';

-- Show the GlobalSuperAdmin user(s)
SELECT 
    'GlobalSuperAdmin User' as Item,
    s.StaffId,
    s.FirstName + ' ' + s.LastName as FullName,
    s.Email,
    s.Mobile,
    s.RoleId,
    s.HospitalId,
    s.ActiveStatus,
    s.Doj as CreatedDate
FROM [StaffInfo] s
INNER JOIN [RoleMaster] r ON s.RoleId = r.RoleId
WHERE r.RoleName = 'GlobalSuperAdmin' AND r.HospitalId IS NULL;

PRINT '========================';
PRINT 'Global Super Admin setup completed!';
PRINT 'You can now login with:';
PRINT 'Email: superadmin@hospital.com';
PRINT 'Password: SuperAdmin123!';
PRINT '========================';
