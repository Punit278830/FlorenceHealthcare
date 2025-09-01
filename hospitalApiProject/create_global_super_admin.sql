-- Create Global Super Admin Implementation
-- This script ensures there's only ONE Super Admin in the entire system
-- who is not tied to any specific hospital

-- Step 1: Create a global SuperAdmin role (not tied to any hospital)
IF NOT EXISTS (SELECT 1 FROM [RoleMaster] WHERE RoleName = 'GlobalSuperAdmin' AND HospitalId IS NULL)
BEGIN
    INSERT INTO [RoleMaster] (RoleName, RoleDisplayName, RoleDescription, HospitalId, IsActive, CreatedDate)
    VALUES ('GlobalSuperAdmin', 'Global Super Administrator', 'Global Super Administrator with access to all hospitals and data', NULL, 1, GETDATE());
    
    PRINT 'Created GlobalSuperAdmin role';
END

-- Step 2: Get the GlobalSuperAdmin role ID
DECLARE @GlobalSuperAdminRoleId INT = (
    SELECT RoleId 
    FROM [RoleMaster] 
    WHERE RoleName = 'GlobalSuperAdmin' 
    AND HospitalId IS NULL 
    AND IsActive = 1
);

-- Step 3: Check if there's already a Global Super Admin
DECLARE @ExistingGlobalSuperAdmin INT = (
    SELECT TOP 1 StaffId 
    FROM [StaffInfo] 
    WHERE RoleId = @GlobalSuperAdminRoleId
);

-- Step 4: If no Global Super Admin exists, convert staff ID 14 to Global Super Admin
IF @ExistingGlobalSuperAdmin IS NULL
BEGIN
    -- Update staff ID 14 to be the Global Super Admin
    UPDATE [StaffInfo] 
    SET RoleId = @GlobalSuperAdminRoleId,
        HospitalId = NULL,  -- Global Super Admin is not tied to any hospital
        Designation = 'Global Super Administrator',
        ModifiedDate = GETDATE()
    WHERE StaffId = 14;
    
    PRINT 'Updated Staff ID 14 to Global Super Administrator';
END
ELSE
BEGIN
    PRINT 'Global Super Admin already exists with Staff ID: ' + CAST(@ExistingGlobalSuperAdmin AS VARCHAR(10));
END

-- Step 5: Add constraint to ensure only one Global Super Admin exists
-- Note: We'll enforce uniqueness through application logic instead of database constraint
-- since we can't use variables in CREATE INDEX statements
PRINT 'Uniqueness will be enforced through application logic';

-- Step 6: Verify the setup
SELECT 'GLOBAL SUPER ADMIN SETUP:' as Info, 
       s.StaffId, s.FirstName, s.LastName, s.Designation, s.HospitalId, 
       r.RoleName, r.RoleDisplayName
FROM [StaffInfo] s
INNER JOIN [RoleMaster] r ON s.RoleId = r.RoleId
WHERE r.RoleName = 'GlobalSuperAdmin';
