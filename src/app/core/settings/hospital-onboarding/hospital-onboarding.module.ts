import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HospitalOnboardingRoutingModule } from './hospital-onboarding-routing.module';
import { HospitalOnboardingComponent } from './hospital-onboarding.component';

@NgModule({
  declarations: [HospitalOnboardingComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, HospitalOnboardingRoutingModule]
})
export class HospitalOnboardingModule {}
