import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPatientRoutingModule } from './add-patient-routing.module';
import { AddPatientComponent } from './add-patient.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [
    AddPatientComponent
  ],
  imports: [
    CommonModule,
    AddPatientRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    WebcamModule
    
  ]
})
export class AddPatientModule { }
