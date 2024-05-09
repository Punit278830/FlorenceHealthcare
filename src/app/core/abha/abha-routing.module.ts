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
        import('./register-by-aadhar/register-by-aadhar.module').then((m) => m.RegisterByAadharModule),
    },
    {
      path: 'confirmAadharOtp',
      loadChildren: () =>
        import('./abha-confirm-otp/abha-confirm-otp.module').then((m) => m.AbhaConfirmOtpModule),
    },
    {
      path: 'profile',
      loadChildren: () =>
        import('./abha-profile/abha-profile.module').then((m) => m.AbhaProfileModule),
    },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbhaRoutingModule { }
