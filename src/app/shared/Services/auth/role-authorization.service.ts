import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';

export interface UserRole {
  roleId: number;
  roleName: string;
  roleDisplayName: string;
  roleDescription: string;
  hospitalId: number;
  isActive: boolean;
}

export interface UserPermissions {
  canAccessHospitalManagement: boolean;
  canAccessAllHospitals: boolean;
  canManageStaff: boolean;
  canViewReports: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isReceptionist: boolean;
  isNurse: boolean;
  isDoctor: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoleAuthorizationService {
  private currentUserRoleSubject = new BehaviorSubject<UserRole | null>(null);
  private currentPermissionsSubject = new BehaviorSubject<UserPermissions | null>(null);
  
  currentUserRole$ = this.currentUserRoleSubject.asObservable();
  currentPermissions$ = this.currentPermissionsSubject.asObservable();

  constructor(private http: ApiHttpService) {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const storedRole = localStorage.getItem('userRole');
    const storedRoleData = localStorage.getItem('userRoleData');
    
    if (storedRole && storedRoleData) {
      try {
        const roleData = JSON.parse(storedRoleData);
        this.setUserRole(roleData);
      } catch (error) {
        console.error('Error parsing stored role data:', error);
      }
    }
  }

  setUserRole(role: UserRole): void {
    this.currentUserRoleSubject.next(role);
    const permissions = this.calculatePermissions(role);
    this.currentPermissionsSubject.next(permissions);
    
    // Store in localStorage
    localStorage.setItem('userRole', role.roleName);
    localStorage.setItem('userRoleData', JSON.stringify(role));
    localStorage.setItem('userPermissions', JSON.stringify(permissions));
  }

  private calculatePermissions(role: UserRole): UserPermissions {
    const roleName = role.roleName.toLowerCase();
    
    return {
      canAccessHospitalManagement: roleName === 'superadmin' || roleName === 'globalsuperadmin',
      canAccessAllHospitals: roleName === 'superadmin' || roleName === 'globalsuperadmin',
      canManageStaff: roleName === 'superadmin' || roleName === 'globalsuperadmin' || roleName === 'admin',
      canViewReports: roleName === 'superadmin' || roleName === 'globalsuperadmin' || roleName === 'admin',
      isSuperAdmin: roleName === 'superadmin' || roleName === 'globalsuperadmin',
      isAdmin: roleName === 'admin',
      isReceptionist: roleName === 'receptionist',
      isNurse: roleName === 'nurse',
      isDoctor: roleName === 'doctor'
    };
  }

  getCurrentRole(): UserRole | null {
    return this.currentUserRoleSubject.value;
  }

  getCurrentPermissions(): UserPermissions | null {
    return this.currentPermissionsSubject.value;
  }

  isSuperAdmin(): boolean {
    const permissions = this.getCurrentPermissions();
    return permissions?.isSuperAdmin || false;
  }

  canAccessHospitalManagement(): boolean {
    const permissions = this.getCurrentPermissions();
    return permissions?.canAccessHospitalManagement || false;
  }

  canAccessAllHospitals(): boolean {
    const permissions = this.getCurrentPermissions();
    return permissions?.canAccessAllHospitals || false;
  }

  canManageStaff(): boolean {
    const permissions = this.getCurrentPermissions();
    return permissions?.canManageStaff || false;
  }

  getUserRoleByStaffId(staffId: number): Observable<UserRole> {
    return this.http.get(`${api_Url}RoleMaster/GetUserRole/${staffId}`);
  }

  getAllRolesByHospital(hospitalId: number): Observable<UserRole[]> {
    return this.http.get(`${api_Url}RoleMaster/GetRolesByHospital/${hospitalId}`);
  }

  clearRole(): void {
    this.currentUserRoleSubject.next(null);
    this.currentPermissionsSubject.next(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleData');
    localStorage.removeItem('userPermissions');
  }

  refreshUserRole(staffId: number): Observable<UserRole> {
    return this.getUserRoleByStaffId(staffId).pipe(
      map((role: UserRole) => {
        this.setUserRole(role);
        return role;
      })
    );
  }
}
