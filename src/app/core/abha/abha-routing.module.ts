import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbhaComponent } from './abha.component';

const routes: Routes = [
  { path: '', component: AbhaComponent,
  children: [
    {
      path: 'abha-dashboard',
      loadChildren: () =>
        import('./abha-dashboard/abha-dashboard.module').then((m) => m.AbhaDashboardModule),
    },
    {
      path: 'register/byAadhar',
      loadChildren: () =>
      import('./register-by-aadhar-stepper/register-by-aadhar-stepper.module').then((m) => m.RegisterByAadharStepperModule),
    },
    {
      path: 'register/address',
      loadChildren: () =>
        import('./add-abha-address/add-abha-address.module').then((m) => m.AddAbhaAddressModule),
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbhaRoutingModule { }
