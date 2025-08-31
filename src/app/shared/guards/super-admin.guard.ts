import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleAuthorizationService } from '../Services/auth/role-authorization.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  constructor(
    private roleService: RoleAuthorizationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.roleService.currentPermissions$.pipe(
      map(permissions => {
        if (permissions?.isSuperAdmin) {
          return true;
        } else {
          this.toastr.error('Access denied. Only Super Admin users can access this page.');
          this.router.navigate(['/admin-dashboard']);
          return false;
        }
      })
    );
  }
}
