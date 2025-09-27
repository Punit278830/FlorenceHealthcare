import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { RoleAuthorizationService } from '../Services/auth/role-authorization.service';
import { SuperAdminService } from '../Services/super-admin/super-admin.service';
import { LocalStorageUtil } from '../utils/local-storage.util';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  constructor(
    private roleService: RoleAuthorizationService,
    private superAdminService: SuperAdminService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log('🛡️ SuperAdminGuard - Checking access...');
    
    // First check role service permissions
    return this.roleService.currentPermissions$.pipe(
      switchMap(permissions => {
        console.log('🛡️ SuperAdminGuard - Permissions from role service:', permissions);
        
        if (permissions?.isSuperAdmin) {
          console.log('🛡️ SuperAdminGuard - ✅ Access granted via role service');
          return of(true);
        }
        
        // If role service doesn't show super admin, check super admin service
        console.log('🛡️ SuperAdminGuard - Role service did not confirm super admin, checking super admin service...');
        return this.superAdminService.checkSuperAdminStatus().pipe(
          map(superAdminStatus => {
            console.log('🛡️ SuperAdminGuard - Super admin service response:', superAdminStatus);
            
            if (superAdminStatus?.isCurrentUserSuperAdmin) {
              console.log('🛡️ SuperAdminGuard - ✅ Access granted via super admin service');
              return true;
            }
            
            // Final fallback: check localStorage role directly
            const userData = LocalStorageUtil.getUserData();
            const userRole = userData?.userRole?.toLowerCase();
            const isSuperAdminFromStorage = userRole === 'superadmin' || userRole === 'globalsuperadmin';
            
            console.log('🛡️ SuperAdminGuard - Fallback check from localStorage:', userRole, '-> isSuperAdmin:', isSuperAdminFromStorage);
            
            if (isSuperAdminFromStorage) {
              console.log('🛡️ SuperAdminGuard - ✅ Access granted via localStorage fallback');
              return true;
            }
            
            console.log('🛡️ SuperAdminGuard - ❌ Access denied - not a super admin');
            this.toastr.error('Access denied. Only Super Admin users can access this page.');
            this.router.navigate(['/admin-dashboard']);
            return false;
          }),
          catchError(error => {
            console.error('🛡️ SuperAdminGuard - Error checking super admin service:', error);
            
            // Final fallback: check localStorage role directly
            const userData = LocalStorageUtil.getUserData();
            const userRole = userData?.userRole?.toLowerCase();
            const isSuperAdminFromStorage = userRole === 'superadmin' || userRole === 'globalsuperadmin';
            
            console.log('🛡️ SuperAdminGuard - Error fallback check:', userRole, '-> isSuperAdmin:', isSuperAdminFromStorage);
            
            if (isSuperAdminFromStorage) {
              console.log('🛡️ SuperAdminGuard - ✅ Access granted via error fallback');
              return of(true);
            }
            
            console.log('🛡️ SuperAdminGuard - ❌ Access denied after error');
            this.toastr.error('Access denied. Unable to verify super admin status.');
            this.router.navigate(['/admin-dashboard']);
            return of(false);
          })
        );
      }),
      catchError(error => {
        console.error('🛡️ SuperAdminGuard - Error with role service permissions:', error);
        
        // If role service fails, use super admin service as backup
        return this.superAdminService.checkSuperAdminStatus().pipe(
          map(superAdminStatus => {
            if (superAdminStatus?.isCurrentUserSuperAdmin) {
              console.log('🛡️ SuperAdminGuard - ✅ Access granted via super admin service (role service error)');
              return true;
            }
            
            console.log('🛡️ SuperAdminGuard - ❌ Access denied after role service error');
            this.toastr.error('Access denied. Unable to verify super admin status.');
            this.router.navigate(['/admin-dashboard']);
            return false;
          }),
          catchError(() => {
            console.error('🛡️ SuperAdminGuard - Both services failed, denying access');
            this.toastr.error('Access denied. System error.');
            this.router.navigate(['/admin-dashboard']);
            return of(false);
          })
        );
      })
    );
  }
}
