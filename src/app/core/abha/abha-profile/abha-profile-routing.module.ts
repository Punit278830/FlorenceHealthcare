import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbhaProfileComponent } from './abha-profile.component';

const routes: Routes = [{ path: '', component: AbhaProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbhaProfileRoutingModule { }
