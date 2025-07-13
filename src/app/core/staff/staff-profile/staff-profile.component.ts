import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
    selector: 'app-staff-profile',
    templateUrl: './staff-profile.component.html',
    styleUrls: ['./staff-profile.component.scss'],
    standalone: false
})
export class StaffProfileComponent {
  public routes = routes;
  public staffInfo! : IstaffInfo;


  constructor(private staffservice:StaffService,
    private route : Router
  ){

    this.staffservice.staffId?this.getStaffInfo():this.route.navigate([routes.staffList])
  }

  getStaffInfo(){
    const idhere=this.staffservice.staffId;
    this.staffservice.getStaffByID(idhere).subscribe((data:any)=>{
      this.staffInfo=data;
      console.log("data",this.staffInfo)
      this.staffInfo.IdentityName=data.identityName;
      this.staffInfo.IdentityNumber=data.identityNumber;
      
    })

  }
  
  
}
