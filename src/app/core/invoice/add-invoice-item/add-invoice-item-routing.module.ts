import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddInvoiceItemComponent } from './add-invoice-item.component';

const routes: Routes = [{ path: '', component: AddInvoiceItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddInvoiceItemRoutingModule { }
