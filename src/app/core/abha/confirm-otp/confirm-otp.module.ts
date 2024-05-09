import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmOTPRoutingModule } from './confirm-otp-routing.module';
import { ConfirmOtpComponent } from './confirm-otp.component';


@NgModule({
  declarations: [
    ConfirmOtpComponent
  ],
  imports: [
    CommonModule,
    ConfirmOTPRoutingModule
  ]
})
export class ConfirmOTPModule { }
