import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestScheduleComponent } from './test-schedule.component';

const routes: Routes = [{ path: '', component: TestScheduleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestModuleRoutingModule {

}