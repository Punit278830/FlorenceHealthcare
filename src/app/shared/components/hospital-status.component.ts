import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../Services/hospital/hospital.service';
import { HospitalModel } from '../models/models';

@Component({
  selector: 'app-hospital-status',
  template: `
    <div class="hospital-status" *ngIf="currentHospitalName">
      <div class="alert alert-info d-flex align-items-center" role="alert">
        <i class="fa fa-hospital-o me-2"></i>
        <div>
          <strong>Current Hospital:</strong> {{ currentHospitalName }}
          <button *ngIf="hospitals.length > 1" 
                  class="btn btn-sm btn-outline-primary ms-3" 
                  data-bs-toggle="modal" 
                  data-bs-target="#hospitalSwitchModal">
            Switch Hospital
          </button>
        </div>
      </div>
    </div>

    <!-- Hospital Switch Modal -->
    <div class="modal fade" id="hospitalSwitchModal" tabindex="-1" aria-labelledby="hospitalSwitchModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="hospitalSwitchModalLabel">Switch Hospital</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="list-group">
              <a *ngFor="let hospital of hospitals" 
                 class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                 (click)="selectHospital(hospital)"
                 [class.active]="hospital.hospitalId === currentHospitalId"
                 style="cursor: pointer;">
                <div>
                  <i class="fa fa-hospital-o me-2"></i>
                  {{ hospital.name }}
                </div>
                <i *ngIf="hospital.hospitalId === currentHospitalId" class="fa fa-check text-success"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hospital-status {
      margin-bottom: 1rem;
    }
    .list-group-item.active {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
  `]
})
export class HospitalStatusComponent implements OnInit {
  hospitals: HospitalModel[] = [];
  currentHospitalId: number | null = null;
  currentHospitalName: string = '';

  constructor(private hospitalService: HospitalService) {}

  ngOnInit(): void {
    this.loadHospitals();
    this.currentHospitalId = this.hospitalService.getCurrentHospitalId();
    this.updateCurrentHospitalName();
    
    // Subscribe to hospital changes
    this.hospitalService.currentHospitalId$.subscribe(id => {
      this.currentHospitalId = id;
      this.updateCurrentHospitalName();
    });
  }

  private loadHospitals(): void {
    this.hospitalService.getHospitals().subscribe({
      next: (hospitals) => {
        this.hospitals = hospitals;
        this.updateCurrentHospitalName();
      },
      error: (error) => {

      }
    });
  }

  private updateCurrentHospitalName(): void {
    if (this.currentHospitalId && this.hospitals.length > 0) {
      const hospital = this.hospitals.find(h => h.hospitalId === this.currentHospitalId);
      this.currentHospitalName = hospital?.name || 'Unknown Hospital';
    } else {
      this.currentHospitalName = 'No Hospital Selected';
    }
  }

  public selectHospital(hospital: HospitalModel): void {
    if (hospital.hospitalId) {
      this.hospitalService.setCurrentHospitalId(hospital.hospitalId);
    }
    // Close modal
    const modal = document.getElementById('hospitalSwitchModal');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
    // Optionally refresh the page to reload data with new hospital
    window.location.reload();
  }
}
