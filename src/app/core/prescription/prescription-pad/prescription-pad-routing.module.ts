import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrescriptionPadComponent } from './prescription-pad.component';

const routes: Routes = [
  { path: '', component: PrescriptionPadComponent,
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrescriptionPadRoutingModule {}
