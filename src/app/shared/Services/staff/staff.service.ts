import { Injectable } from '@angular/core';
import { IstaffInfo } from '../../models/models';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Observable } from 'rxjs';
import { api_Url } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
private staffDto!:IstaffInfo;
//private readonly apiUrl="https://localhost:44320/api/";
private readonly apiUrl=api_Url;
public staffId!:number


  constructor(private _http:ApiHttpService) { }
  
  CreateStaff(staffData:IstaffInfo)
{
  return this._http.post(this.apiUrl+"StaffInfoes",staffData);

}

updateStaff(id:number,staffData:IstaffInfo){
 return this._http.put(this.apiUrl+"StaffInfoes/"+id,staffData)
}

 getStaffList():Observable<IstaffInfo[]>
{
 return this._http.get( this.apiUrl+'StaffInfoes')

}

getStaffByID(id:number):Observable<IstaffInfo>
{
 return this._http.get( this.apiUrl+'StaffInfoes/'+id)

}
getDoctorsList():Observable<IstaffInfo[]>
{
 return this._http.get( this.apiUrl+'StaffInfoes/doctors')

}

getStaff(id:number)
{
  return this._http.get(this.apiUrl+'StaffInfoes/'+id)
}

getDoctorsListByDepartment(id:number)
{
  {
  return this._http.get(this.apiUrl+'StaffInfoes/doctorsByDepartment?id='+id)
}
}
}


