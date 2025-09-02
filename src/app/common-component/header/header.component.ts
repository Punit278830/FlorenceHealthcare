import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { HospitalService } from 'src/app/shared/Services/hospital/hospital.service';
import { HospitalModel } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';

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
  

  constructor(
    public router: Router,
    private sideBar: SideBarService,
    private _auth: AuthService,
    private hospitalService: HospitalService,
    private roleService: RoleAuthorizationService
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
    //this.userRole=localStorage.getItem('userRole')||'';

    
    console.log('Header ngOnInit - userRole:', this.userRole);
    const data=JSON.parse(localStorage.getItem('data')||'{}')
    this.userName=data.fname +" "+data.lname;
    this.userRole=data.userRole;
    
    console.log('Header ngOnInit - Full user data:', data);
    console.log('Header ngOnInit - userRole from data:', data.userRole);
    console.log('Header ngOnInit - typeof userRole:', typeof data.userRole);
    
    // Initialize role service with current user data if staffId is available
    if (data.staffId) {
      this.roleService.refreshUserRole(data.staffId).subscribe({
        next: (role) => {
          console.log('Role refreshed:', role);
          console.log('Role name from API:', role.roleName);
          
          // Check again after role refresh
          console.log('Header ngOnInit - After role refresh - canAccessAllHospitals():', this.canAccessAllHospitals());
          
          // Load hospitals if user can access all hospitals (SuperAdmin only)
          if (this.canAccessAllHospitals()) {
            console.log('Loading hospitals for SuperAdmin after role refresh...');
            this.loadHospitals();
          } else {
            console.log('User does not have access to all hospitals');
          }
        },
        error: (error) => {
          console.error('Failed to refresh user role:', error);
          // Fallback: still try to load hospitals based on stored role
          if (this.canAccessAllHospitals()) {
            console.log('Loading hospitals for SuperAdmin (fallback)...');
            this.loadHospitals();
          }
        }
      });
    } else {
      console.log('No staffId found, using stored role');
      // Load hospitals if user can access all hospitals based on stored data
      if (this.canAccessAllHospitals()) {
        console.log('Loading hospitals for SuperAdmin (no staffId)...');
        this.loadHospitals();
      }
    }
    
    console.log('Header ngOnInit - After setting userRole:', this.userRole);
    console.log('Header ngOnInit - isSuperAdmin():', this.isSuperAdmin());
    console.log('Header ngOnInit - canAccessAllHospitals():', this.canAccessAllHospitals());
    
    this.currentHospitalId = this.hospitalService.getCurrentHospitalId();
    this.updateCurrentHospitalName();
    
    // Subscribe to hospital changes
    this.hospitalService.currentHospitalId$.subscribe(id => {
      this.currentHospitalId = id;
      this.updateCurrentHospitalName();
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
    console.log('loadHospitals called');
    this.hospitalService.getHospitals().subscribe({
      next: (hospitals: HospitalModel[]) => {
        console.log('Hospitals loaded:', hospitals);
        this.hospitals = hospitals;
        this.updateCurrentHospitalName();
      },
      error: (error: any) => {
        console.error('Failed to load hospitals:', error);
        // Fallback: Add mock hospitals for testing
        this.hospitals = [
          { hospitalId: 1, name: 'Main Hospital', address: '123 Main St', phone: '123-456-7890' } as HospitalModel,
          { hospitalId: 2, name: 'Secondary Hospital', address: '456 Oak St', phone: '123-456-7891' } as HospitalModel,
          { hospitalId: 3, name: 'Emergency Hospital', address: '789 Pine St', phone: '123-456-7892' } as HospitalModel
        ];
        console.log('Using fallback hospitals:', this.hospitals);
        this.updateCurrentHospitalName();
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

  public isSuperAdmin(): boolean {
    const result = this.roleService.isSuperAdmin();
    console.log('isSuperAdmin check using roleService - userRole:', this.userRole, 'result:', result);
    return result;
  }

  public canAccessAllHospitals(): boolean {
    const result = this.roleService.canAccessAllHospitals();
    console.log('canAccessAllHospitals check - userRole:', this.userRole, 'result:', result);
    return result;
  }

  public selectHospital(hospital: HospitalModel): void {
    if (hospital.hospitalId) {
      this.hospitalService.setCurrentHospitalId(hospital.hospitalId);
      // Optionally refresh the page to reload data with new hospital
      window.location.reload();
    }
  }
}
