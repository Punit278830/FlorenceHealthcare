-- Create RoleMaster table with hospital-specific roles
-- This table defines user roles within each hospital for multi-tenant support

CREATE TABLE [RoleMaster] (
    [RoleId] int NOT NULL IDENTITY(1,1),
    [RoleName] varchar(50) NOT NULL,
    [RoleDisplayName] varchar(100) NOT NULL,
    [RoleDescription] varchar(255) NULL,
    [HospitalId] int NOT NULL,
    [IsActive] bit NOT NULL DEFAULT 1,
    [CreatedDate] datetime2 NOT NULL DEFAULT GETDATE(),
    [CreatedBy] int NULL,
    [ModifiedDate] datetime2 NULL,
    [ModifiedBy] int NULL,
    CONSTRAINT [PK_RoleMaster] PRIMARY KEY ([RoleId]),
    CONSTRAINT [FK_RoleMaster_Hospital] FOREIGN KEY ([HospitalId]) REFERENCES [Hospital] ([HospitalId]) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX [IX_RoleMaster_HospitalId] ON [RoleMaster] ([HospitalId]);
CREATE INDEX [IX_RoleMaster_RoleName] ON [RoleMaster] ([RoleName]);
CREATE UNIQUE INDEX [UX_RoleMaster_HospitalId_RoleName] ON [RoleMaster] ([HospitalId], [RoleName]);

-- Insert default roles for all existing hospitals
INSERT INTO [RoleMaster] ([RoleName], [RoleDisplayName], [RoleDescription], [HospitalId], [IsActive])
SELECT 
    'SuperAdmin' as RoleName,
    'Super Administrator' as RoleDisplayName,
    'Full system access with all permissions across the hospital' as RoleDescription,
    h.HospitalId,
    1 as IsActive
FROM [Hospital] h
WHERE h.IsActive = 1;

INSERT INTO [RoleMaster] ([RoleName], [RoleDisplayName], [RoleDescription], [HospitalId], [IsActive])
SELECT 
    'Admin' as RoleName,
    'Administrator' as RoleDisplayName,
    'Hospital administrator with management permissions' as RoleDescription,
    h.HospitalId,
    1 as IsActive
FROM [Hospital] h
WHERE h.IsActive = 1;

INSERT INTO [RoleMaster] ([RoleName], [RoleDisplayName], [RoleDescription], [HospitalId], [IsActive])
SELECT 
    'Receptionist' as RoleName,
    'Receptionist' as RoleDisplayName,
    'Front desk operations including patient registration and appointment scheduling' as RoleDescription,
    h.HospitalId,
    1 as IsActive
FROM [Hospital] h
WHERE h.IsActive = 1;

INSERT INTO [RoleMaster] ([RoleName], [RoleDisplayName], [RoleDescription], [HospitalId], [IsActive])
SELECT 
    'Nurse' as RoleName,
    'Nurse' as RoleDisplayName,
    'Nursing staff with patient care and medical record access' as RoleDescription,
    h.HospitalId,
    1 as IsActive
FROM [Hospital] h
WHERE h.IsActive = 1;

INSERT INTO [RoleMaster] ([RoleName], [RoleDisplayName], [RoleDescription], [HospitalId], [IsActive])
SELECT 
    'Doctor' as RoleName,
    'Doctor' as RoleDisplayName,
    'Medical practitioner with patient consultation and treatment permissions' as RoleDescription,
    h.HospitalId,
    1 as IsActive
FROM [Hospital] h
WHERE h.IsActive = 1;

-- Add roles for hospital ID 1 if no hospitals exist yet
IF NOT EXISTS (SELECT 1 FROM [Hospital] WHERE IsActive = 1)
BEGIN
    INSERT INTO [RoleMaster] ([RoleName], [RoleDisplayName], [RoleDescription], [HospitalId], [IsActive])
    VALUES 
    ('SuperAdmin', 'Super Administrator', 'Full system access with all permissions across the hospital', 1, 1),
    ('Admin', 'Administrator', 'Hospital administrator with management permissions', 1, 1),
    ('Receptionist', 'Receptionist', 'Front desk operations including patient registration and appointment scheduling', 1, 1),
    ('Nurse', 'Nurse', 'Nursing staff with patient care and medical record access', 1, 1),
    ('Doctor', 'Doctor', 'Medical practitioner with patient consultation and treatment permissions', 1, 1);
END

-- Create a view for easier role management
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

-- Sample queries to verify data
-- SELECT * FROM [RoleMaster] WHERE HospitalId = 1;
-- SELECT * FROM [vw_RoleMaster] ORDER BY HospitalName, RoleName;
