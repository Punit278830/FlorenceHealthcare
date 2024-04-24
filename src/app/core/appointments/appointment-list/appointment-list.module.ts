import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AppointmentListRoutingModule } from './appointment-list-routing.module';
import { AppointmentListComponent } from './appointment-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [
    AppointmentListComponent
  ],
  imports: [
    CommonModule,
    AppointmentListRoutingModule,
    SharedModule,
    DatePipe
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class AppointmentListModule { }
