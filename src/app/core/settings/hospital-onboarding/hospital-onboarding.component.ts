import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { api_Url } from 'src/environment/environment';
import { routes } from 'src/app/shared/routes/routes';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';
import { SuperAdminService } from 'src/app/shared/Services/super-admin/super-admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageUtil } from 'src/app/shared/utils/local-storage.util';
import { ApiHttpService } from 'src/app/shared/apiService/apiHttpService';
import { HospitalService } from 'src/app/shared/Services/hospital/hospital.service';

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
  // Edit mode properties
  isEditMode = false;
  editingHospitalId?: number;


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private apiService: ApiHttpService,
    private hospitalService: HospitalService,
    private roleService: RoleAuthorizationService,
    private superAdminService: SuperAdminService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Check if user data exists and role is properly set
    const userData = LocalStorageUtil.getUserData();
    if (!userData || !userData.userRole) {
      this.toastr.error('User session invalid. Please login again.');
      this.router.navigate(['/auth/login']);
      return;
    }

    // Check if user has permission to access hospital management
    const userRole = userData.userRole.toLowerCase();
    
    // Allow access for super admin roles or if the SuperAdmin service confirms super admin status
    const isSuperAdminByRole = userRole === 'superadmin' || userRole === 'globalsuperadmin';
    
    if (!isSuperAdminByRole) {
      // If role doesn't indicate super admin, check with SuperAdmin service
      this.superAdminService.checkSuperAdminStatus().subscribe({
        next: (status) => {
          if (!status.isCurrentUserSuperAdmin) {
            this.toastr.error('Access denied. Only Super Admin users can access this page.');
            this.router.navigate(['/admin-dashboard']);
            return;
          }
          // If we reach here, user is confirmed as super admin, continue with component initialization
        },
        error: (error) => {
          console.error('Error checking super admin status:', error);
          // In case of error, allow access if we got this far (guard already passed)
        }
      });
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

    if (this.isEditMode && this.editingHospitalId) {
      // Update existing hospital - include hospitalId in the payload
      const updatePayload = {
        ...this.form.value,
        hospitalId: this.editingHospitalId
      };
      this.apiService.put(`${this.apiBase}Hospitals/${this.editingHospitalId}`, updatePayload).subscribe({
        next: (response) => {
          this.success = 'Hospital updated successfully';
          this.loading = false;
          this.resetForm();
          this.loadHospitals();
          // Force immediate refresh of hospital list in header
          this.hospitalService.forceHospitalListRefresh();
        },
        error: (err) => {
          console.error('Hospital update failed:', err);
          this.error = err?.error || 'Failed to update hospital';
          this.loading = false;
        }
      });
    } else {
      // Create new hospital
      this.apiService.post(`${this.apiBase}Hospitals`, this.form.value).subscribe({
        next: (response) => {
          this.success = 'Hospital created successfully';
          this.loading = false;
          this.resetForm();
          this.loadHospitals();
          // Force immediate refresh of hospital list in header
          this.hospitalService.forceHospitalListRefresh();
        },
        error: (err) => {
          console.error('Hospital creation failed:', err);
          this.error = err?.error || 'Failed to create hospital';
          this.loading = false;
        }
      });
    }
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
        // Force immediate refresh of hospital list in header
        this.hospitalService.forceHospitalListRefresh();
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
        // Force immediate refresh of hospital list in header
        this.hospitalService.forceHospitalListRefresh();
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
    this.hospitals = this.hospitals.filter(h => h.hospitalId !== hospital.hospitalId);

    this.http.delete(`${this.apiBase}Hospitals/${hospital.hospitalId}`).subscribe({
      next: (response: any) => {
        this.success = `Hospital "${hospital.name}" has been deleted successfully`;
        this.loadHospitals();
        // Force immediate refresh of hospital list in header
        this.hospitalService.forceHospitalListRefresh();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete hospital';
        this.loading = false;
      }
    });
  }

  getHospitalStatusClass(hospital: any): string {
    // Use consistent styling with invoice page status badges
    const isDeleted = hospital.isDeleted || false;
    if (isDeleted) return 'custom-badge status-pink';
    if (!hospital.isActive) return 'custom-badge status-orange';
    return 'custom-badge status-green';
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
    // Always fetch fresh user data to avoid stale data when users switch
    const userData = LocalStorageUtil.getUserData();
    
    // If no user data, definitely not super admin
    if (!userData) {
      return false;
    }
    
    // Check if staffId matches the known super admin (14) from the API response
    if (userData.loginId === 14 || userData.staffId === 14) {
      return true;
    }
    
    // Check role service (which should be updated on login/logout)
    const roleServiceResult = this.roleService.isSuperAdmin();
    if (roleServiceResult) {
      return true;
    }
    
    // Fallback to localStorage role checks with safe navigation
    const userRole = userData.userRole?.toLowerCase() || '';
    const designation = userData.designation?.toLowerCase() || '';
    
    const isSuperByRole = userRole === 'superadmin' || 
                         userRole === 'globalsuperadmin' ||
                         userRole === 'super admin' ||
                         userRole === 'global super admin';
                         
    const isSuperByDesignation = designation === 'superadmin' ||
                                designation === 'globalsuperadmin' ||
                                designation === 'super admin' ||
                                designation === 'global super admin' ||
                                designation === 'global super administrator';
    
    return isSuperByRole || isSuperByDesignation;
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

  // Edit functionality methods
  editHospital(hospital: any): void {
    this.isEditMode = true;
    this.editingHospitalId = hospital.hospitalId;
    
    // Fill the form with hospital data
    this.form.patchValue({
      name: hospital.name || '',
      code: hospital.code || '',
      contactPerson: hospital.contactPerson || '',
      contactNumber: hospital.contactNumber || '',
      email: hospital.email || '',
      addressLine1: hospital.addressLine1 || '',
      addressLine2: hospital.addressLine2 || '',
      city: hospital.city || '',
      state: hospital.state || '',
      pincode: hospital.pincode || '',
      country: hospital.country || '',
      registrationNumber: hospital.registrationNumber || '',
      licenseNumber: hospital.licenseNumber || '',
      gstin: hospital.gstin || '',
      websiteUrl: hospital.websiteUrl || '',
      logoUrl: hospital.logoUrl || '',
      isActive: hospital.isActive
    });
    
    this.error = undefined;
    this.success = undefined;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.editingHospitalId = undefined;
    this.form.reset({ isActive: true });
    this.error = undefined;
    this.success = undefined;
    this.loading = false;
  }

  onSubmitClick(event: Event): void {
    // Don't prevent default - let the form submission happen naturally
  }


}
