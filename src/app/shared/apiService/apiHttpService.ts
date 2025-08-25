// Angular Modules 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IstaffInfo } from '../models/models';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {
  constructor(
    // Angular Modules 
    private http: HttpClient
  ) { }

  private withHospitalHeader(options?: any): any {
    const hospitalId = localStorage.getItem('currentHospitalId');
    if (!hospitalId) return options || {};

    const headers = new HttpHeaders(options?.headers || {}).set('X-Hospital-Id', hospitalId);
    return { ...(options || {}), headers };
  }

  public get(url: string, options?: any): Observable<any> {
    return this.http.get(url, this.withHospitalHeader(options));
  }


  public post(url: string, data: any, options?: any) {
    return this.http.post(url, data, this.withHospitalHeader(options));
  }
  public put(url: string, data: any, options?: any) {
    return this.http.put(url, data, this.withHospitalHeader(options));
  }
  public delete(url: string, options?: any) {
    return this.http.delete(url, this.withHospitalHeader(options));
  }
}