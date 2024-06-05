import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchAbhaUserComponent } from './search-abha-user.component';

const routes: Routes = [{ path: '', component: SearchAbhaUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchAbhaUserRoutingModule { }
