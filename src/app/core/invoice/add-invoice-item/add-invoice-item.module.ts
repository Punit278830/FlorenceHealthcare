import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddInvoiceItemComponent } from './add-invoice-item.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddInvoiceItemRoutingModule } from './add-invoice-item-routing.module'


@NgModule({
  declarations: [
    AddInvoiceItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AddInvoiceItemRoutingModule
  ]
})
export class AddInvoiceItem { }
