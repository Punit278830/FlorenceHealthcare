import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';
import { DebugService } from 'src/app/shared/Services/debug/debug.service';
import { LocalStorageUtil } from 'src/app/shared/utils/local-storage.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public routes = routes;
  public passwordClass = false;

  form = new FormGroup({
    email: new FormControl('admin@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('123456', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(public auth: AuthService, 
    private router: Router,
    private toaster: ToastrService,
    private loadingService: LoadingService,
    private roleService: RoleAuthorizationService,
    private debugService: DebugService) {}

  ngOnInit(): void {
    // Temporarily disable all diagnostics to test if they're causing login issues
    console.log('Login component initialized - diagnostics disabled for testing');
    
    if (localStorage.getItem('authenticated')) {
      localStorage.removeItem('authenticated');
    }
  }

  loginFormSubmit(): void {
    this.loadingService.showLoader();
    if (this.form.valid) {
      const email = this.form.controls.email.value as string;
      const password = this.form.controls.password.value as string;

      this.auth.login(email, password).subscribe(
        (staffInfo: IstaffInfo) => {
          this.loadingService.hideLoader();
          
          // Clear authentication failure count on successful login
          localStorage.removeItem('auth_failed_count');
          
          console.log('Login successful for staff:', staffInfo);
          
          // Simplified navigation logic - increase timeout to allow auth service to complete
          setTimeout(() => {
            const userData = LocalStorageUtil.getUserData();
            const userRole = userData?.userRole?.toLowerCase() || staffInfo.designation.toLowerCase();

            console.log('Navigating user with role:', userRole);

            if (staffInfo.activeStatus === 1) {
              // Navigate based on user role
              if (userRole === 'globalsuperadmin' || userRole === 'superadmin' || 
                  userRole === 'global super administrator' || userRole === 'admin') {
                this.router.navigate([routes.adminDashboard]);
              } else if (userRole === 'doctor') {
                this.router.navigate([routes.doctorDashboard]);
              } else if (userRole === 'reception' || userRole === 'nursing') {
                this.router.navigate(['/dashboard']);
              } else {
                // Default to admin dashboard for unknown roles
                this.router.navigate([routes.adminDashboard]);
              }
              
              // Reduced reload timeout and made it optional
              setTimeout(() => { 
                console.log('Reloading page to refresh layout'); 
                window.location.reload(); 
              }, 500);
            } else {
              this.toaster.warning('User account is inactive. Please contact administrator.');
            }
          }, 1000); // Increased timeout to 1 second to allow auth service to complete
        },
        (error: string) => {
          // Error occurred, handle error message
          this.loadingService.hideLoader();
          
          // Track authentication failures
          const failCount = parseInt(localStorage.getItem('auth_failed_count') || '0') + 1;
          localStorage.setItem('auth_failed_count', failCount.toString());
          
          // Temporarily disable diagnostic to avoid confusion
          // if (failCount >= 3) {
          //   console.log('Multiple login failures detected, running diagnostic...');
          //   this.debugService.runFullDiagnostic();
          // }
          
          this.toaster.error(error);
        }
      );
    }
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
