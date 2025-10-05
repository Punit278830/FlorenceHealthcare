-- Fix script to update staff hospital assignment
-- Update staff ID 3183 to hospital ID 38

-- First, verify the current state
SELECT 
    StaffId, FirstName, LastName, HospitalId, Designation
FROM StaffInfos 
WHERE StaffId = 3183;

-- Update the hospital assignment
UPDATE StaffInfos 
SET HospitalId = 38
WHERE StaffId = 3183;

-- Verify the update
SELECT 
    StaffId, FirstName, LastName, HospitalId, Designation
FROM StaffInfos 
WHERE StaffId = 3183;

-- Also verify the hospital exists
SELECT HospitalId, HospitalName, IsActive 
FROM Hospitals 
WHERE HospitalId = 38;
