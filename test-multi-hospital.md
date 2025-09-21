# Multi-Hospital Implementation Test Plan

## Overview
This document outlines the test cases to verify that the multi-hospital functionality is working correctly.

## Implementation Summary
1. **Hospital Dropdown Restriction**: Only super admins can see and use the hospital dropdown
2. **Data Cache Clearing**: When switching hospitals, all cached data is cleared and fresh data is loaded
3. **Department Filtering**: Add staff page only shows departments for the current user's hospital

## Test Cases

### 1. Hospital Dropdown Visibility Test
**Expected Behavior**: Only super admins should see the hospital dropdown

**Test Steps**:
1. Login as a regular user (non-super admin)
2. Check if hospital dropdown is visible in header
3. Login as super admin
4. Check if hospital dropdown is visible in header

**Expected Results**:
- Regular users: Hospital dropdown should NOT be visible
- Super admins: Hospital dropdown should be visible

### 2. Hospital Switching and Cache Clearing Test
**Expected Behavior**: When switching hospitals, all cached data should be cleared and page should reload

**Test Steps**:
1. Login as super admin
2. Navigate to any data-heavy page (e.g., staff list, department list)
3. Note the data displayed
4. Switch hospital using dropdown
5. Verify page reloads and data is fresh

**Expected Results**:
- Page should reload completely after hospital switch
- No data from previous hospital should persist
- Fresh data for new hospital should be loaded

### 3. Department Filtering on Add Staff Page
**Expected Behavior**: Only departments belonging to current user's hospital should be visible

**Test Steps**:
1. Login as user from Hospital A
2. Navigate to Add Staff page
3. Check department dropdown options
4. Switch to Hospital B (if super admin)
5. Navigate to Add Staff page again
6. Check department dropdown options

**Expected Results**:
- Department dropdown should only show departments for current user's hospital
- When switching hospitals, department dropdown should update accordingly

## Technical Verification Points

### Backend Verification
- [ ] DepartmentInfoesController filters by hospital ID
- [ ] Super admin bypass logic works correctly
- [ ] Hospital ID is properly set on department creation

### Frontend Verification
- [ ] Hospital dropdown visibility based on user role
- [ ] localStorage clearing on hospital switch
- [ ] Page reload on hospital switch
- [ ] Department dropdown refresh on hospital change

## Files Modified
- `hospitalApiProject/Controllers/DepartmentInfoesController.cs`
- `src/app/common-component/header/header.component.html`
- `src/app/common-component/header/header.component.ts`
- `src/app/core/staff/add-staff/add-staff.component.ts`
- `src/app/shared/components/hospital-status.component.ts`

## Notes
- Test both with super admin and regular user accounts
- Verify that the UI behaves correctly in both scenarios
- Check browser console for any JavaScript errors
- Monitor network requests to ensure proper filtering
