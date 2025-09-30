import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { LocalStorageUtil } from '../../utils/local-storage.util';

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
        let fallbackStatus: SuperAdminStatus = {
          isCurrentUserSuperAdmin: false,
          globalSuperAdminExists: true
        };
        
        const data = LocalStorageUtil.getUserData();
        const userRole = data?.userRole?.toLowerCase() || '';
        fallbackStatus.isCurrentUserSuperAdmin = userRole === 'globalsuperadmin' || userRole === 'superadmin';
        
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

  // Hospital management methods for Super Admin
  createHospital(hospitalData: any): Observable<any> {
    return this.apiService.post(api_Url + 'SuperAdmin/hospitals', hospitalData).pipe(
      catchError((error: any) => {
        console.error('SuperAdmin/hospitals POST failed:', error);
        // Fallback: try the regular hospitals endpoint
        console.log('Falling back to regular hospitals endpoint...');
        return this.apiService.post(api_Url + 'Hospitals', hospitalData);
      })
    );
  }

  updateHospital(hospitalId: number, hospitalData: any): Observable<any> {
    return this.apiService.put(api_Url + `SuperAdmin/hospitals/${hospitalId}`, hospitalData).pipe(
      catchError((error: any) => {
        console.error(`SuperAdmin/hospitals/${hospitalId} PUT failed:`, error);
        // Fallback: try the regular hospitals endpoint
        console.log('Falling back to regular hospitals endpoint...');
        return this.apiService.put(api_Url + `Hospitals/${hospitalId}`, hospitalData);
      })
    );
  }

  deleteHospital(hospitalId: number): Observable<any> {
    return this.apiService.delete(api_Url + `SuperAdmin/hospitals/${hospitalId}`).pipe(
      catchError((error: any) => {
        console.error(`SuperAdmin/hospitals/${hospitalId} DELETE failed:`, error);
        // Fallback: try the regular hospitals endpoint
        console.log('Falling back to regular hospitals endpoint...');
        return this.apiService.delete(api_Url + `Hospitals/${hospitalId}`);
      })
    );
  }

  activateHospital(hospitalId: number): Observable<any> {
    return this.apiService.put(api_Url + `SuperAdmin/hospitals/${hospitalId}/activate`, {}).pipe(
      catchError((error: any) => {
        console.error(`SuperAdmin/hospitals/${hospitalId}/activate PUT failed:`, error);
        // Fallback: try the regular hospitals endpoint
        console.log('Falling back to regular hospitals endpoint...');
        return this.apiService.put(api_Url + `Hospitals/${hospitalId}/activate`, {});
      })
    );
  }

  deactivateHospital(hospitalId: number): Observable<any> {
    return this.apiService.put(api_Url + `SuperAdmin/hospitals/${hospitalId}/deactivate`, {}).pipe(
      catchError((error: any) => {
        console.error(`SuperAdmin/hospitals/${hospitalId}/deactivate PUT failed:`, error);
        // Fallback: try the regular hospitals endpoint
        console.log('Falling back to regular hospitals endpoint...');
        return this.apiService.put(api_Url + `Hospitals/${hospitalId}/deactivate`, {});
      })
    );
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
