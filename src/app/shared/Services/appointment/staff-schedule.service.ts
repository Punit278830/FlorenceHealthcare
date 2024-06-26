import { Injectable } from '@angular/core';
import { api_Url } from 'src/environment/environment';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Istaffschedule } from '../../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffScheduleService {
private readonly apiUrl=api_Url;
  public scheduleId!:number;
  constructor(private _http:ApiHttpService) {
  
  }

  getStaffScheduleByStaffId(id:number):Observable<Istaffschedule[]>
  {
    return this._http.get(this.apiUrl+'StaffSchedules/StaffId/'+id)
  }

  addStaffSchedule(staffData:Istaffschedule)
  {
    return this._http.post(this.apiUrl+'StaffSchedules',staffData)
  }

  getSelectedSchedule(id:number):Observable<Istaffschedule>
  {
    return this._http.get(this.apiUrl+'StaffSchedules/'+id);
  }

  updateSchedule(id:number,scheduleData:Istaffschedule)
  {
    return this._http.put(this.apiUrl+'StaffSchedules/'+id,scheduleData);
  }

  deleteScheuleById(id:number)
  {
    return this._http.delete(this.apiUrl+'StaffSchedules/'+id)

  }

  getStaffOnLeve(staffId:number,appointmenrDate:Date):Observable<Istaffschedule[]>
  {
    return this._http.get(this.apiUrl+'StaffSchedules/'+staffId+'/'+appointmenrDate);
  }
}
