import { NgModule } from "@angular/core";
import { PrescriptionPadRoutingModule } from "./prescription-pad-routing.module";
import { PrescriptionPadComponent } from "./prescription-pad.component";

@NgModule({
  declarations: [
    PrescriptionPadComponent
  ],
  imports: [
    PrescriptionPadRoutingModule,
  ]
})
export class PrescriptionPadModule { }
