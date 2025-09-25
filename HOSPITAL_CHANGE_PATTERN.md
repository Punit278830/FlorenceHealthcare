# Hospital Change Subscription Pattern

## Problem
When super admins switch hospitals using the dropdown in the header, components with hospital-dependent data (like department dropdowns, doctor lists, etc.) don't automatically refresh to show data for the newly selected hospital.

## Solution Pattern
Add hospital change subscriptions to components that have hospital-dependent data.

## Implementation Steps

### 1. Add Required Imports
```typescript
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HospitalService } from 'path/to/hospital.service';
```

### 2. Update Component Class
```typescript
export class YourComponent implements OnInit, OnDestroy {
  private hospitalSubscription: Subscription = new Subscription();
  
  constructor(
    // ...existing services
    private hospitalService: HospitalService
  ) {}
}
```

### 3. Add Hospital Subscription in ngOnInit
```typescript
ngOnInit() {
  // ...existing initialization code
  
  // Subscribe to hospital changes
  this.hospitalSubscription = this.hospitalService.currentHospitalId$.subscribe(hospitalId => {
    if (hospitalId !== null) {
      // Hospital changed, reload dependent data
      this.reloadDataForHospital();
    }
  });
}
```

### 4. Create Reload Method
```typescript
private reloadDataForHospital(): void {
  // Clear existing data
  this.departments = [];
  this.doctors = [];
  this.anyOtherHospitalDependentData = [];
  
  // Reset form selections that depend on hospital
  this.yourForm.patchValue({
    departmentId: '',
    doctorId: '',
    // ...other hospital-dependent fields
  });
  
  // Reload data for the new hospital
  this.loadDepartments();
  this.loadDoctors();
  // ...other data loading methods
}
```

### 5. Add ngOnDestroy
```typescript
ngOnDestroy(): void {
  this.hospitalSubscription.unsubscribe();
}
```

## Components That Need This Pattern

### High Priority
- ✅ **add-appointment** - Department and doctor dropdowns
- ✅ **add-staff** - Department and role dropdowns  
- **edit-appointment** - Department and doctor dropdowns
- **edit-staff** - Department dropdown
- **appointment-list** - Department filtering
- **staff-list** - Department filtering

### Medium Priority
- **patient-list** - May have hospital filtering
- **invoice-list** - Hospital-specific invoices
- **department-list** - Already hospital-filtered via API
- **consultation** components - Hospital-dependent data

### Low Priority
- **dashboard** components - Already handle hospital changes
- **profile** components - Usually staff-specific

## API Service Changes
The `ApiHttpService` has been updated with convenience methods:
- `getForViewing()` - For listing data (super admins see all hospitals)
- `getForActions()` - For create/update/delete (requires selected hospital)
- `postForActions()`, `putForActions()`, `deleteForActions()` - For actions

## Notes
- Services like `DepartmentService`, `StaffService` automatically use the correct hospital context via `ApiHttpService`
- Super admins must select a hospital before performing actions
- Regular users always work within their assigned hospital context
- Hospital changes trigger automatic data refresh in subscribed components
