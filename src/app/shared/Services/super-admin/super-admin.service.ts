import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';

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
    return this.apiService.get(api_Url + 'SuperAdmin/check').pipe(
      tap((status: SuperAdminStatus) => this.superAdminStatusSubject.next(status)),
      catchError((error: any) => {
        console.error('SuperAdmin/check API failed:', error);
        // Fallback: determine super admin status based on localStorage role
        const data = JSON.parse(localStorage.getItem('data') || '{}');
        const userRole = data.userRole?.toLowerCase() || '';
        
        const fallbackStatus: SuperAdminStatus = {
          isCurrentUserSuperAdmin: userRole === 'globalsuperadmin' || userRole === 'superadmin',
          globalSuperAdminExists: true
        };
        
        console.log('Using fallback super admin status:', fallbackStatus);
        this.superAdminStatusSubject.next(fallbackStatus);
        return of(fallbackStatus);
      })
    );
  }

  setupGlobalSuperAdmin(staffId: number): Observable<any> {
    return this.apiService.post(api_Url + 'SuperAdmin/setup', { staffId });
  }

  getAllHospitals(): Observable<HospitalSummary[]> {
    return this.apiService.get(api_Url + 'SuperAdmin/hospitals').pipe(
      catchError((error: any) => {
        console.error('SuperAdmin/hospitals API failed:', error);
        // Fallback: try the regular hospitals endpoint
        console.log('Falling back to regular hospitals endpoint...');
        return this.apiService.get(api_Url + 'Hospitals');
      })
    );
  }

  getSystemSummary(): Observable<SystemSummary> {
    return this.apiService.get(api_Url + 'SuperAdmin/all-data-summary');
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
