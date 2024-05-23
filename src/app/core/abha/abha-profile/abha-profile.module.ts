import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { AbhaProfileComponent } from './abha-profile.component';
import { AbhaProfileRoutingModule } from './abha-profile-routing.module';


@NgModule({
  declarations: [
    AbhaProfileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AbhaProfileRoutingModule,
  ],
  exports: [AbhaProfileComponent]
})
export class AbhaProfileModule { }
