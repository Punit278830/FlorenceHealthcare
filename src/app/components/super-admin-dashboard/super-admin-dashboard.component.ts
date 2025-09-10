import { Component, OnInit } from '@angular/core';
import { SuperAdminService, SuperAdminStatus, SystemSummary, HospitalSummary } from '../../shared/Services/super-admin/super-admin.service';

@Component({
  selector: 'app-super-admin-dashboard',
  template: `
    <div class="super-admin-dashboard" *ngIf="superAdminStatus?.isCurrentUserSuperAdmin">
      <div class="header">
        <h2>🌟 Super Admin Dashboard</h2>
        <p>Global system overview and management</p>
      </div>

      <!-- System Summary Cards -->
      <div class="summary-grid" *ngIf="systemSummary">
        <div class="summary-card">
          <h3>{{ systemSummary.totalStaff }}</h3>
          <p>Total Staff</p>
        </div>
        <div class="summary-card">
          <h3>{{ systemSummary.totalPatients }}</h3>
          <p>Total Patients</p>
        </div>
        <div class="summary-card">
          <h3>{{ systemSummary.totalAppointments }}</h3>
          <p>Total Appointments</p>
        </div>
        <div class="summary-card">
          <h3>{{ systemSummary.totalInvoices }}</h3>
          <p>Total Invoices</p>
        </div>
        <div class="summary-card">
          <h3>{{ systemSummary.hospitalCount }}</h3>
          <p>Hospitals</p>
        </div>
      </div>

      <!-- Hospital Overview -->
      <div class="hospital-section">
        <h3>Hospital Overview</h3>
        <div class="hospital-grid" *ngIf="hospitals">
          <div class="hospital-card" *ngFor="let hospital of hospitals">
            <h4>Hospital {{ hospital.hospitalId }}</h4>
            <p>{{ hospital.staffCount }} Staff Members</p>
            <button class="btn-view" (click)="viewHospitalDetails(hospital.hospitalId)">
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- Global Actions -->
      <div class="actions-section">
        <h3>Global Actions</h3>
        <div class="action-buttons">
          <button class="btn-primary" (click)="refreshData()">
            🔄 Refresh Data
          </button>
          <button class="btn-secondary" (click)="viewAllAppointments()">
            📅 View All Appointments
          </button>
          <button class="btn-secondary" (click)="viewAllPatients()">
            👥 View All Patients
          </button>
          <button class="btn-secondary" (click)="viewAllStaff()">
            👨‍⚕️ View All Staff
          </button>
        </div>
      </div>

      <!-- Super Admin Info -->
      <div class="super-admin-info" *ngIf="superAdminStatus?.globalSuperAdminInfo">
        <h3>Current Super Admin</h3>
        <div class="admin-card">
          <p><strong>Name:</strong> {{ superAdminStatus?.globalSuperAdminInfo?.name }}</p>
          <p><strong>Staff ID:</strong> {{ superAdminStatus?.globalSuperAdminInfo?.staffId }}</p>
          <p><strong>Designation:</strong> {{ superAdminStatus?.globalSuperAdminInfo?.designation }}</p>
          <p><strong>Hospital Restriction:</strong> 
            <span class="no-restriction">None (Global Access)</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Not Super Admin Message -->
    <div class="access-denied" *ngIf="superAdminStatus && !superAdminStatus.isCurrentUserSuperAdmin">
      <h2>🚫 Access Denied</h2>
      <p>You don't have Super Admin privileges to access this dashboard.</p>
    </div>

    <!-- Loading State -->
    <div class="loading" *ngIf="!superAdminStatus">
      <p>Loading Super Admin status...</p>
    </div>
  `,
  styles: [`
    .super-admin-dashboard {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
    }

    .header h2 {
      margin: 0 0 8px 0;
      font-size: 2rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .summary-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      border-left: 4px solid #667eea;
    }

    .summary-card h3 {
      font-size: 2.5rem;
      margin: 0 0 8px 0;
      color: #667eea;
    }

    .summary-card p {
      margin: 0;
      color: #666;
      font-weight: 500;
    }

    .hospital-section, .actions-section, .super-admin-info {
      margin-bottom: 32px;
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .hospital-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .hospital-card {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary, .btn-view {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a6fd8;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #dee2e6;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    .btn-view {
      background: #28a745;
      color: white;
      margin-top: 8px;
    }

    .btn-view:hover {
      background: #218838;
    }

    .admin-card {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .no-restriction {
      color: #28a745;
      font-weight: 600;
    }

    .access-denied {
      text-align: center;
      padding: 48px;
      color: #dc3545;
    }

    .loading {
      text-align: center;
      padding: 48px;
    }

    h3 {
      color: #333;
      margin-bottom: 16px;
    }
  `]
})
export class SuperAdminDashboardComponent implements OnInit {
  superAdminStatus: SuperAdminStatus | null = null;
  systemSummary: SystemSummary | null = null;
  hospitals: HospitalSummary[] | null = null;

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadSuperAdminData();
  }

  loadSuperAdminData(): void {
    this.superAdminService.checkSuperAdminStatus().subscribe({
      next: (status) => {
        this.superAdminStatus = status;
        if (status.isCurrentUserSuperAdmin) {
          this.loadSystemData();
        }
      },
      error: (error) => {

      }
    });
  }

  loadSystemData(): void {
    // Load system summary
    this.superAdminService.getSystemSummary().subscribe({
      next: (summary) => {
        this.systemSummary = summary;
      },
      error: (error) => {

      }
    });

    // Load hospitals
    this.superAdminService.getAllHospitals().subscribe({
      next: (hospitals) => {
        this.hospitals = hospitals;
      },
      error: (error) => {

      }
    });
  }

  refreshData(): void {
    this.loadSystemData();
  }

  viewHospitalDetails(hospitalId: number): void {
    // Navigate to hospital-specific view

    // You can implement navigation logic here
  }

  viewAllAppointments(): void {
    // Navigate to global appointments view

    // You can implement navigation logic here
  }

  viewAllPatients(): void {
    // Navigate to global patients view

    // You can implement navigation logic here
  }

  viewAllStaff(): void {
    // Navigate to global staff view

    // You can implement navigation logic here
  }
}
