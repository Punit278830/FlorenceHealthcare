import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbhaScanDeskRoutingModule } from './abha-scan-desk-routing.module';
import { AbhaScanDeskComponent } from './abha-scan-desk.component';


@NgModule({
  declarations: [
    AbhaScanDeskComponent
  ],
  imports: [
    CommonModule,
    AbhaScanDeskRoutingModule
  ]
})
export class AbhaScanDeskModule { }
