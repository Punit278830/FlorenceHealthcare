import { NgModule } from '@angular/core';
import { PrescriptionPadComponent } from './prescription-pad/prescription-pad.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrescriptionPadRoutingModule } from './prescription-pad/prescription-pad-routing.module';
import { PrescriptionMasterComponent } from './prescription-master/prescription-master.component';
import { PrescriptionMasterRoutingModule } from './prescription-master/prescription-master-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MedicinesMasterRoutingModule } from './medicines-master/medicines-master-routing.module';
import { MedicinesMasterComponent } from './medicines-master/medicines-master.component';

@NgModule({
  declarations: [
    PrescriptionPadComponent,
    PrescriptionMasterComponent,
    MedicinesMasterComponent
  ],
  imports: [
    CommonModule,
    PrescriptionPadRoutingModule,
    PrescriptionMasterRoutingModule,
    MedicinesMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
})

export class PrescriptionModule { }