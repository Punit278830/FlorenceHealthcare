import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbhaConfirmOtpComponent } from './abha-confirm-otp.component';

const routes: Routes = [{ path: '', component: AbhaConfirmOtpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbhaConfirmOtpRoutingModule { }
