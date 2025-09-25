// Angular Modules 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IstaffInfo } from '../models/models';
import { Observable } from 'rxjs';
import { HospitalService } from '../Services/hospital/hospital.service';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {
  constructor(
    // Angular Modules 
    private http: HttpClient,
    private hospitalService: HospitalService
  ) { }

  private withHospitalHeader(options?: any, forceHospitalId?: number | null): any {
    // Use provided hospitalId, or get from service
    const hospitalId = forceHospitalId !== undefined ? forceHospitalId : this.hospitalService.getCurrentHospitalId();
    const staffId = localStorage.getItem('currentStaffId'); // Get current staff ID
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get user's timezone
    
    // Create a new HttpHeaders object properly
    let headers: HttpHeaders;
    
    if (options?.headers) {
      // If headers are already HttpHeaders, clone them
      if (options.headers instanceof HttpHeaders) {
        headers = options.headers.set('X-Time-Zone', timeZone);
        if (hospitalId !== null) {
          headers = headers.set('X-Hospital-Id', hospitalId.toString());
        }
        if (staffId) {
          headers = headers.set('X-Staff-Id', staffId);
        }
      } else {
        // If headers are a plain object, create new HttpHeaders
        headers = new HttpHeaders(options.headers).set('X-Time-Zone', timeZone);
        if (hospitalId !== null) {
          headers = headers.set('X-Hospital-Id', hospitalId.toString());
        }
        if (staffId) {
          headers = headers.set('X-Staff-Id', staffId);
        }
      }
    } else {
      // No existing headers, create new ones
      headers = new HttpHeaders().set('X-Time-Zone', timeZone);
      if (hospitalId !== null) {
        headers = headers.set('X-Hospital-Id', hospitalId.toString());
      }
      if (staffId) {
        headers = headers.set('X-Staff-Id', staffId);
      }
    }
    
    return { 
      ...options,
      headers 
    };
  }

  public get(url: string, options?: any, forceHospitalId?: number | null): Observable<any> {
    return this.http.get(url, this.withHospitalHeader(options, forceHospitalId));
  }


  public post(url: string, data: any, options?: any, forceHospitalId?: number | null) {
    // Use provided hospitalId, or get from service  
    const hospitalId = forceHospitalId !== undefined ? forceHospitalId : this.hospitalService.getCurrentHospitalId();
    const staffId = localStorage.getItem('currentStaffId');
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Create headers directly without merging conflicts
    let headerObj: any = {
      'Content-Type': 'application/json',
      'X-Time-Zone': timeZone,
    };
    
    if (hospitalId !== null) {
      headerObj['X-Hospital-Id'] = hospitalId.toString();
    }
    
    if (staffId) {
      headerObj['X-Staff-Id'] = staffId;
    }
    
    const headers = new HttpHeaders(headerObj);
    
    return this.http.post(url, data, { 
      ...options,
      headers 
    });
  }
  
  public put(url: string, data: any, options?: any, forceHospitalId?: number | null) {
    return this.http.put(url, data, this.withHospitalHeader(options, forceHospitalId));
  }
  
  public delete(url: string, options?: any, forceHospitalId?: number | null) {
    return this.http.delete(url, this.withHospitalHeader(options, forceHospitalId));
  }
  
  // Convenience methods for different scenarios
  
  // For viewing/listing data - super admins see all hospitals, regular users see their hospital
  public getForViewing(url: string, options?: any): Observable<any> {
    const hospitalId = this.hospitalService.getHospitalIdForViewing();
    return this.get(url, options, hospitalId);
  }
  
  // For actions (create, update, delete) - always uses selected hospital, throws error if super admin hasn't selected one
  public getForActions(url: string, options?: any): Observable<any> {
    try {
      const hospitalId = this.hospitalService.getHospitalIdForActions();
      return this.get(url, options, hospitalId);
    } catch (error) {
      throw error;
    }
  }
  
  public postForActions(url: string, data: any, options?: any) {
    try {
      const hospitalId = this.hospitalService.getHospitalIdForActions();
      return this.post(url, data, options, hospitalId);
    } catch (error) {
      throw error;
    }
  }
  
  public putForActions(url: string, data: any, options?: any) {
    try {
      const hospitalId = this.hospitalService.getHospitalIdForActions();
      return this.put(url, data, options, hospitalId);
    } catch (error) {
      throw error;
    }
  }
  
  public deleteForActions(url: string, options?: any) {
    try {
      const hospitalId = this.hospitalService.getHospitalIdForActions();
      return this.delete(url, options, hospitalId);
    } catch (error) {
      throw error;
    }
  }
}