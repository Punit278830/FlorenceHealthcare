import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { HospitalService } from 'src/app/shared/Services/hospital/hospital.service';
import { SuperAdminService } from 'src/app/shared/Services/super-admin/super-admin.service';
import { HospitalModel } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';
import { LocalStorageUtil } from 'src/app/shared/utils/local-storage.util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {
  public routes = routes;
  public openBox = false;
  public miniSidebar  = false;
  public addClass = false;
  public userRole='';
  public userName='';
  public hospitals: HospitalModel[] = [];
  public currentHospitalId: number | null = null;
  public currentHospitalName: string = '';
  public isSuperAdmin = false;
  

  constructor(
    public router: Router,
    private sideBar: SideBarService,
    private _auth: AuthService,
    private hospitalService: HospitalService,
    private superAdminService: SuperAdminService
  ) {
    
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
   // alert("from header component")
  }

  public ngOnInit()
  {
    // Use the safe utility to get user data
    const data = LocalStorageUtil.getUserData();
    
    if (data && data.fname && data.lname) {
      this.userName = data.fname + " " + data.lname;
      this.userRole = data.userRole || '';
      
      // Set initial super admin status based on role from localStorage
      this.isSuperAdmin = this.isSuperAdminByRole();
    }
    
    // Also check for super admin using the super admin service
    this.checkSuperAdminStatus();

    // Load hospitals and current hospital
    this.currentHospitalId = this.hospitalService.getCurrentHospitalId();
    console.log('Initial hospital ID from localStorage:', this.currentHospitalId);
    
    // Load hospitals first, then update name
    this.loadHospitals();
    
    // Subscribe to hospital changes
    this.hospitalService.currentHospitalId$.subscribe(id => {
      console.log('Hospital ID changed to:', id);
      this.currentHospitalId = id;
      this.updateCurrentHospitalName();
    });

    // Subscribe to hospital list changes
    this.hospitalService.hospitalListChanged$.subscribe(changed => {
      if (changed) {
        // Only reload if user is super admin (check at runtime)
        if (this.isSuperAdmin || this.isSuperAdminByRole()) {
          this.loadHospitals();
        }
      }
    });
  }
  openBoxFunc() {
    this.openBox = !this.openBox;
    /* eslint no-var: off */
    var mainWrapper = document.getElementsByClassName('main-wrapper')[0];
    if (this.openBox) {
      mainWrapper.classList.add('open-msg-box');
    } else {
      mainWrapper.classList.remove('open-msg-box');
    }
  }

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
    
    this.addClass = !this.addClass;
    /* eslint no-var: off */
    var root = document.getElementsByTagName( 'html' )[0];
    /* eslint no-var: off */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var sidebar:any = document.getElementById('sidebar')

    if (this.addClass) {
      root.classList.add('menu-opened');
      sidebar.classList.add('opened');
    }
    else {
      root.classList.remove('menu-opened');
      sidebar.classList.remove('opened');
    }
  }

  private loadHospitals(): void {
    // For super admins, use the super admin service to get hospitals
    if (this.isSuperAdmin || this.isSuperAdminByRole()) {
      this.superAdminService.getAllHospitals().subscribe({
        next: (hospitalsResponse: any) => {
          
          // Check if the response has a 'hospitals' property
          const hospitalsList = hospitalsResponse.hospitals || hospitalsResponse;
          
          // Convert to HospitalModel format
          this.hospitals = hospitalsList.map((h: any) => ({
            hospitalId: h.hospitalId || h.HospitalId,
            name: h.hospitalName || h.HospitalName || h.name,
            code: h.code,
            contactPerson: h.contactPerson,
            contactNumber: h.contactNumber,
            email: h.email,
            addressLine1: h.addressLine1,
            addressLine2: h.addressLine2,
            city: h.city,
            state: h.state,
            pincode: h.pincode,
            country: h.country,
            registrationNumber: h.registrationNumber,
            gstin: h.gstin,
            websiteUrl: h.websiteUrl,
            logoUrl: h.logoUrl,
            isActive: h.isActive,
            createdOn: h.createdOn
          }));
          
          // If super admin and no hospital selected, don't auto-select
          // Force them to explicitly choose a hospital
          this.updateCurrentHospitalName();
        },
        error: (error: any) => {
          console.error('Error loading hospitals for super admin:', error);
          // Fallback to regular hospital service
          this.loadHospitalsRegular();
        }
      });
    } else {
      this.loadHospitalsRegular();
    }
  }

  private loadHospitalsRegular(): void {
    this.hospitalService.getHospitals().subscribe({
      next: (hospitals: HospitalModel[]) => {
        this.hospitals = hospitals;
        
        // Regular users should see only their assigned hospital
        // No need to filter here as the backend should handle this
        this.updateCurrentHospitalName();
      },
      error: (error: any) => {
        console.error('Error loading hospitals:', error);
      }
    });
  }

  private updateCurrentHospitalName(): void {
    if (this.currentHospitalId && this.hospitals.length > 0) {
      const hospital = this.hospitals.find((h: HospitalModel) => h.hospitalId === this.currentHospitalId);
      this.currentHospitalName = hospital?.name || 'Unknown Hospital';
      console.log('Updated hospital name:', this.currentHospitalName, 'for ID:', this.currentHospitalId);
    } else if (this.currentHospitalId && this.hospitals.length === 0) {
      // Hospitals not loaded yet, fetch the specific hospital
      this.loadSpecificHospital(this.currentHospitalId);
    } else {
      this.currentHospitalName = 'MediSyncr';
      console.log('No hospital selected, using default name');
    }
  }

  private loadSpecificHospital(hospitalId: number): void {
    // Load all hospitals to find the specific one we need
    this.hospitalService.getHospitals().subscribe({
      next: (hospitals: HospitalModel[]) => {
        const hospital = hospitals.find(h => h.hospitalId === hospitalId);
        if (hospital) {
          this.currentHospitalName = hospital.name;
          console.log('Loaded specific hospital:', this.currentHospitalName);
          // Also cache the hospitals for future use
          this.hospitals = hospitals;
        } else {
          this.currentHospitalName = 'MediSyncr';
          console.log('Hospital not found with ID:', hospitalId);
        }
      },
      error: (error: any) => {
        console.error('Error loading hospitals:', error);
        this.currentHospitalName = 'MediSyncr';
      }
    });
  }

  public selectHospital(hospital: HospitalModel): void {
    // Only allow super admins to switch hospitals
    if (!this.canSwitchHospitals()) {
      return;
    }
    
    if (hospital.hospitalId) {
      // Update the hospital service - this will notify all subscribers
      this.hospitalService.setCurrentHospitalId(hospital.hospitalId);
      this.currentHospitalId = hospital.hospitalId;
      this.updateCurrentHospitalName();
      
      // All components that subscribe to hospitalService.currentHospitalId$ 
      // will automatically reload their data - no page refresh needed
    }
  }

  private checkSuperAdminStatus(): void {
    // First manually call checkSuperAdminStatus to refresh the data
    this.superAdminService.checkSuperAdminStatus().subscribe({
      next: (status) => {
        if (status) {
          this.isSuperAdmin = status.isCurrentUserSuperAdmin;
          
          // If the userRole from localStorage doesn't match, trust the service
          if (this.isSuperAdmin && !this.isSuperAdminByRole()) {
            this.userRole = 'globalsuperadmin'; // Set to ensure hospital selector shows
          }
        }
      },
      error: (error) => {
        console.error('Error checking super admin status:', error);
      }
    });
    
    // Also subscribe to the observable for future changes
    this.superAdminService.superAdminStatus$.subscribe({
      next: (status) => {
        if (status) {
          this.isSuperAdmin = status.isCurrentUserSuperAdmin;
          
          // If the userRole from localStorage doesn't match, trust the service
          if (this.isSuperAdmin && !this.isSuperAdminByRole()) {
            this.userRole = 'globalsuperadmin'; // Set to ensure hospital selector shows
          }
        }
      },
      error: (error) => {
        console.error('Error checking super admin status:', error);
      }
    });
  }

  private isSuperAdminByRole(): boolean {
    return this.userRole === 'globalsuperadmin' || 
           this.userRole === 'superadmin' ||
           this.userRole === 'GlobalSuperAdmin' ||
           this.userRole === 'SuperAdmin';
  }

  private isAdminUser(): boolean {
    return this.userRole === 'admin' || 
           this.userRole === 'Admin';
  }

  public canSwitchHospitals(): boolean {
    // Only super admins can switch hospitals, regular admins cannot
    return this.isSuperAdminByRole() && !this.isAdminUser();
  }

  public shouldShowHospitalName(): boolean {
    // Show hospital name for both super admins and regular users if a hospital is selected
    return !!(this.currentHospitalName && 
             this.currentHospitalName !== 'MediSyncr' && 
             this.currentHospitalName !== '');
  }
}
