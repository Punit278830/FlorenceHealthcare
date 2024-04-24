import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditAppointmentRoutingModule } from './edit-appointment-routing.module';
import { EditAppointmentComponent } from './edit-appointment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    EditAppointmentComponent
  ],
  imports: [
    CommonModule,
    EditAppointmentRoutingModule,
    
    SharedModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
    
  ]
})
export class EditAppointmentModule { }
