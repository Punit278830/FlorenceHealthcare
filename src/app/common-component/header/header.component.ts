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
      
      // Debug logging to check role values
      console.log('Header Component - User Role:', this.userRole);
      console.log('Header Component - Full Data:', data);
      
      // Set initial super admin status based on role from localStorage
      this.isSuperAdmin = this.isSuperAdminByRole();
      console.log('Initial isSuperAdmin from role:', this.isSuperAdmin);
    }
    
    // Also check for super admin using the super admin service
    this.checkSuperAdminStatus();

    // Load hospitals and current hospital
    this.loadHospitals();
    this.currentHospitalId = this.hospitalService.getCurrentHospitalId();
    this.updateCurrentHospitalName();
    
    // Subscribe to hospital changes
    this.hospitalService.currentHospitalId$.subscribe(id => {
      this.currentHospitalId = id;
      this.updateCurrentHospitalName();
    });

    // Subscribe to hospital list changes (only for super admins)
    if (this.isSuperAdmin || this.isSuperAdminByRole()) {
      this.hospitalService.hospitalListChanged$.subscribe(changed => {
        if (changed) {
          console.log('Header: Hospital list changed - reloading hospitals (super admin only)');
          this.loadHospitals();
        }
      });
    }
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
    console.log('Loading hospitals...');
    console.log('Is Super Admin (by service):', this.isSuperAdmin);
    console.log('Is Super Admin (by role):', this.isSuperAdminByRole());
    console.log('User Role:', this.userRole);
    
    // For super admins, use the super admin service to get hospitals
    if (this.isSuperAdmin || this.isSuperAdminByRole()) {
      console.log('Loading hospitals for SUPER ADMIN...');
      this.superAdminService.getAllHospitals().subscribe({
        next: (hospitalsResponse: any) => {
          console.log('Super Admin Hospitals Response:', hospitalsResponse);
          
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
          
          console.log('Converted Hospitals:', this.hospitals);
          
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
      console.log('Loading hospitals for REGULAR USER...');
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
    } else {
      this.currentHospitalName = 'No Hospital Selected';
    }
  }

  public selectHospital(hospital: HospitalModel): void {
    // Only allow super admins to switch hospitals
    if (!this.canSwitchHospitals()) {
      console.log('User cannot switch hospitals - not a super admin');
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
    console.log('Checking super admin status...');
    
    // First manually call checkSuperAdminStatus to refresh the data
    this.superAdminService.checkSuperAdminStatus().subscribe({
      next: (status) => {
        console.log('Super Admin Status Response (manual check):', status);
        if (status) {
          this.isSuperAdmin = status.isCurrentUserSuperAdmin;
          console.log('Super Admin Service - Is Super Admin (manual):', this.isSuperAdmin);
          
          // If the userRole from localStorage doesn't match, trust the service
          if (this.isSuperAdmin && !this.isSuperAdminByRole()) {
            console.log('Correcting user role based on super admin service');
            this.userRole = 'globalsuperadmin'; // Set to ensure hospital selector shows
          }
        } else {
          console.log('No super admin status received (manual check)');
        }
      },
      error: (error) => {
        console.error('Error checking super admin status (manual):', error);
      }
    });
    
    // Also subscribe to the observable for future changes
    this.superAdminService.superAdminStatus$.subscribe({
      next: (status) => {
        console.log('Super Admin Status Response (subscription):', status);
        if (status) {
          this.isSuperAdmin = status.isCurrentUserSuperAdmin;
          console.log('Super Admin Service - Is Super Admin (subscription):', this.isSuperAdmin);
          console.log('Super Admin Service - Full Status:', status);
          
          // If the userRole from localStorage doesn't match, trust the service
          if (this.isSuperAdmin && !this.isSuperAdminByRole()) {
            console.log('Correcting user role based on super admin service');
            this.userRole = 'globalsuperadmin'; // Set to ensure hospital selector shows
          }
        } else {
          console.log('No super admin status received (subscription)');
        }
      },
      error: (error) => {
        console.error('Error checking super admin status (subscription):', error);
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
}
