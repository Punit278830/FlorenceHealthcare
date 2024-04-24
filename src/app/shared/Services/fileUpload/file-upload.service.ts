import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { IconsultationFiles, IfileUpload } from '../../models/models';
import { Observable } from 'rxjs';
import { api_Url } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  
//private readonly apiUrl="https://localhost:44320/api/";
private readonly apiUrl=api_Url;


  constructor(private _http:ApiHttpService) { }

getUpodedFileByAppointment(appointmentid:number):Observable<IfileUpload[]>
{
  return this._http.get(this.apiUrl+'FilesUploads/appointmentId/'+appointmentid,{ responseType: 'text' })
}

getFileById(fileId:number):Observable<IfileUpload>
{
  return this._http.get(this.apiUrl+"FilesUploads/"+fileId);

}

  uploadFiletoDataBase(data:IfileUpload):Observable<any>
  {
    return this._http.post(this.apiUrl+'FilesUploads',data)
  }



  // file upload code for Consulation 

   uploadConsultationFile(data:IconsultationFiles):Observable<any>
  {
    return this._http.post(this.apiUrl+'ConsultationFiles',data)
  }

  getConsultationFileByAppointment(appointmentid:number):Observable<IconsultationFiles[]>
{
  return this._http.get(this.apiUrl+'ConsultationFiles/'+appointmentid)
}

}
