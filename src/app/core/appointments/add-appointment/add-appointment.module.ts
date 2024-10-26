import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAppointmentRoutingModule } from './add-appointment-routing.module';
import { AddAppointmentComponent } from './add-appointment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { InvoiceViewComponent } from 'src/app/core/accounts/invoice-view/invoice-view.component';




@NgModule({
  declarations: [
    AddAppointmentComponent
    
  ],
  imports: [
    CommonModule,
    AddAppointmentRoutingModule,
    SharedModule,
    TimepickerModule.forRoot()
  ]
})
export class AddAppointmentModule { }
