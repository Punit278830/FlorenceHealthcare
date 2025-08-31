import { Component, OnInit } from '@angular/core';
import { HospitalInitService } from './shared/Services/hospital/hospital-init.service';
import { RoleAuthorizationService } from './shared/Services/auth/role-authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'preclinic-angular';

  constructor(
    private hospitalInitService: HospitalInitService,
    private roleService: RoleAuthorizationService
  ) {}

  ngOnInit() {
    // Initialize hospital selection on app startup
    this.hospitalInitService.initializeHospital();
    
    // Initialize role data from localStorage if available
    const storedData = localStorage.getItem('data');
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        if (userData.loginId) {
          // Re-fetch role data to ensure it's current
          this.roleService.getUserRoleByStaffId(userData.loginId).subscribe({
            next: (roleData) => {
              this.roleService.setUserRole(roleData);
            },
            error: (error) => {
              console.warn('Could not fetch user role on app init:', error);
            }
          });
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }
}
