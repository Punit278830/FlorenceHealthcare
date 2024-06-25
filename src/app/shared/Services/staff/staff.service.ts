import { Injectable } from '@angular/core';
import { IstaffInfo } from '../../models/models';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Observable, catchError, throwError } from 'rxjs';
import { api_Url } from 'src/environment/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private staffDto!: IstaffInfo;
  //private readonly apiUrl="https://localhost:44320/api/";
  private readonly apiUrl = api_Url;
  public staffId!: number


  constructor(private _http: ApiHttpService) { }

  getScheduleList(): Observable<IstaffInfo[]> {
    return this._http.get(this.apiUrl + 'StaffSchedules')

  }


  CreateStaff(staffData: IstaffInfo) {
    return this._http.post(this.apiUrl + "StaffInfoes", staffData).pipe(
      catchError(this.handleError)
    );

  }

  updateStaff(id: number, staffData: IstaffInfo) {
    return this._http.put(this.apiUrl + "StaffInfoes/" + id, staffData)
  }

  getStaffList(): Observable<IstaffInfo[]> {
    return this._http.get(this.apiUrl + 'StaffInfoes')

  }

  getStaffByID(id: number): Observable<IstaffInfo> {
    return this._http.get(this.apiUrl + 'StaffInfoes/' + id)

  }
  getDoctorsList(): Observable<IstaffInfo[]> {
    return this._http.get(this.apiUrl + 'StaffInfoes/doctors')

  }

  getStaff(id: number) {
    return this._http.get(this.apiUrl + 'StaffInfoes/' + id)
  }

  getDoctorsListByDepartment(id: number) {
    {
      return this._http.get(this.apiUrl + 'StaffInfoes/doctorsByDepartment?id=' + id)
    }
  }
  deleteStaff(id: number) {
    return this._http.delete(this.apiUrl + 'StaffInfoes/' + id)

  }
  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err.error);
  }
}


