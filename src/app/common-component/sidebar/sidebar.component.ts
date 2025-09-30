import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { MenuItem, SideBarData, Ilogin } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';
import { SuperAdminService } from 'src/app/shared/Services/super-admin/super-admin.service';
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
  public isSuperAdmin = false;
  private roleSubscription: Subscription = new Subscription();
  private superAdminSubscription: Subscription = new Subscription();

  constructor(
    private data: DataService,
    private router: Router,
    private sideBar: SideBarService,
    private roleService: RoleAuthorizationService,
    private superAdminService: SuperAdminService
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
    
    // Subscribe to super admin status changes
    this.superAdminSubscription = this.superAdminService.superAdminStatus$.subscribe(status => {
      if (status) {
        console.log('📋 Sidebar - Super Admin Status Response (subscription):', status);
        this.isSuperAdmin = status.isCurrentUserSuperAdmin;
        console.log('📋 Sidebar - Is Super Admin (subscription):', this.isSuperAdmin);
        
        // If the userRole from localStorage doesn't match, trust the service
        if (this.isSuperAdmin && !this.isSuperAdminByRole()) {
          console.log('📋 Sidebar - Correcting user role based on super admin service');
          this.userRole = 'superadmin'; // Set to superadmin for sidebar menu matching
        }
        
        // Refresh sidebar with updated super admin status
        this.sidebarData = this.getFilteredSidebarData();
      }
    });
    
    // Also manually check super admin status
    this.checkSuperAdminStatus();
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
    if (this.superAdminSubscription) {
      this.superAdminSubscription.unsubscribe();
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
    console.log('🔍 Role from new service:', currentRole.roleName, '-> mapped to:', this.userRole);
    // Map GlobalSuperAdmin to superadmin for sidebar menu matching
    if (this.userRole === 'globalsuperadmin' || this.userRole === 'global super administrator') {
      this.userRole = 'superadmin';
      console.log('✅ Mapped to superadmin for sidebar');
    }
  } else {
    // Fallback to old system
    this.userData = LocalStorageUtil.getUserData();
    this.userRole = this.userData.userRole || '';
    console.log('🔍 Role from localStorage:', this.userData.userRole, '-> mapped to:', this.userRole);
    // Also handle the mapping in the fallback
    if (this.userRole === 'globalsuperadmin' || this.userRole === 'global super administrator') {
      this.userRole = 'superadmin';
      console.log('✅ Mapped to superadmin for sidebar (fallback)');
    }
  }
  
  console.log('🎯 Final userRole for sidebar:', this.userRole);
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
    // Use both the role service and super admin service for accurate detection
    const isSuperAdminFromService = this.roleService.isSuperAdmin();
    const isSuperAdminFromSuperAdminService = this.isSuperAdmin;
    const isSuperAdminFromRole = this.isSuperAdminByRole();
    
    const actualIsSuperAdmin = isSuperAdminFromService || isSuperAdminFromSuperAdminService || isSuperAdminFromRole;
    
    const originalData = this.data.sideBar;
    
    if (actualIsSuperAdmin) {
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

  private isSuperAdminByRole(): boolean {
    const role = this.userRole?.toLowerCase();
    return role === 'superadmin' || role === 'globalsuperadmin' || role === 'global super administrator';
  }

  private checkSuperAdminStatus(): void {
    console.log('📋 Sidebar - Checking super admin status...');
    
    this.superAdminService.checkSuperAdminStatus().subscribe({
      next: (status) => {
        console.log('📋 Sidebar - Super Admin Status Response (manual check):', status);
        if (status) {
          this.isSuperAdmin = status.isCurrentUserSuperAdmin;
          console.log('📋 Sidebar - Is Super Admin (manual):', this.isSuperAdmin);
          
          // If the userRole from localStorage doesn't match, trust the service
          if (this.isSuperAdmin && !this.isSuperAdminByRole()) {
            console.log('📋 Sidebar - Correcting user role based on super admin service');
            this.userRole = 'superadmin'; // Set to superadmin for sidebar menu matching
          }
          
          // Refresh sidebar with updated status
          this.sidebarData = this.getFilteredSidebarData();
        } else {
          console.log('📋 Sidebar - No super admin status received (manual check)');
        }
      },
      error: (error) => {
        console.error('📋 Sidebar - Error checking super admin status (manual):', error);
      }
    });
  }

  public refreshSidebar(): void {
    this.getUserRole();
    this.sidebarData = this.getFilteredSidebarData();
  }

}
