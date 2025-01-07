import { RouterModule, Routes } from "@angular/router";
import { PrescriptionMasterComponent } from "./prescription-master.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  { path: 'prescription-master', component: PrescriptionMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionMasterRoutingModule { }
