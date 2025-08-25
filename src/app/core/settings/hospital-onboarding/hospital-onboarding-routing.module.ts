import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitalOnboardingComponent } from './hospital-onboarding.component';

const routes: Routes = [
  { path: '', component: HospitalOnboardingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalOnboardingRoutingModule {}
