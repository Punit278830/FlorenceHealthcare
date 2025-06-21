import { Injectable } from '@angular/core';
import { IpatientInfo } from '../../models/models';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Observable, catchError, throwError } from 'rxjs';
import { api_Url } from '../../../../environment/environment';
import { HttpErrorResponse } from '@angular/common/http';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  //private staffDto!:IstaffInfo;
  //private readonly apiUrl="https://localhost:44320/api/";
  private readonly apiUrl = api_Url;
  public patientId!: number;
  public patintDataForOPD!: IpatientInfo;
  //public patientId!:number

  constructor(private _http: ApiHttpService) { }

  CreatePatient(patientData: IpatientInfo): Observable<any> {
    return this._http.post(this.apiUrl + "PatientInfoes", patientData).pipe(
      catchError(this.handleError)
    );
  }

  updatePatientData(id: number, patientData: IpatientInfo) {
    return this._http.put(this.apiUrl + "PatientInfoes/" + id, patientData)
  }

  getPatientList(): Observable<IpatientInfo[]> {
    return this._http.get(this.apiUrl + 'PatientInfoes')

  }

  getPatientCountByGender(): Observable<IpatientInfo[]> {
    return this._http.get(this.apiUrl + 'PatientInfoes/PatientCountByGender')
  }

  getPatientCountByDepartment() {
    return this._http.get(this.apiUrl + 'DepartmentInfoes/PatientCountByDepartment')
  }


  getPatientdateange(sdate: any, edate: any): Observable<IpatientInfo[]> {
    sdate = dayjs(sdate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    edate = dayjs(edate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    return this._http.get(this.apiUrl + 'PatientInfoes/regestrationDateRange/' + sdate + '/' + edate)

  }



getPatientData(id:number)
{
  return this._http.get(this.apiUrl+'PatientInfoes/'+id);
}
serarchPatient(data:string)
{
  return this._http.get(this.apiUrl+"PatientInfoes/SearchData?data="+data)
}
deletePatient(id:number){
  return this._http.delete(this.apiUrl+"PatientInfoes/"+id)

}

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err.error);
  }

}



