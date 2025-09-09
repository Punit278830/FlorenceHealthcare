import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiHttpService } from '../../apiService/apiHttpService';

export interface SuperAdminStatus {
  isCurrentUserSuperAdmin: boolean;
  globalSuperAdminExists: boolean;
  globalSuperAdminInfo?: {
    staffId: number;
    name: string;
    designation: string;
    hospitalId: number | null;
  };
}

export interface HospitalSummary {
  hospitalId: number;
  staffCount: number;
  hospitalName?: string;
}

export interface SystemSummary {
  totalStaff: number;
  totalPatients: number;
  totalAppointments: number;
  totalInvoices: number;
  hospitalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private superAdminStatusSubject = new BehaviorSubject<SuperAdminStatus | null>(null);
  public superAdminStatus$ = this.superAdminStatusSubject.asObservable();

  constructor(private apiService: ApiHttpService) {
    this.checkSuperAdminStatus();
  }

  checkSuperAdminStatus(): Observable<SuperAdminStatus> {
    return this.apiService.get('SuperAdmin/check').pipe(
      tap((status: SuperAdminStatus) => this.superAdminStatusSubject.next(status))
    );
  }

  setupGlobalSuperAdmin(staffId: number): Observable<any> {
    return this.apiService.post('SuperAdmin/setup', { staffId });
  }

  getAllHospitals(): Observable<HospitalSummary[]> {
    return this.apiService.get('SuperAdmin/hospitals');
  }

  getSystemSummary(): Observable<SystemSummary> {
    return this.apiService.get('SuperAdmin/all-data-summary');
  }

  isSuperAdmin(): boolean {
    const status = this.superAdminStatusSubject.value;
    return status?.isCurrentUserSuperAdmin || false;
  }

  // Method to clear hospital selection for Super Admin
  clearHospitalSelectionForSuperAdmin(): void {
    if (this.isSuperAdmin()) {
      // Clear any hospital-specific selections in localStorage
      localStorage.removeItem('selectedHospitalId');
      // You might want to emit an event or call other services to update UI
    }
  }
}
