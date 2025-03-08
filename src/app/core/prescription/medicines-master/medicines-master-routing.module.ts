import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MedicinesMasterComponent } from "./medicines-master.component";

const routes: Routes = [
  { path: 'medicines-master', component: MedicinesMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicinesMasterRoutingModule { }
