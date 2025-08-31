-- Manual SQL script to add missing columns to Hospital table
-- Run this manually if Entity Framework migration fails

-- Add IsDeleted column
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Hospital' AND COLUMN_NAME = 'IsDeleted')
BEGIN
    ALTER TABLE Hospital ADD IsDeleted BIT NULL DEFAULT 0;
    PRINT 'IsDeleted column added to Hospital table';
END
ELSE
BEGIN
    PRINT 'IsDeleted column already exists';
END

-- Add ModifiedOn column
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Hospital' AND COLUMN_NAME = 'ModifiedOn')
BEGIN
    ALTER TABLE Hospital ADD ModifiedOn DATETIME2 NULL;
    PRINT 'ModifiedOn column added to Hospital table';
END
ELSE
BEGIN
    PRINT 'ModifiedOn column already exists';
END

-- Add ModifiedBy column
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Hospital' AND COLUMN_NAME = 'ModifiedBy')
BEGIN
    ALTER TABLE Hospital ADD ModifiedBy NVARCHAR(100) NULL;
    PRINT 'ModifiedBy column added to Hospital table';
END
ELSE
BEGIN
    PRINT 'ModifiedBy column already exists';
END

-- Update existing records to have proper defaults
UPDATE Hospital 
SET IsDeleted = 0 
WHERE IsDeleted IS NULL;

PRINT 'Hospital table columns updated successfully';

-- Verify the columns exist
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Hospital' 
AND COLUMN_NAME IN ('IsDeleted', 'ModifiedOn', 'ModifiedBy')
ORDER BY COLUMN_NAME;
