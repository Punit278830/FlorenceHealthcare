import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAppointmentComponent } from './add-appointment.component';
import { InvoiceViewComponent } from '/accounts/invoice-view/invoice-view.component';


const routes: Routes = [
  { path: '', component: AddAppointmentComponent },
  { path: 'invoice-view', component: InvoiceViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAppointmentRoutingModule { }
