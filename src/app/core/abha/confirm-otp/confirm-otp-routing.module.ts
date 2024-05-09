import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmOtpComponent } from './confirm-otp.component';

const routes: Routes = [{ path: '', component: ConfirmOtpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmOTPRoutingModule { }
