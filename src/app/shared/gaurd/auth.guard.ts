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
     
    // Simplified authentication check (production version with minimal logging)
    try {
      const userData = localStorage.getItem('data');
      const staffId = localStorage.getItem('currentStaffId');
      
      if (userData && staffId) {
        const parsedData = JSON.parse(userData);
        
        if (parsedData.loginStatus === true) {
          return true;
        }
      }
    } catch (error) {
      console.error('Auth guard error:', error);
    }
    
    // If no valid login data, redirect to login
    this.router.navigate([routes.login]);
    return false;
  }
}
