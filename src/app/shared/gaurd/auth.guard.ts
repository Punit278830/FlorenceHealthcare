import { Injectable } from '@angular/core';
import {
  
  CanActivate,
  Router,
  
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from '../routes/routes';
import { AuthService } from '../auth/auth.service';
import { Ilogin } from '../models/models';
import { LocalStorageUtil } from '../utils/local-storage.util';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private loginData!:Ilogin
  constructor(private router: Router) {
     
  }
  canActivate(
    
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
     
    // Use the utility to safely get user data
    this.loginData = LocalStorageUtil.getUserData();
    
    if (this.loginData && this.loginData.loginStatus) {
      return true;
    }
    
    // If no valid login data, redirect to login
    this.router.navigate([routes.login]);
    return false;
  }
}
