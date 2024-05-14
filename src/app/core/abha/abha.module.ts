import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbhaRoutingModule } from './abha-routing.module';
import { AbhaComponent } from './abha.component';


@NgModule({
  declarations: [
    AbhaComponent,
  ],
  imports: [
    CommonModule,
    AbhaRoutingModule,
  ]
})
export class AbhaModule { }
