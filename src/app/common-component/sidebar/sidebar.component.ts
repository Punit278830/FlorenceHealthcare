import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { MenuItem, SideBarData, Ilogin, HospitalModel } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';
import { HospitalService } from 'src/app/shared/Services/hospital/hospital.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  base = '';
  page = '';
  currentUrl = '';
  public classAdd = false;

  public multilevel: Array<boolean> = [false, false, false];

  public routes = routes;
  public sidebarData: Array<SideBarData> = [];
  public userRole='';
  public userData:Ilogin={}as Ilogin;
  
  // Hospital switcher state
  public hospitals: HospitalModel[] = [];
  public selectedHospitalId: number | null = null;

  constructor(
    private data: DataService,
    private router: Router,
    private sideBar: SideBarService,
    private hospitalService: HospitalService

    
  ) {
    this.getUserRole();
    this.sidebarData = this.data.sideBar;
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);

    // Initialize hospital state
    this.selectedHospitalId = this.hospitalService.getCurrentHospitalId();
    this.hospitalService.currentHospitalId$.subscribe(id => {
      this.selectedHospitalId = id;
    });
    this.loadHospitals();
  }
  // public ngOnInit()
  // {
  //   this.getUserRole();
  // }

 public getUserRole()
 {
  this.userData=JSON.parse(localStorage.getItem('data')||'')
  this.userRole=this.userData.userRole;
    
 }
  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    const userRole=JSON.parse(localStorage.getItem('data')||'').userRole;
    console.log(userRole)
    this.sidebarData.map((mainMenus: SideBarData) => {
     if(mainMenus.tittle==userRole)
     {
      mainMenus.menu.map((resMenu: MenuItem) => {
        if (resMenu.menuValue == menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
      }

    });
  }
  private getRoutes(route: { url: string }): void {
    const bodyTag = document.body;

    bodyTag.classList.remove('slide-nav')
    bodyTag.classList.remove('opened')
    this.currentUrl = route.url;

    const splitVal = route.url.split('/');


    this.base = splitVal[1];
    this.page = splitVal[2];
  }
  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sideBar.expandSideBar.next("true");
    } else {
      this.sideBar.expandSideBar.next("false");
    }
  }

  private loadHospitals(): void {
    this.hospitalService.getHospitals().subscribe({
      next: (list) => {
        this.hospitals = list || [];
      },
      error: () => {
        this.hospitals = [];
      }
    });
  }

  public onHospitalChange(val: number | null): void {
    // val can be number or null because we use [ngValue]
    this.hospitalService.setCurrentHospitalId(val);
  }

}
