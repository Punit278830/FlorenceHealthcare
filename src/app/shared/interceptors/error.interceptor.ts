import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('HTTP Error intercepted:', error);
        
        // Handle different error scenarios
        if (error.status === 401) {
          // Only logout if it's not a login attempt
          if (!req.url.includes('login') && !req.url.includes('StaffInfoes')) {
            console.log('401 error detected, logging out user');
            this.toastr.error('Session expired. Please login again.');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        } else if (error.status === 403) {
          this.toastr.error('Access denied. You do not have permission to perform this action.');
        } else if (error.status === 0) {
          // Network error - likely connection issue
          console.error('Network error or CORS issue:', error);
          this.toastr.error('Network connection error. Please check your internet connection and try again.');
        } else if (error.status >= 500) {
          this.toastr.error('Server error. Please try again later.');
        }
        
        return throwError(() => error);
      })
    );
  }
}
