import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbhaComponent } from '../abha.component';
import { AbhaDashboardComponent } from './abha-dashboard.component';
import { AbhaDashboardRoutingModule } from './abha-dashboard-routing.module';



@NgModule({
  declarations: [AbhaDashboardComponent],
  imports: [
    CommonModule,
    AbhaDashboardRoutingModule
  ]
})
export class AbhaDashboardModule { }
