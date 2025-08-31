-- Migration script to add IsDeleted and audit columns to Hospital table
-- Run this script on your database

-- Step 1: Add IsDeleted column to Hospital table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Hospital]') AND name = 'IsDeleted')
BEGIN
    ALTER TABLE [Hospital] 
    ADD [IsDeleted] BIT NOT NULL DEFAULT 0;
    
    PRINT 'IsDeleted column added to Hospital table';
END
ELSE
BEGIN
    PRINT 'IsDeleted column already exists in Hospital table';
END

-- Step 2: Add ModifiedOn column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Hospital]') AND name = 'ModifiedOn')
BEGIN
    ALTER TABLE [Hospital] 
    ADD [ModifiedOn] DATETIME2 NULL;
    
    PRINT 'ModifiedOn column added to Hospital table';
END
ELSE
BEGIN
    PRINT 'ModifiedOn column already exists in Hospital table';
END

-- Step 3: Add ModifiedBy column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Hospital]') AND name = 'ModifiedBy')
BEGIN
    ALTER TABLE [Hospital] 
    ADD [ModifiedBy] NVARCHAR(100) NULL;
    
    PRINT 'ModifiedBy column added to Hospital table';
END
ELSE
BEGIN
    PRINT 'ModifiedBy column already exists in Hospital table';
END

-- Step 4: Update existing hospitals to ensure they are not marked as deleted
UPDATE [Hospital] 
SET IsDeleted = 0 
WHERE IsDeleted IS NULL;

PRINT 'Existing hospitals updated with IsDeleted = 0';

-- Step 5: Show current hospital status
SELECT 
    HospitalId,
    Name,
    IsActive,
    IsDeleted,
    CreatedOn,
    ModifiedOn,
    ModifiedBy,
    CASE 
        WHEN IsDeleted = 1 THEN 'Deleted'
        WHEN IsActive = 0 THEN 'Deactivated'
        WHEN IsActive = 1 THEN 'Active'
        ELSE 'Unknown'
    END as Status
FROM [Hospital]
ORDER BY Name;

PRINT 'Hospital table migration completed successfully';
