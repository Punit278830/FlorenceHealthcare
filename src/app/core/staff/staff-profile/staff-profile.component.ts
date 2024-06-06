import { Component } from '@angular/core';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.scss']
})
export class StaffProfileComponent {
  public routes = routes;
  // public staffInfo! : IstaffInfo;


  // constructor(private staffservice:StaffService){
  //   this.getStaffInfo()
  // }

  // getStaffInfo(){

  // }
  
  
}
