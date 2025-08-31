import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitalOnboardingComponent } from './hospital-onboarding.component';
import { SuperAdminGuard } from 'src/app/shared/guards/super-admin.guard';

const routes: Routes = [
  { path: '', component: HospitalOnboardingComponent, canActivate: [SuperAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalOnboardingRoutingModule {}
