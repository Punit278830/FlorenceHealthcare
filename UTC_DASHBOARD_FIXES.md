# UTC DateTime Fixes for Dashboard APIs

## Issues Fixed

### Problem
The dashboard APIs were using server local time (`DateTime.Now`, `DateTime.Today`) instead of properly handling UTC time with user timezone conversion. This caused incorrect counts for:
- Total appointments for today
- Total patients registered today  
- Department patient counts
- Consultation counts
- Daily earnings

### Root Cause
APIs were using:
- `DateTime.Now.Date` - Server's local date
- `DateTime.Today` - Server's local date
- Direct date comparisons without timezone consideration

### Solution Implemented

#### 1. UTC Timezone Conversion Pattern
All date-related APIs now follow this pattern:

```csharp
var userTimeZone = GetTimeZoneFromHeader(); // Get user's timezone from X-Time-Zone header

// Get user's timezone info
TimeZoneInfo timeZoneInfo;
try
{
    timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(userTimeZone);
}
catch
{
    // Fallback to UTC if timezone is not found
    timeZoneInfo = TimeZoneInfo.Utc;
}

// Get today's date in user's timezone
var utcNow = DateTime.UtcNow;
var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
var todayStart = localNow.Date;
var todayEnd = todayStart.AddDays(1);

// Convert back to UTC for database query (data stored in UTC)
var todayStartUtc = TimeZoneInfo.ConvertTimeToUtc(todayStart, timeZoneInfo);
var todayEndUtc = TimeZoneInfo.ConvertTimeToUtc(todayEnd, timeZoneInfo);

// Use UTC range for database queries
.Where(e => e.Date >= todayStartUtc && e.Date < todayEndUtc)
```

#### 2. APIs Fixed

| API Endpoint | Controller | Method | Status |
|-------------|------------|---------|--------|
| `/api/AppointmentInfoes/count` | AppointmentInfoesController | GetAppointmentCount() | ✅ Fixed |
| `/api/PatientInfoes/count/today` | PatientInfoesController | GetNewPatientsToday() | ✅ Fixed |
| `/api/DepartmentInfoes/PatientCountByDepartment` | DepartmentInfoesController | GetpatientCountByDepartment() | ✅ Fixed |
| `/api/AppointmentInfoes/ConsultationCount` | AppointmentInfoesController | GetConsultationCount() | ✅ Fixed |
| `/api/AppointmentInfoes/ConsultationCount/{id}` | AppointmentInfoesController | GetConsultationCount(id) | ✅ Fixed |
| `/api/AppointmentInfoes/TodayEarning` | AppointmentInfoesController | GetTodayEarning() | ✅ Fixed |
| `/api/AppointmentInfoes/doctor/{id}` | AppointmentInfoesController | GetAppointmentByDoctorId(id) | ✅ Fixed |

#### 3. Frontend Support
The frontend already sends the user's timezone in the `X-Time-Zone` header via `apiHttpService.ts`:

```typescript
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
headers = headers.set('X-Time-Zone', timeZone);
```

#### 4. Database Considerations
- Assumes appointment dates and registration dates are stored in UTC format
- Date range queries now use UTC boundaries for accurate filtering
- Maintains existing data integrity

## Benefits

### 1. Accurate Dashboard Counts
- Appointment counts now reflect user's timezone "today"
- Patient registration counts are timezone-accurate
- Department statistics show correct daily numbers

### 2. Multi-Timezone Support
- Users in different timezones see correct "today" data
- Server location doesn't affect user experience
- Consistent behavior across global deployments

### 3. Hospital Filtering Maintained
- All existing hospital filtering logic preserved
- Super admin functionality unaffected
- Multi-tenant architecture integrity maintained

## Testing Recommendations

### 1. Timezone Testing
```bash
# Test with different timezones in header
curl -H "X-Time-Zone: America/New_York" http://localhost:5020/api/AppointmentInfoes/count
curl -H "X-Time-Zone: Asia/Kolkata" http://localhost:5020/api/AppointmentInfoes/count
curl -H "X-Time-Zone: UTC" http://localhost:5020/api/AppointmentInfoes/count
```

### 2. Cross-Midnight Testing
- Test around midnight in different timezones
- Verify date boundaries are correctly handled
- Check appointment/patient counts during timezone transitions

### 3. Fallback Testing
- Test with invalid timezone header
- Verify UTC fallback works correctly
- Test missing timezone header behavior

## Implementation Details

### Changed Query Patterns

**Before:**
```csharp
.Where(e => e.Date == DateTime.Now.Date)
.Where(p => p.RegstrationDate.Value.Date == DateTime.Today)
```

**After:**
```csharp
.Where(e => e.Date >= todayStartUtc && e.Date < todayEndUtc)
.Where(p => p.RegstrationDate.Value >= todayStartUtc && p.RegstrationDate.Value < todayEndUtc)
```

### Error Handling
- Invalid timezone IDs fall back to UTC
- Missing timezone headers default to UTC
- Database query errors are preserved from original implementation

## Notes
- All changes maintain backward compatibility
- Hospital filtering logic remains unchanged
- Performance impact minimal due to efficient date range queries
- UTC conversion happens at API level, not in database queries
