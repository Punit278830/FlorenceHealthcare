import { Injectable } from '@angular/core';
import { IMedicationGroup, IMedicinesGroup } from '../../models/models';
import { Observable } from 'rxjs';
import { api_Url } from 'src/environment/environment';
import { ApiHttpService } from '../../apiService/apiHttpService';

@Injectable({
  providedIn: 'root'
})
export class MedicinesGroupService {

  private readonly apiUrl = api_Url;
  constructor(private http: ApiHttpService) {
    console.log();
  }

  addMedicineGroup(medDetails: IMedicinesGroup): Observable<any> {
    return this.http.post(this.apiUrl + 'MedicinesGroup', medDetails)
  }

  getAllMedicinesGroup(): Observable<IMedicinesGroup[]> {
    return this.http.get(this.apiUrl + 'MedicinesGroup');
  }

  getMedicinesGroup(id: number): Observable<IMedicinesGroup[]> {
    return this.http.get(this.apiUrl + 'MedicinesGroup/', id);
  }

  deleteMedicinesGroup(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'MedicinesGroup/' + id)
  }

  updateMedicinesGroup(id: number, data: IMedicinesGroup) {
    return this.http.put(this.apiUrl + "MedicinesGroup/" + id, data)
  }

  submitMedicationGroup(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'MedicationGroup', data)
  }

  getMedicationByGroupId(id: number): Observable<IMedicationGroup[]> {
    return this.http.get(this.apiUrl + "MedicationGroup/" + id)
  }

  getAllMedicationGroups(): Observable<IMedicationGroup[]> {
    return this.http.get(this.apiUrl + "MedicationGroup")
  }

  deleteMedicationGroup(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'MedicationGroup/' + id)
  }

  updateMedicationGroup(id: number, data: IMedicationGroup) {
    return this.http.put(this.apiUrl + "MedicationGroup/" + id, data)
  }

}
