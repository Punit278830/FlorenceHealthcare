import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MedicinesMasterComponent } from "./medicines-master.component";
import { MedicinesMasterRoutingModule } from "./medicines-master-routing.module";

@NgModule({
  declarations: [
    MedicinesMasterComponent
  ],
  imports: [
    MedicinesMasterRoutingModule,
    FormsModule,
    CommonModule
  ]
})
export class MedicinesMasterModule { }
