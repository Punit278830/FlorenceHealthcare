import { NgModule } from '@angular/core';
import { PrescriptionPadComponent } from './prescription-pad/prescription-pad.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionPadRoutingModule } from './prescription-pad/prescription-pad-routing.module';

@NgModule({
  declarations: [
    PrescriptionPadComponent
  ],
  imports: [
    CommonModule,
    PrescriptionPadRoutingModule,
    FormsModule,
  ],
})

export class PrescriptionModule { }