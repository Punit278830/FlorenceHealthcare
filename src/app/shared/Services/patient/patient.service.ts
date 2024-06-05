import { Injectable } from '@angular/core';
import { IpatientInfo } from '../../models/models';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Observable, catchError, throwError } from 'rxjs';
import { api_Url } from 'src/environment/environment';
import { HttpErrorResponse } from '@angular/common/http';

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

  getPatientdateange(sdate: any, edate: any): Observable<IpatientInfo[]> {
    return this._http.get(this.apiUrl + 'PatientInfoes/regestrationDateRange/' + sdate + '/' + edate)

  }


<<<<<<< HEAD
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
=======
  getPatientData(id: number) {
    return this._http.get(this.apiUrl + 'PatientInfoes/' + id);
  }
  serarchPatient(data: string) {
    return this._http.get(this.apiUrl + "PatientInfoes/SearchData?data=" + data)
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err.error);
  }
>>>>>>> 5a1a9d9d02198ca3846bef7ea407c12d87fc178a
}



