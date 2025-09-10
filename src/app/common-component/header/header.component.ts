import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { HospitalService } from 'src/app/shared/Services/hospital/hospital.service';
import { HospitalModel } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';

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
    private hospitalService: HospitalService
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

    

     const data=JSON.parse(localStorage.getItem('data')||'')
this.userName=data.fname +" "+data.lname;
this.userRole=data.userRole;

    // Load hospitals and current hospital
    this.loadHospitals();
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
    this.hospitalService.getHospitals().subscribe({
      next: (hospitals: HospitalModel[]) => {
        this.hospitals = hospitals;
        this.updateCurrentHospitalName();
      },
      error: (error: any) => {

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
    if (hospital.hospitalId) {
      this.hospitalService.setCurrentHospitalId(hospital.hospitalId);
      // No need to reload - components should subscribe to hospital changes
    }
  }
}
