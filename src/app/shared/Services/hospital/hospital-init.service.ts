import { Injectable } from '@angular/core';
import { HospitalService } from './hospital.service';
import { HospitalModel } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class HospitalInitService {
  
  constructor(private hospitalService: HospitalService) {}

  initializeHospital(): void {
    // Check if hospital ID is already set
    const currentHospitalId = this.hospitalService.getCurrentHospitalId();
    
    if (!currentHospitalId) {
      // Load hospitals and set default to first available or ID 1
      this.hospitalService.getHospitals().subscribe({
        next: (hospitals: HospitalModel[]) => {
          if (hospitals && hospitals.length > 0) {
            // Set to first hospital in the list
            this.hospitalService.setCurrentHospitalId(hospitals[0].hospitalId || 1);
          } else {
            // Default to hospital ID 1
            this.hospitalService.setCurrentHospitalId(1);
          }
        },
        error: (error: any) => {

          // Default to hospital ID 1 if loading fails
          this.hospitalService.setCurrentHospitalId(1);
        }
      });
    }
  }
}
