# Components Needing Hospital Subscription Pattern

This document tracks all components that need to implement the hospital change subscription pattern.

## ✅ Already Implemented
1. `add-staff.component.ts` - ✅ COMPLETE
2. `appointment-list.component.ts` - ✅ COMPLETE
3. `staff-list.component.ts` - ✅ COMPLETE
4. `patients-list.component.ts` - ✅ COMPLETE
5. `department-list.component.ts` - ✅ COMPLETE
6. `admin-dashboard.component.ts` - ✅ COMPLETE
7. `add-appointment.component.ts` - ✅ COMPLETE
8. `doctor-dashboard.component.ts` - ✅ COMPLETE (was already implemented)

## ✅ Completed in This Session
9. `edit-staff.component.ts` - ✅ COMPLETE (loads departments, roles)
10. `edit-appointment.component.ts` - ✅ COMPLETE (loads departments)
11. `create-invoice.component.ts` - ✅ COMPLETE (loads patients)
12. `questionnaire/add-questionnaire.component.ts` - ✅ COMPLETE (loads departments)

## 🔄 Still Needs Implementation (Medium Priority)

### Patient Components
1. `add-patient.component.ts` - No hospital dependencies (creates new patients)
2. `edit-patient.component.ts` - No hospital dependencies (loads specific patient by ID)

### Department Components
3. `add-department.component.ts` - No hospital dependencies (creates new department)
4. `edit-department.component.ts` - No hospital dependencies (loads specific department by ID)

### Doctor Components (Mock Data - Lower Priority)
5. `doctors-list.component.ts` - Uses mock DataService
6. `add-doctor.component.ts` - Uses hardcoded data
7. `edit-doctor.component.ts` - Likely uses mock data

### Invoice Components (Mock Data - Lower Priority)
8. `edit-invoice.component.ts` - Need to check if uses real data
9. `invoices-list.component.ts` - Need to check if uses real data
10. `all-invoice.component.ts` - Uses mock DataService
11. `invoices-paid.component.ts` - Likely uses mock data
12. `invoices-draft.component.ts` - Likely uses mock data
13. `invoices-overdue.component.ts` - Likely uses mock data
14. `invoices-cancelled.component.ts` - Likely uses mock data

### Dashboard Components (Mock Data)
15. `patient-dashboard.component.ts` - Uses mock DataService
21. `reports/*.component.ts` - Need to check if they load hospital-specific data

## 🔍 Need Investigation (Lower Priority)

### Settings/Admin Components
- Most settings components likely don't need hospital subscriptions as they're global
- Need to verify which ones load hospital-specific data

### Authentication/Profile Components  
- Likely don't need hospital subscriptions

### Generic UI Components
- Likely don't need hospital subscriptions

## Implementation Strategy

1. **Phase 1**: High Priority Components (items 2-9)
2. **Phase 2**: Invoice Components (items 10-17) 
3. **Phase 3**: Dashboard Components (items 18-19)
4. **Phase 4**: Other Components (item 20+)
5. **Phase 5**: Investigation and cleanup

Each component needs:
1. Hospital service injection
2. Subscription in ngOnInit
3. Unsubscription in ngOnDestroy  
4. `reloadDataForHospital()` method
5. Call to reload method when hospital changes
