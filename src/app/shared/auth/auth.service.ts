import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
import { routes } from '../routes/routes';
import { ApiHttpService } from '../apiService/apiHttpService';
import { IstaffInfo, Ilogin } from '../models/models';
// import { subtract } from 'ngx-bootstrap/chronos';
import { BehaviorSubject } from 'rxjs';
import { api_Url } from 'src/environment/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
private resultData!:IstaffInfo;
private userRole!:string;
public authentication:Ilogin={} as Ilogin;
private readonly apiUrl=api_Url;
// public  RoleType=new BehaviorSubject('admin');
// public  UserName=new BehaviorSubject('');
constructor(private router: Router,private http:ApiHttpService) {
    
  }

  decodeArrayBuffer(arrayBuffer: ArrayBuffer): string {
    // Assuming the ArrayBuffer contains text data (adjust accordingly based on your use case)
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(arrayBuffer);
  }


  public login(email:string,password:string): void {
    this.http.get(`${this.apiUrl}StaffInfoes/${email}/${password}`).subscribe((data:IstaffInfo) =>{
     localStorage.clear();
     this.authentication.fname=data.firstName;
     this.authentication.lname=data.lastName;
     this.authentication.userRole=(data.designation.toLowerCase());
     data.activeStatus==1?this.authentication.loginStatus=true:this.authentication.loginStatus=false;
     this.authentication.loginId=data.staffId;
     this.authentication.departmentId=data.departmentId;
     const logingData=JSON.stringify(this.authentication)
     this.userRole=data.designation;
     
     //localStorage.setItem('userRole',data.designation);
     localStorage.setItem('data',logingData)

       if(this.authentication.userRole=='admin' && this.authentication.loginStatus){
      this.router.navigate([routes.adminDashboard]);
    }
    if(this.authentication.userRole=='doctor' && this.authentication.loginStatus){
      this.router.navigate([routes.doctorDashboard]);
    }
    if(this.authentication.userRole=='reception' && this.authentication.loginStatus){
      this.router.navigate([routes.appointmentList]);
    }
    if(this.authentication.userRole=="nursing" && this.authentication.loginStatus){
      this.router.navigate([routes.addPatient]);
    }
    //localStorage.setItem('authenticated', 'true');
    } )
    
     
      }

    }
