import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { Observable } from 'rxjs/internal/Observable';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AbhaService {
  private readonly apiUrl=api_Url;

  constructor(private http:ApiHttpService) {
    console.log();
   }

   generateOtp(aadhar: string):Observable<any>
   {
    let data = {
      EncryptedData: aadhar
    };

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }

    return this.http.post(this.apiUrl+'Abha/GenerateAadharOtp', JSON.stringify(data), httpOptions)
   }

   confirmOtp(otp: string, txnId: string, mobileNumber: string):Observable<any>
   {
    let data = {
      EncryptedData: otp,
      MobileNumber: mobileNumber,
      TxnId: txnId
    };

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }

    return this.http.post(this.apiUrl+'Abha/EnrollByAadhaar', JSON.stringify(data), httpOptions)
   }
}
