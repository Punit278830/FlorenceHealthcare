import { RouterModule, Routes } from '@angular/router';
import { PrescriptionPadComponent } from './prescription-pad/prescription-pad.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: PrescriptionPadComponent,
  children: [
    {
      path: 'prescription-master',
      loadChildren: () =>
        import('./prescription-master/prescription-master.module').then(
          (m) => m.PrescriptionMasterModule
        ),
    },
    {
        path: 'prescription-pad/:appointmentId/:title',
        loadChildren: () =>
          import('./prescription-pad/prescription-pad.module').then(
            (m) => m.PrescriptionPadModule
          )
      },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrescriptionRoutingModule {}
