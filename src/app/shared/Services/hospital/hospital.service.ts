import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_Url } from 'src/environment/environment';
import { HospitalModel } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private currentHospitalIdSubject = new BehaviorSubject<number | null>(this.getCurrentHospitalId());
  currentHospitalId$ = this.currentHospitalIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const hospitalId = this.getCurrentHospitalId();
    const hospitalIdStr = hospitalId ? hospitalId.toString() : '1';
    const staffId = localStorage.getItem('currentStaffId');
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    let headers = new HttpHeaders()
      .set('X-Hospital-Id', hospitalIdStr)
      .set('X-Time-Zone', timeZone);
    
    if (staffId) {
      headers = headers.set('X-Staff-Id', staffId);
    }
    
    return headers;
  }

  getHospitals(): Observable<HospitalModel[]> {
    // Don't send hospital headers for this endpoint since it should return ALL hospitals
    // This allows users to see all available hospitals for switching
    return this.http.get<HospitalModel[]>(api_Url + 'Hospitals');
  }

  setCurrentHospitalId(id: number | null) {
    if (id == null) {
      localStorage.removeItem('currentHospitalId');
    } else {
      localStorage.setItem('currentHospitalId', String(id));
    }
    this.currentHospitalIdSubject.next(id);
  }

  getCurrentHospitalId(): number | null {
    const val = localStorage.getItem('currentHospitalId');
    if (!val) {
      // Check if user is super admin
      const userData = localStorage.getItem('data');
      if (userData) {
        const user = JSON.parse(userData);
        const userRole = user.userRole;
        if (userRole === 'globalsuperadmin' || userRole === 'superadmin') {
          // Super admins need to select a hospital to work with
          // Return null only if no hospital is selected
          return null;
        }
      }
      // Default to hospital ID 1 for regular users if not set
      this.setCurrentHospitalId(1);
      return 1;
    }
    return val ? Number(val) : null;
  }

  // For super admins: returns null when they should see all hospitals data (read operations)
  // For regular users: always returns the hospital ID
  getHospitalIdForViewing(): number | null {
    const userData = localStorage.getItem('data');
    if (userData) {
      const user = JSON.parse(userData);
      const userRole = user.userRole;
      if (userRole === 'globalsuperadmin' || userRole === 'superadmin') {
        // Super admins can see all hospitals data - return null for viewing
        return null;
      }
    }
    // Regular users see only their hospital data
    return this.getCurrentHospitalId();
  }

  // For all users: returns the selected hospital ID for actions (create, update, delete)
  // Super admins MUST have a hospital selected to perform actions
  getHospitalIdForActions(): number {
    const currentId = this.getCurrentHospitalId();
    if (currentId === null) {
      const userData = localStorage.getItem('data');
      if (userData) {
        const user = JSON.parse(userData);
        const userRole = user.userRole;
        if (userRole === 'globalsuperadmin' || userRole === 'superadmin') {
          throw new Error('Super admin must select a hospital before performing this action');
        }
      }
      // Fallback for regular users
      return 1;
    }
    return currentId;
  }

  // Check if current user is super admin
  isSuperAdmin(): boolean {
    const userData = localStorage.getItem('data');
    if (userData) {
      const user = JSON.parse(userData);
      const userRole = user.userRole;
      return userRole === 'globalsuperadmin' || userRole === 'superadmin';
    }
    return false;
  }
}
