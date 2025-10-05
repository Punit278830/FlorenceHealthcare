import { Component, OnInit } from '@angular/core';
import { HospitalInitService } from './shared/Services/hospital/hospital-init.service';
import { RoleAuthorizationService } from './shared/Services/auth/role-authorization.service';
import { LocalStorageUtil } from './shared/utils/local-storage.util';
import { CacheDetectionService } from './shared/Services/cache-detection/cache-detection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'preclinic-angular';

  constructor(
    private hospitalInitService: HospitalInitService,
    private roleService: RoleAuthorizationService,
    private cacheDetectionService: CacheDetectionService
  ) {}

  ngOnInit() {
    // Check for cache issues first
    this.cacheDetectionService.checkForCacheIssues();
    
    // Initialize hospital selection on app startup
    this.hospitalInitService.initializeHospital();
    
    // Initialize role data from localStorage if available
    const userData = LocalStorageUtil.getUserData();
    if (userData && userData.loginId) {
      // Only re-fetch role data if we don't already have complete role information
      // or if the user is not a super admin (since super admin role is handled separately)
      const hasCompleteRoleData = userData.userRole && userData.userRole !== '';
      const isSuperAdmin = userData.userRole === 'superadmin' || userData.userRole === 'globalsuperadmin';
      
      if (!hasCompleteRoleData && !isSuperAdmin) {
        console.log('Fetching role data for user:', userData.loginId);
        // Re-fetch role data to ensure it's current
        this.roleService.getUserRoleByStaffId(userData.loginId).subscribe({
          next: (roleData) => {
            console.log('Role data fetched successfully:', roleData);
            this.roleService.setUserRole(roleData);
          },
          error: (error) => {
            console.warn('Could not fetch role data from API, using localStorage data:', error);
            // Fallback: use role data from localStorage if API fails
            if (userData.userRole) {
              console.log('Using role from localStorage:', userData.userRole);
              // Don't try to fetch from API, just use what we have
            }
          }
        });
      } else {
        console.log('Using existing role data from localStorage:', userData.userRole);
      }
    }
  }
}
