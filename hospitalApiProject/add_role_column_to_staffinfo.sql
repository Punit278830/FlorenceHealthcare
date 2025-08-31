-- Migration script to add RoleId column to StaffInfo table
-- Run this script on your database

-- Step 1: Add RoleId column to StaffInfo table (nullable)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[StaffInfo]') AND name = 'RoleId')
BEGIN
    ALTER TABLE [StaffInfo] 
    ADD [RoleId] INT NULL;
    
    PRINT 'RoleId column added to StaffInfo table';
END
ELSE
BEGIN
    PRINT 'RoleId column already exists in StaffInfo table';
END

-- Step 2: Add foreign key constraint
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_StaffInfo_RoleMaster')
BEGIN
    ALTER TABLE [StaffInfo]
    ADD CONSTRAINT [FK_StaffInfo_RoleMaster] 
    FOREIGN KEY ([RoleId]) REFERENCES [RoleMaster]([RoleId]);
    
    PRINT 'Foreign key constraint FK_StaffInfo_RoleMaster added';
END
ELSE
BEGIN
    PRINT 'Foreign key constraint FK_StaffInfo_RoleMaster already exists';
END

-- Step 3: Update existing staff with appropriate roles based on their designation
-- This will match staff with roles based on their current designation and hospital

UPDATE si 
SET RoleId = rm.RoleId
FROM [StaffInfo] si
INNER JOIN [RoleMaster] rm ON si.HospitalId = rm.HospitalId 
    AND LOWER(si.Designation) = LOWER(rm.RoleName)
WHERE si.RoleId IS NULL 
    AND rm.IsActive = 1;

PRINT 'Existing staff updated with appropriate roles based on designation';

-- Step 4: Show staff without roles (if any)
SELECT 
    si.StaffId,
    si.FirstName,
    si.LastName,
    si.Designation,
    si.HospitalId,
    'No matching role found' as Issue
FROM [StaffInfo] si
LEFT JOIN [RoleMaster] rm ON si.HospitalId = rm.HospitalId 
    AND LOWER(si.Designation) = LOWER(rm.RoleName)
    AND rm.IsActive = 1
WHERE si.RoleId IS NULL;

-- Step 5: Verify the update
SELECT 
    si.StaffId,
    si.FirstName + ' ' + si.LastName as FullName,
    si.Designation,
    rm.RoleName,
    rm.RoleDisplayName,
    h.Name as HospitalName
FROM [StaffInfo] si
LEFT JOIN [RoleMaster] rm ON si.RoleId = rm.RoleId
LEFT JOIN [Hospital] h ON si.HospitalId = h.HospitalId
ORDER BY h.Name, rm.RoleName, si.FirstName;

PRINT 'Migration completed successfully';

-- Step 6: Create a view for easier staff and role management
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_StaffWithRoles')
BEGIN
    DROP VIEW [vw_StaffWithRoles];
    PRINT 'Existing vw_StaffWithRoles view dropped';
END

CREATE VIEW [vw_StaffWithRoles] AS
SELECT 
    si.StaffId,
    si.FirstName,
    si.LastName,
    si.FirstName + ' ' + ISNULL(si.LastName, '') as FullName,
    si.Email,
    si.Mobile,
    si.Address,
    si.Designation,
    si.ActiveStatus,
    si.HospitalId,
    h.Name as HospitalName,
    si.RoleId,
    rm.RoleName,
    rm.RoleDisplayName,
    rm.RoleDescription,
    CASE 
        WHEN si.RoleId IS NOT NULL THEN rm.RoleName
        ELSE si.Designation
    END as EffectiveRole,
    si.DepartmentId,
    d.DepartmentName,
    si.ConsultationFee,
    si.Dob,
    si.Gender,
    si.Education,
    si.Doj,
    si.RegestrationNumber,
    si.PrescriptionValidity
FROM [StaffInfo] si
LEFT JOIN [RoleMaster] rm ON si.RoleId = rm.RoleId AND rm.IsActive = 1
LEFT JOIN [Hospital] h ON si.HospitalId = h.HospitalId AND h.IsActive = 1
LEFT JOIN [Department] d ON si.DepartmentId = d.DepartmentId
WHERE si.ActiveStatus = 1;

PRINT 'vw_StaffWithRoles view created successfully';

-- Step 7: Create a view for the RoleMaster as mentioned
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_RoleMaster')
BEGIN
    DROP VIEW [vw_RoleMaster];
    PRINT 'Existing vw_RoleMaster view dropped';
END

CREATE VIEW [vw_RoleMaster] AS
SELECT 
    rm.RoleId,
    rm.RoleName,
    rm.RoleDisplayName,
    rm.RoleDescription,
    rm.HospitalId,
    h.Name as HospitalName,
    rm.IsActive,
    rm.CreatedDate,
    rm.ModifiedDate
FROM [RoleMaster] rm
INNER JOIN [Hospital] h ON rm.HospitalId = h.HospitalId
WHERE rm.IsActive = 1 AND h.IsActive = 1;

PRINT 'vw_RoleMaster view created successfully';
