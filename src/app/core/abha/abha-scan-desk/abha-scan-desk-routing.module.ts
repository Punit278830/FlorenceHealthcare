import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbhaScanDeskComponent } from './abha-scan-desk.component';

const routes: Routes = [{ path: '', component: AbhaScanDeskComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbhaScanDeskRoutingModule { }
