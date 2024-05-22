import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterByAadharComponent } from './register-by-aadhar.component';

const routes: Routes = [{ path: '', component: RegisterByAadharComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterByAadharRoutingModule { }
