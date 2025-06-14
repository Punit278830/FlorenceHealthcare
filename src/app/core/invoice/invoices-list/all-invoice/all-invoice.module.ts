import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllInvoiceRoutingModule } from './all-invoice-routing.module';
import { AllInvoiceComponent } from './all-invoice.component';
import { SharedModule } from '../../../../shared/shared.module';


@NgModule({
  declarations: [
    AllInvoiceComponent
  ],
  imports: [
    CommonModule,
    AllInvoiceRoutingModule,
    SharedModule
  ]
})
export class AllInvoiceModule { }
