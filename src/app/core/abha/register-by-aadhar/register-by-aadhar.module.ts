import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterByAadharRoutingModule } from './register-by-aadhar-routing.module';
import { RegisterByAadharComponent } from './register-by-aadhar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmOTPModule } from '../confirm-otp/confirm-otp.module';
import { RegisterCopyModule } from '../register-copy/register-copy.module';


@NgModule({
  declarations: [
    RegisterByAadharComponent,
  ],
  imports: [
    CommonModule,
    RegisterByAadharRoutingModule,
    ReactiveFormsModule,
    ConfirmOTPModule,
    RegisterCopyModule
  ]
})
export class RegisterByAadharModule { }
