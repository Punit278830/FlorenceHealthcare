import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffScheduleComponent } from './staff-schedule.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StaffScheduleRoutingModule } from './staff-schedule-routing.module';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';



@NgModule({
  declarations: [
    StaffScheduleComponent,
    
  ],
  imports: [
    CommonModule,
    //SharedModule,
    StaffScheduleRoutingModule,
     ScheduleModule
    
  ]
})
export class StaffScheduleModule { }
