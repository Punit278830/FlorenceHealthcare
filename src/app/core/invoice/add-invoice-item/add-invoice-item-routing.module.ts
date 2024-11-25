import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddInvoiceItemComponent } from './add-invoice-item.component';
import { EditInvoiceComponent } from '../edit-invoice/edit-invoice.component';
const routes: Routes = [
  { path: '', component: AddInvoiceItemComponent },
  { path: 'invoice/edit-invoice/:id', component: EditInvoiceComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddInvoiceItemRoutingModule { }
