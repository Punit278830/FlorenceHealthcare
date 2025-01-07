import { NgModule } from "@angular/core";
import { PrescriptionMasterRoutingModule } from "./prescription-master-routing.module";
import { PrescriptionMasterComponent } from "./prescription-master.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    PrescriptionMasterComponent
  ],
  imports: [
    PrescriptionMasterRoutingModule,
    FormsModule,
    CommonModule
  ]
})
export class PrescriptionMasterModule { }
