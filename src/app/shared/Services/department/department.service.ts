import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Idepartment } from '../../models/models';
import { Observable } from 'rxjs';
import { api_Url } from 'src/environment/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
   

//private readonly apiUrl="https://localhost:44320/api/";
private readonly apiUrl=api_Url;
public departmentId!:number;


  constructor(private _http:ApiHttpService) { }

  getDepartmentList():Observable<Idepartment[]>
  {
    return this._http.get(this.apiUrl+'DepartmentInfoes')
  }

  getDepartmentByID(id:number)
  {
    return this._http.get(this.apiUrl+'DepartmentInfoes/'+id)
  }

  createDepartment(DepartmentName:Idepartment)
  {
    
    return this._http.post(this.apiUrl+'DepartmentInfoes',DepartmentName )
    
  }

  updateDepartment(id:number ,departmentData:Idepartment)
  {
    
    return this._http.put(this.apiUrl+'DepartmentInfoes/'+id,departmentData);
    
  }
  deleteDepartment(idhere:number){
    return this._http.delete(this.apiUrl+'DepartmentInfoes/'+idhere);
  }
}
