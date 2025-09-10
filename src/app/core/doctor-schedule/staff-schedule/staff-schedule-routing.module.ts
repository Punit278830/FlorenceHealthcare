import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffScheduleComponent } from './staff-schedule.component';

const routes: Routes = [{ path: '', component: StaffScheduleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffScheduleRoutingModule {
  constructor()
  {

  }
 }
