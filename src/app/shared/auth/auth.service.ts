import { Injectable } from '@angular/core';
import { ApiHttpService } from '../apiService/apiHttpService';
import { IstaffInfo, Ilogin, HospitalModel } from '../models/models';
import { catchError, map, Observable, throwError } from 'rxjs';
import { api_Url } from 'src/environment/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleAuthorizationService } from '../Services/auth/role-authorization.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private resultData!: IstaffInfo;
  private userRole!: string;
  public authentication: Ilogin = {} as Ilogin;
  private readonly apiUrl = api_Url;
  constructor(private http: ApiHttpService, private roleService: RoleAuthorizationService) {

  }

  decodeArrayBuffer(arrayBuffer: ArrayBuffer): string {
    // Assuming the ArrayBuffer contains text data (adjust accordingly based on your use case)
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(arrayBuffer);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}StaffInfoes/${email}/${password}`).pipe(
      map((data: any) => {
        const staffInfo: IstaffInfo = data;

        localStorage.clear();
        this.authentication.fname=data.firstName;
        this.authentication.lname=data.lastName;
        this.authentication.userRole=(data.designation.toLowerCase());
        data.activeStatus==1?this.authentication.loginStatus=true:this.authentication.loginStatus=false;
        this.authentication.loginId=data.staffId;
        this.authentication.departmentId=data.departmentId;
        
        // Store hospital ID from user's profile for multi-tenant support
        if (data.hospitalId) {
          localStorage.setItem('currentHospitalId', data.hospitalId.toString());
        } else {
          // Default to hospital ID 1 if not provided
          localStorage.setItem('currentHospitalId', '1');
        }
        
        // Store staff ID for Super Admin detection in API calls
        localStorage.setItem('currentStaffId', data.staffId.toString());
        
        const logingData=JSON.stringify(this.authentication)
        this.userRole=data.designation;

        //localStorage.setItem('userRole',data.designation);
        localStorage.setItem('data',logingData)

        // Fetch and set user role information for role-based access control
        this.roleService.getUserRoleByStaffId(data.staffId).subscribe({
          next: (roleData) => {
            this.roleService.setUserRole(roleData);
            // Update the authentication object with the proper role
            this.authentication.userRole = roleData.roleName.toLowerCase();
            this.userRole = roleData.roleName;
            
            // Update localStorage with the correct role
            const updatedLoginData = JSON.stringify(this.authentication);
            localStorage.setItem('data', updatedLoginData);
            localStorage.setItem('authenticated', 'true');
          },
          error: (error) => {

            // Create a default role based on designation if role fetch fails
            const defaultRole = {
              roleId: 0,
              roleName: data.designation.toLowerCase(),
              roleDisplayName: data.designation,
              roleDescription: data.designation,
              hospitalId: data.hospitalId || 1,
              isActive: true
            };
            this.roleService.setUserRole(defaultRole);
            localStorage.setItem('authenticated', 'true');
          }
        });

        return staffInfo;
      }),
      catchError(this.handleError)
    );
  }

  getHospitals(): Observable<HospitalModel[]> {
    return this.http.get(`${this.apiUrl}Hospitals`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {

      return throwError('User not found or incorrect credentials.');
    } else {

      return throwError('Error occurred while logging in. Please try again.');
    }
  }

  logout(): void {
    localStorage.clear();
    this.roleService.clearRole();
    this.authentication = {} as Ilogin;
    this.userRole = '';
  }

  getCurrentUserRole(): Observable<any> {
    return this.roleService.currentUserRole$;
  }

  getCurrentPermissions(): Observable<any> {
    return this.roleService.currentPermissions$;
  }

  isSuperAdmin(): boolean {
    return this.roleService.isSuperAdmin();
  }

  canAccessHospitalManagement(): boolean {
    return this.roleService.canAccessHospitalManagement();
  }

}
