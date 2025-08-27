import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';

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
    private loadingService: LoadingService) {}

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
          // Login successful, navigate based on user role and status
          this.loadingService.hideLoader();
          if (staffInfo.designation.toLowerCase() === 'admin' && staffInfo.activeStatus === 1) {
            this.router.navigate([routes.adminDashboard]);
          } else if (staffInfo.designation.toLowerCase() === 'doctor' && staffInfo.activeStatus === 1) {
            this.router.navigate([routes.doctorDashboard]);
          } else if (staffInfo.designation.toLowerCase() === 'reception' && staffInfo.activeStatus === 1) {
            this.router.navigate([routes.appointmentList]);
          } else if (staffInfo.designation.toLowerCase() === 'nursing' && staffInfo.activeStatus === 1) {
            this.router.navigate([routes.addPatient]);
          }
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
