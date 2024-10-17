import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    MatTableModule,
    MatSortModule
  ]
})
export class InvoiceModule { }
