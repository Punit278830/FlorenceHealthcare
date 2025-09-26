import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';

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
    private roleService: RoleAuthorizationService) {}

  ngOnInit(): void {
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
          // Wait a brief moment for role data to be fetched and set
          setTimeout(() => {
            const userRole = this.roleService.getCurrentRole();
            const roleName = userRole?.roleName.toLowerCase() || staffInfo.designation.toLowerCase();

            if (staffInfo.activeStatus === 1) {
              // Navigate based on user role with proper role handling
              if (roleName === 'globalsuperadmin' || roleName === 'superadmin' || 
                  roleName === 'global super administrator' || roleName === 'admin') {
                this.router.navigate([routes.adminDashboard]);
              } else if (roleName === 'doctor') {
                this.router.navigate([routes.doctorDashboard]);
              } else if (roleName === 'reception' || roleName === 'nursing') {
                // Reception and nursing should land on /dashboard for role-based redirect
                this.router.navigate(['/dashboard']);
              } else {
                // Default to admin dashboard for unknown roles
                this.router.navigate([routes.adminDashboard]);
              }
              // Force a full reload to update layout/header for new role
              setTimeout(() => { window.location.reload(); }, 100);
            } else {
              this.toaster.warning('User account is inactive. Please contact administrator.');
            }
          }, 100); // Short delay to ensure role data is set
        },
        (error: string) => {
          // Error occurred, handle error message
          this.loadingService.hideLoader();
          this.toaster.error(error);
        }
      );
    }
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
