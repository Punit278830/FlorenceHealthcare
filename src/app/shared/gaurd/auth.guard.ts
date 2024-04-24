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
     this.loginData=JSON.parse(localStorage.getItem('data')||'')
      if (this.loginData.loginStatus) {
        return true;
      } else {
        this.router.navigate([routes.login]);
        return false;
      }
  }
}
