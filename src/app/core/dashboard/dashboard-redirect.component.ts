import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-redirect',
  template: '',
})
export class DashboardRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('data') || '{}');
    const role = (data.userRole || '').toLowerCase();
    if (role === 'doctor') {
      this.router.navigate(['/dashboard/doctor-dashboard']);
    } else if (role === 'reception') {
      // Receptionist landing page is admin dashboard
      this.router.navigate(['/dashboard/admin-dashboard']);
    } else if (role === 'nursing') {
      this.router.navigate(['/dashboard/admin-dashboard']); // Change if you have a nursing dashboard
    } else {
      this.router.navigate(['/dashboard/admin-dashboard']);
    }
  }
}
