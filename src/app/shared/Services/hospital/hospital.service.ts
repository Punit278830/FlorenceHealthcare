import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { HospitalModel } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private currentHospitalIdSubject = new BehaviorSubject<number | null>(this.getCurrentHospitalId());
  currentHospitalId$ = this.currentHospitalIdSubject.asObservable();

  constructor(private http: ApiHttpService) {}

  getHospitals(): Observable<HospitalModel[]> {
    return this.http.get(api_Url + 'Hospitals');
  }

  setCurrentHospitalId(id: number | null) {
    if (id == null) {
      localStorage.removeItem('currentHospitalId');
    } else {
      localStorage.setItem('currentHospitalId', String(id));
    }
    this.currentHospitalIdSubject.next(id);
  }

  getCurrentHospitalId(): number | null {
    const val = localStorage.getItem('currentHospitalId');
    if (!val) {
      // Default to hospital ID 1 if not set
      this.setCurrentHospitalId(1);
      return 1;
    }
    return val ? Number(val) : null;
  }
}
