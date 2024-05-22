import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterByAadharStepperComponent } from './register-by-aadhar-stepper.component';

const routes: Routes = [{ path: '', component: RegisterByAadharStepperComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterByAadharStepperRoutingModule { }
