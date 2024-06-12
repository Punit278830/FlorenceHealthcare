import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { Iappointment, IstaffInfo } from '../../models/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  
  //private readonly apiUrl="https://localhost:44320/api/";
  private readonly apiUrl=api_Url;
  public appointmentId!:number;
  public appoinmentStatus=true;
  constructor(private _http:ApiHttpService) {
  
  }
  
   getAppointmentList()
   {
     return this._http.get(this.apiUrl+'appointmentInfoes');
   }
   getAppointmentById(id:number)
   {
    return this._http.get(this.apiUrl+'appointmentInfoes/'+id);
    

   }

   getAppointmentByDoctorId(doctorId:number)
   {
    return this._http.get(this.apiUrl+'appointmentInfoes/doctor/'+doctorId);
    
   }

   getappointmentByIdAndDate(doctorId:number,from:any,to:any):Observable<Iappointment>
   {
      return this._http.get(this.apiUrl+`appointmentInfoes/doctor/${doctorId}/${from}/${to}`)

   }

   getAppointmentByDate(from:any,to:any):Observable<Iappointment>
   {
      return this._http.get(this.apiUrl+`AppointmentInfoes/date/${from}/${to}`)
   }

   getAppointmentCount():Observable<number>
   {
      return this._http.get(this.apiUrl+'AppointmentInfoes/count');
   }

   getAppointmentCountByDoctorId(id:number):Observable<number>
   {
      return this._http.get(this.apiUrl+'AppointmentInfoes/count/'+id);
   }

   getConsultationCount():Observable<number>
   {
      return this._http.get(this.apiUrl+'AppointmentInfoes/ConsultationCount');
   }

   getConsultationByDoctorId(id:number):Observable<number>
   {
      return this._http.get(this.apiUrl+'AppointmentInfoes/ConsultationCount/'+id);
   }

   getEarningByDoctorId(id:number):Observable<number>
   {
      return this._http.get(this.apiUrl+'AppointmentInfoes/Earning/'+id);
   }

   getEarning():Observable<number>
   {
      return this._http.get(this.apiUrl+'AppointmentInfoes/Earning');
   }

   createAppointment(apointmentData:Iappointment)
   {
return this._http.post(this.apiUrl+'appointmentInfoes/',apointmentData);
   }

updateAppointment(id:number,apointmentData:Iappointment)
   {
return this._http.put(this.apiUrl+"appointmentInfoes/"+id,apointmentData);
   }


   getAppointmentListByPatientId(patientId:number,year:number):Observable<Iappointment[]>
   {
      return this._http.get(this.apiUrl+'AppointmentInfoes/appointmentList/'+patientId+"/"+year);
   }

   //get age by Dob

   calculateDateDifference(dob:Date):number {
    const start = new Date(dob);
    const end = new Date();
    // Calculate the difference in years
    const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
    const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
    
    return yearsDifference;
    
  }
  deleteAppointment(idhere:number){
   return this._http.delete(this.apiUrl+'AppointmentInfoes/'+idhere);

  }
    

}
