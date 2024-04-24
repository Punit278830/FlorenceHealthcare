import { Injectable } from '@angular/core';
import { api_Url } from 'src/environment/environment';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Observable } from 'rxjs';
import { ImedicineMaster, IprescribeMedicine } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
 private readonly apiUrl=api_Url;
   constructor(private http:ApiHttpService) {
    console.log();
   }

   getAllMedicine():Observable<ImedicineMaster[]>
   {
    return this.http.get(this.apiUrl+'MedicineMasters');
   }

   searchMedicine(searchText:string):Observable<boolean>
   {
    return this.http.get(this.apiUrl+'MedicineMasters/medName/'+searchText)
   }

   //delete medicine from medicine master
   deleteMedicienById(id:number):Observable<any>
   {
    return this.http.delete(this.apiUrl+'MedicineMasters/',id)
   }

   addMedicine(medDetails:ImedicineMaster):Observable<any>
   {
    return this.http.post(this.apiUrl+'MedicineMasters',medDetails)
   }

   SearchMatchMedicine(medName:string):Observable<ImedicineMaster[]>
   {
    return this.http.get(this.apiUrl+"MedicineMasters/matchMedicineName/"+medName)
   }
   
   submitPrescribeMedicine(medicines:any):Observable<any>
   {
    return this.http.post(this.apiUrl+'PatientMedications',medicines)
   }

   getPrescribeMedicine(appointmentId:number):Observable<IprescribeMedicine[]>
   {
    return this.http.get(this.apiUrl+"PatientMedications/"+appointmentId)
   }

   

  }
