import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAbhaAddressComponent } from './add-abha-address.component';

const routes: Routes = [{ path: '', component: AddAbhaAddressComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAbhaAddressRoutingModule { }
