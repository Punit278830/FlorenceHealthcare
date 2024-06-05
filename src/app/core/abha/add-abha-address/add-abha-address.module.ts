import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAbhaAddressRoutingModule } from './add-abha-address-routing.module';
import { AddAbhaAddressComponent } from './add-abha-address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AddAbhaAddressComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddAbhaAddressRoutingModule,
    SharedModule
  ]
})
export class AddAbhaAddressModule { }
