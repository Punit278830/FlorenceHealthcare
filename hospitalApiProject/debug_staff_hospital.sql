-- Debug script to check staff hospital assignment
-- Check staff record for staff ID 3183

SELECT 
    s.StaffId,
    s.FirstName,
    s.LastName,
    s.HospitalId,
    s.Designation,
    r.RoleId,
    r.RoleName,
    r.RoleDisplayName,
    h.HospitalId as ActualHospitalId,
    h.HospitalName
FROM StaffInfos s
LEFT JOIN RoleMasters r ON s.RoleId = r.RoleId
LEFT JOIN Hospitals h ON s.HospitalId = h.HospitalId
WHERE s.StaffId = 3183;

-- Also check if there are any other staff with similar issues
SELECT 
    s.StaffId,
    s.FirstName,
    s.LastName,
    s.HospitalId,
    s.Designation,
    r.RoleName
FROM StaffInfos s
LEFT JOIN RoleMasters r ON s.RoleId = r.RoleId
WHERE s.HospitalId IS NULL OR s.HospitalId = 0
LIMIT 10;

-- Check available hospitals
SELECT HospitalId, HospitalName, IsActive 
FROM Hospitals 
WHERE IsActive = 1
ORDER BY HospitalId;
