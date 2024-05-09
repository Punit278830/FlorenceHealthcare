import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterCopyComponent } from './register-copy.component';

const routes: Routes = [{ path: '', component: RegisterCopyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterCopyRoutingModule { }
