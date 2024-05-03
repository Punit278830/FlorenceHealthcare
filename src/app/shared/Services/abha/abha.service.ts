import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AbhaService {
  private readonly apiUrl=api_Url;

  constructor(private http:ApiHttpService) {
    console.log();
   }

   createAbhaNumber():Observable<any>
   {
    return this.http.post(this.apiUrl+'Abha/GenerateAadharOtp',"data")
   }
}
