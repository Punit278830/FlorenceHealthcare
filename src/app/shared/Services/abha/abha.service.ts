import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { Observable } from 'rxjs/internal/Observable';
import { HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { blob } from 'stream/consumers';
import { catchError, map, retry, throwError } from 'rxjs';
import { IAbhaDetails, IAbhaPatientDetails, IAbhaPatientInfo } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class AbhaService {
  private readonly apiUrl = api_Url;

  constructor(private http: ApiHttpService) {
    console.log();
  }

  generateOtp(aadhar: string): Observable<any> {
    let data = {
      EncryptedData: aadhar
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/GenerateAadharOtp', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  generateOtherOtp(mobile: string, txnId: string): Observable<any> {
    let data = {
      EncryptedData: mobile,
      TxnId: txnId
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/GenerateOtherOtp', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  confirmOtp(otp: string, txnId: string, mobileNumber: string): Observable<any> {
    let data = {
      EncryptedData: otp,
      MobileNumber: mobileNumber,
      TxnId: txnId
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/EnrollByAadhaar', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  confirmOtherOtp(otp: string, txnId: string, mobileNumber: string): Observable<any> {
    let data = {
      EncryptedData: otp,
      MobileNumber: mobileNumber,
      TxnId: txnId
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/EnrollByAbdm', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  downloadCard(xToken: string): Observable<any> {
    const authReq = new HttpHeaders()
      .set('xToken', xToken);

    return this.http.get(this.apiUrl + 'Abha/DownloadAbhaCard', { headers: authReq, responseType: "blob" });
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err.error);
  }

  searchUserByAbhaNumber(abhaNumber: string): Observable<any> {
    let data = {
      EncryptedData: abhaNumber
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/SearchUserByHealthId', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  generateOtpforAbhaAddress(keyData: string): Observable<any> {
    let data = {
      EncryptedData: keyData,
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/GenerateMobileOtpForAbhaAddress', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  confirmOtpforAbhaAddress(keyData: string, txnId: string): Observable<any> {
    let data = {
      EncryptedData: keyData,
      TxnId: txnId
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/ConfirmMobileOtpForAbhaAddress', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // ABHA Address creation methods

  generateOtpForAddressCreation(aabha: string, authMethod: string): Observable<any> {
    let data = {
      healhtIdNumber: aabha,
      authMethod: authMethod
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/AbhaAddressViaAbhaOtp', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  verifyOtpForAddressCreation(txnId: string, otp: string): Observable<any> {
    let data = {
      EncryptedData: otp,
      TxnId: txnId
    };


    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/AbhaAddressViaAbhaVerifyOTP', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAbhaAddressSuggestions(txnId: string): Observable<any> {
    let data = {
      EncryptedData: "",
      txnId: txnId
    };


    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/AbhaAddressSuggestions', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  checkIfAbhaAddressexists(phrAddress: string): Observable<any> {
    
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.get(this.apiUrl + 'Abha/AbhaAddressSuggestions?phrAddress=' + phrAddress).pipe(
      catchError(this.handleError)
    );
  }

  createAbhaAddress(txnId: string, phrAddress: string): Observable<any> {
    let data = {
      phrAddress: phrAddress,
      txnId: txnId
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/CreatePHRAddress', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createAbhaDetails(details: IAbhaDetails): Observable<any> {
    let data = {
      firstName: details.firstName,
      middleName: details.middleName,
      lastName: details.lastName,
      
      dayOfBirth: details.dayOfBirth,
      monthOfBirth: details.monthOfBirth,
      yearOfBirth: details.yearOfBirth,

      gender: "F",
      countryCode: "+91",
      mobile: details.mobile,
      
      email: details.email,
      address: details.address,
      
      pinCode: details.pinCode,
      stateCode: details.stateCode,
      districtCode: details.districtCode,
       
      transactionId: details.transactionId
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/CreateAbhaDetails', JSON.stringify(details), httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  createAbhaAddressViaMobile(txnId: string, phrAddress: string): Observable<any> {
    let data = {
      phrAddress: phrAddress,
      txnId: txnId
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post(this.apiUrl + 'Abha/CreateAbhaAddressViaMobile', JSON.stringify(data), httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addPatient(patientData: IAbhaPatientInfo): Observable<any> {
    return this.http.post(this.apiUrl + "PatientInfoes", patientData).pipe(
      catchError(this.handleError)
    );
  }

  getAbhaPatients(): Observable<IAbhaPatientDetails[]> {
    return this.http.get(this.apiUrl + 'Abha/ScanDesk/Patients').pipe(
      catchError(this.handleError)
    );
  }
}
