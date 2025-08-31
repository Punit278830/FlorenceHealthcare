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
    const hospitalId = localStorage.getItem('currentHospitalId') || '1'; // Default to hospital ID 1
    console.log('ApiHttpService: Using hospital ID:', hospitalId);
    console.log('ApiHttpService: Original options:', options);
    
    // Create a new HttpHeaders object properly
    let headers: HttpHeaders;
    
    if (options?.headers) {
      // If headers are already HttpHeaders, clone them
      if (options.headers instanceof HttpHeaders) {
        headers = options.headers.set('X-Hospital-Id', hospitalId);
      } else {
        // If headers are a plain object, create new HttpHeaders
        headers = new HttpHeaders(options.headers).set('X-Hospital-Id', hospitalId);
      }
    } else {
      // No existing headers, create new ones
      headers = new HttpHeaders().set('X-Hospital-Id', hospitalId);
    }
    
    console.log('ApiHttpService: Final headers:', headers);
    
    return { 
      ...options,
      headers 
    };
  }

  public get(url: string, options?: any): Observable<any> {
    return this.http.get(url, this.withHospitalHeader(options));
  }


  public post(url: string, data: any, options?: any) {
    const hospitalId = localStorage.getItem('currentHospitalId') || '1';
    
    // Create headers directly without merging conflicts
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Hospital-Id': hospitalId
    });
    
    console.log('ApiHttpService POST: URL:', url);
    console.log('ApiHttpService POST: Headers:', headers);
    console.log('ApiHttpService POST: Data:', data);
    
    return this.http.post(url, data, { 
      ...options,
      headers 
    });
  }
  public put(url: string, data: any, options?: any) {
    return this.http.put(url, data, this.withHospitalHeader(options));
  }
  public delete(url: string, options?: any) {
    return this.http.delete(url, this.withHospitalHeader(options));
  }
}