import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { AbhaConfirmOtpComponent } from './abha-confirm-otp.component';
import { AbhaConfirmOtpRoutingModule } from './abha-confirm-otp-routing.module';


@NgModule({
  declarations: [
    AbhaConfirmOtpComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AbhaConfirmOtpRoutingModule,
  ],
  exports: [AbhaConfirmOtpComponent]
})
export class AbhaConfirmOtpModule { }
