import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterByAadharRoutingModule } from './register-by-aadhar-routing.module';
import { RegisterByAadharComponent } from './register-by-aadhar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AbhaConfirmOtpModule } from '../abha-confirm-otp/abha-confirm-otp.module';

@NgModule({
  declarations: [
    RegisterByAadharComponent,
  ],
  imports: [
    CommonModule,
    RegisterByAadharRoutingModule,
    ReactiveFormsModule,
    AbhaConfirmOtpModule
  ]
})
export class RegisterByAadharModule { }
