import { Injectable } from '@angular/core';
import { api_Url } from 'src/environment/environment';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Observable } from 'rxjs';
import { IPredefineDiagnosis, Iconsultation, IprescribeMedicine } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ConsultService {
private readonly apiUrl=api_Url;
public diagnosisId!:number;
 
   constructor(private http:ApiHttpService) {
    console.log();
   }

   addConsultationData(data:Iconsultation):Observable<any>
   {
    return this.http.post(this.apiUrl+'ConsultationDatas',data)
   }

   getConsultData(appointmentId:number):Observable<any>
   {
    return this.http.get(this.apiUrl+"ConsultationDatas/"+appointmentId);
   }

//Api to add preDefine diagnosis
createDiagnosis(diagnosData:IPredefineDiagnosis):Observable<any>
{
  return this.http.post(this.apiUrl+"DiagnosisTemplateMasters",diagnosData);
}


GetAllDiagnosis():Observable<IPredefineDiagnosis[]>
{
  return this.http.get(this.apiUrl+"DiagnosisTemplateMasters");
}

GetDiagnosisbyId(id:number):Observable<IPredefineDiagnosis>
{
  return this.http.get(this.apiUrl+"DiagnosisTemplateMasters/"+id);
}

updatediagnosisById(id:number,data:any):Observable<any>
{
  return  this.http.put(this.apiUrl+'DiagnosisTemplateMasters/'+id,data)
}


}
