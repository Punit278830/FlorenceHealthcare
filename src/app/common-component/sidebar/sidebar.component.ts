import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { MenuItem, SideBarData, Ilogin } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';

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

  constructor(
    private data: DataService,
    private router: Router,
    private sideBar: SideBarService,
    private roleService: RoleAuthorizationService
  ) {
    this.getUserRole();
    this.sidebarData = this.getFilteredSidebarData();
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);
  }
  // public ngOnInit()
  // {
  //   this.getUserRole();
  // }

 public getUserRole()
 {
  // First try to get role from new role service
  const currentRole = this.roleService.getCurrentRole();
  if (currentRole) {
    this.userRole = currentRole.roleName.toLowerCase();
  } else {
    // Fallback to old system
    this.userData = JSON.parse(localStorage.getItem('data') || '{}');
    this.userRole = this.userData.userRole || '';
  }
 }
  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    
    // Get user role from new role service or fallback to old system
    let userRole = '';
    const currentRole = this.roleService.getCurrentRole();
    if (currentRole) {
      userRole = currentRole.roleName.toLowerCase();
    } else {
      userRole = JSON.parse(localStorage.getItem('data') || '{}').userRole || '';
    }
    
    console.log('Current user role:', userRole);
    
    this.sidebarData.map((mainMenus: SideBarData) => {
     if(mainMenus.tittle === userRole)
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
  private getFilteredSidebarData(): Array<SideBarData> {
    const isSuperAdmin = this.roleService.isSuperAdmin();
    const originalData = this.data.sideBar;
    
    if (isSuperAdmin) {
      return originalData; // Super admins see all menu items
    }
    
    // Filter out Hospital Registration for non-super admins
    return originalData.map(sidebarSection => ({
      ...sidebarSection,
      menu: sidebarSection.menu.filter(menuItem => {
        if (menuItem.menuValue === 'Hospital Registration') {
          return false; // Hide hospital registration for non-super admins
        }
        return true;
      })
    }));
  }

}
