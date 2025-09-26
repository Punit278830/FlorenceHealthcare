import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { MenuItem, SideBarData, Ilogin } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';
import { LocalStorageUtil } from 'src/app/shared/utils/local-storage.util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  base = '';
  page = '';
  currentUrl = '';
  public classAdd = false;

  public multilevel: Array<boolean> = [false, false, false];

  public routes = routes;
  public sidebarData: Array<SideBarData> = [];
  public userRole='';
  public userData:Ilogin={}as Ilogin;
  private roleSubscription: Subscription = new Subscription();

  constructor(
    private data: DataService,
    private router: Router,
    private sideBar: SideBarService,
    private roleService: RoleAuthorizationService
  ) {
    this.initializeSidebar();
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);
  }

  ngOnInit(): void {
    // Subscribe to role changes for real-time updates
    this.roleSubscription = this.roleService.currentUserRole$.subscribe(role => {
      this.getUserRole();
      this.sidebarData = this.getFilteredSidebarData();
    });
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  private initializeSidebar(): void {
    this.getUserRole();
    this.sidebarData = this.getFilteredSidebarData();
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
    // Map GlobalSuperAdmin to superadmin for sidebar menu matching
    if (this.userRole === 'globalsuperadmin' || this.userRole === 'global super administrator') {
      this.userRole = 'superadmin';
    }
  } else {
    // Fallback to old system
    this.userData = LocalStorageUtil.getUserData();
    this.userRole = this.userData.userRole || '';
    // Also handle the mapping in the fallback
    if (this.userRole === 'globalsuperadmin' || this.userRole === 'global super administrator') {
      this.userRole = 'superadmin';
    }
  }
 }
  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    
    // Get user role from new role service or fallback to old system
    let userRole = '';
    const currentRole = this.roleService.getCurrentRole();
    if (currentRole) {
      userRole = currentRole.roleName.toLowerCase();
      // Map GlobalSuperAdmin to superadmin for sidebar menu matching
      if (userRole === 'globalsuperadmin' || userRole === 'global super administrator') {
        userRole = 'superadmin';
      }
    } else {
      userRole = LocalStorageUtil.getUserData().userRole || '';
      // Also handle the mapping in the fallback
      if (userRole === 'globalsuperadmin' || userRole === 'global super administrator') {
        userRole = 'superadmin';
      }
    }
    

    
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

  public refreshSidebar(): void {
    this.getUserRole();
    this.sidebarData = this.getFilteredSidebarData();
  }

}
