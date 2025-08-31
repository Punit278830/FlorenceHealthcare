import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { api_Url } from 'src/environment/environment';
import { routes } from 'src/app/shared/routes/routes';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hospital-onboarding',
  templateUrl: './hospital-onboarding.component.html',
  styleUrls: ['./hospital-onboarding.component.scss']
})
export class HospitalOnboardingComponent implements OnInit {
  form!: FormGroup;
  hospitals: any[] = [];
  apiBase = api_Url;
  loading = false;
  error?: string;
  success?: string;
  public routes = routes;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private roleService: RoleAuthorizationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Check if user has permission to access hospital management
    if (!this.roleService.canAccessHospitalManagement()) {
      this.toastr.error('Access denied. Only Super Admin users can access this page.');
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      code: ['', [Validators.maxLength(50)]],
      contactPerson: ['', [Validators.maxLength(200)]],
      contactNumber: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(200)]],
      addressLine1: ['', [Validators.maxLength(400)]],
      addressLine2: ['', [Validators.maxLength(400)]],
      city: ['', [Validators.maxLength(100)]],
      state: ['', [Validators.maxLength(100)]],
      pincode: ['', [Validators.maxLength(20)]],
      country: ['', [Validators.maxLength(100)]],
      registrationNumber: ['', [Validators.maxLength(100)]],
      licenseNumber: ['', [Validators.maxLength(100)]],
      gstin: ['', [Validators.maxLength(30)]],
      websiteUrl: ['', [Validators.maxLength(400)]],
      logoUrl: ['', [Validators.maxLength(400)]],
      isActive: [true]
    });

    this.loadHospitals();
  }

  loadHospitals(): void {
    this.loading = true;
    this.http.get(this.apiBase + 'Hospitals').subscribe({
      next: (data: any) => {
        this.hospitals = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error || 'Failed to fetch hospitals';
        this.loading = false;
      }
    })
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = undefined;
    this.success = undefined;
    this.http.post(this.apiBase + 'Hospitals', this.form.value).subscribe({
      next: () => {
        this.success = 'Hospital created';
        this.form.reset({ isActive: true });
        this.loadHospitals();
      },
      error: (err) => {
        this.error = err?.error || 'Failed to create hospital';
        this.loading = false;
      }
    });
  }

  selectHospital(h: any): void {
    // Store the selected hospital id globally for API header propagation
    localStorage.setItem('currentHospitalId', String(h.hospitalId));
    this.success = `Selected hospital: ${h.name}`;
  }

  deactivateHospital(hospital: any): void {
    const confirmMessage = `Are you sure you want to deactivate "${hospital.name}"?\n\nThis will:\n• Set the hospital status to Inactive\n• Keep the hospital data intact\n• Allow reactivation later`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.success = undefined;

    this.http.put(`${this.apiBase}Hospitals/${hospital.hospitalId}/deactivate`, {}).subscribe({
      next: (response: any) => {
        this.success = `Hospital "${hospital.name}" has been deactivated successfully`;
        this.loadHospitals();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to deactivate hospital';
        this.loading = false;
      }
    });
  }

  activateHospital(hospital: any): void {
    const isDeleted = hospital.isDeleted;
    const confirmMessage = isDeleted 
      ? `Are you sure you want to restore and activate "${hospital.name}"?\n\nThis will:\n• Remove the deleted status\n• Set the hospital status to Active\n• Make it available for normal operations`
      : `Are you sure you want to activate "${hospital.name}"?\n\nThis will:\n• Set the hospital status to Active\n• Allow normal operations\n• Make it available for selection`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.success = undefined;

    this.http.put(`${this.apiBase}Hospitals/${hospital.hospitalId}/activate`, {}).subscribe({
      next: (response: any) => {
        const action = isDeleted ? 'restored and activated' : 'activated';
        this.success = `Hospital "${hospital.name}" has been ${action} successfully`;
        this.loadHospitals();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to activate hospital';
        this.loading = false;
      }
    });
  }

  deleteHospital(hospital: any): void {
    const confirmMessage = `⚠️ DANGER: Are you sure you want to delete "${hospital.name}"?\n\nThis will:\n• Mark the hospital as deleted (soft delete)\n• Set status to Inactive\n• Hide from normal operations\n• This action cannot be easily undone\n\nType "DELETE" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    if (userInput !== 'DELETE') {
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.success = undefined;

    this.http.delete(`${this.apiBase}Hospitals/${hospital.hospitalId}`).subscribe({
      next: (response: any) => {
        this.success = `Hospital "${hospital.name}" has been deleted successfully`;
        this.loadHospitals();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete hospital';
        this.loading = false;
      }
    });
  }

  getHospitalStatusClass(hospital: any): string {
    // Temporarily handle hospitals without IsDeleted column
    const isDeleted = hospital.isDeleted || false;
    if (isDeleted) return 'badge bg-danger';
    if (!hospital.isActive) return 'badge bg-warning';
    return 'badge bg-success';
  }

  getHospitalStatusIcon(hospital: any): string {
    // Temporarily handle hospitals without IsDeleted column
    const isDeleted = hospital.isDeleted || false;
    if (isDeleted) return 'fa-times-circle';
    if (!hospital.isActive) return 'fa-pause-circle';
    return 'fa-check-circle';
  }

  getHospitalStatusText(hospital: any): string {
    // Temporarily handle hospitals without IsDeleted column
    const isDeleted = hospital.isDeleted || false;
    if (isDeleted) return 'Deleted';
    if (!hospital.isActive) return 'Inactive';
    return 'Active';
  }

  get isSuperAdmin(): boolean {
    return this.roleService.isSuperAdmin();
  }

  getActiveHospitalCount(): number {
    return this.hospitals.filter(h => h.isActive && !(h.isDeleted || false)).length;
  }

  getInactiveHospitalCount(): number {
    return this.hospitals.filter(h => !h.isActive && !(h.isDeleted || false)).length;
  }

  getDeletedHospitalCount(): number {
    return this.hospitals.filter(h => h.isDeleted || false).length;
  }

  getTotalHospitalCount(): number {
    return this.hospitals.length;
  }
}
