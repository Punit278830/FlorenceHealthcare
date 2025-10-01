import { Injectable } from '@angular/core';
import { HospitalService } from './hospital.service';
import { HospitalModel } from '../../models/models';
import { LocalStorageUtil } from '../../utils/local-storage.util';

@Injectable({
  providedIn: 'root'
})
export class HospitalInitService {
  
  constructor(private hospitalService: HospitalService) {}

  initializeHospital(): void {
    // Check if hospital ID is already set
    const currentHospitalId = this.hospitalService.getCurrentHospitalId();
    
    if (!currentHospitalId) {
      // Check if user is super admin
      const user = LocalStorageUtil.getUserData();
      const userRole = user?.userRole;
      const isSuperAdmin = userRole === 'globalsuperadmin' || userRole === 'superadmin';
      
      // Load hospitals and set default to first available
      this.hospitalService.getHospitals().subscribe({
        next: (hospitals: HospitalModel[]) => {
          if (hospitals && hospitals.length > 0) {
            if (!isSuperAdmin) {
              // Only set default hospital for regular users
              this.hospitalService.setCurrentHospitalId(hospitals[0].hospitalId || 1);
            }
            // Super admins remain with null - they need to explicitly select a hospital
          } else if (!isSuperAdmin) {
            // Default to hospital ID 1 only for regular users
            this.hospitalService.setCurrentHospitalId(1);
          }
          // Super admins without hospitals available will remain with null,
          // which will prompt them to configure hospitals first
        },
        error: (error: any) => {
          console.error('Failed to load hospitals:', error);
          if (!isSuperAdmin) {
            // Default to hospital ID 1 only for regular users if loading fails
            this.hospitalService.setCurrentHospitalId(1);
          }
        }
      });
    }
  }
}
