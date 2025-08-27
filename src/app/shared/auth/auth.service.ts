import { Injectable } from '@angular/core';
import { ApiHttpService } from '../apiService/apiHttpService';
import { IstaffInfo, Ilogin, HospitalModel } from '../models/models';
import { catchError, map, Observable, throwError } from 'rxjs';
import { api_Url } from 'src/environment/environment';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private resultData!: IstaffInfo;
  private userRole!: string;
  public authentication: Ilogin = {} as Ilogin;
  private readonly apiUrl = api_Url;
  constructor(private http: ApiHttpService) {

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
        
        const logingData=JSON.stringify(this.authentication)
        this.userRole=data.designation;

        //localStorage.setItem('userRole',data.designation);
        localStorage.setItem('data',logingData)

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
      console.error('User not found or incorrect credentials.');
      return throwError('User not found or incorrect credentials.');
    } else {
      console.error('An error occurred:', error.error.message || error.message);
      return throwError('Error occurred while logging in. Please try again.');
    }
  }

}
