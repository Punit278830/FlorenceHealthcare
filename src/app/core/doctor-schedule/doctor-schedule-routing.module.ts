import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorScheduleComponent } from './doctor-schedule.component';

const routes: Routes = [
  { path: '', component: DoctorScheduleComponent,
  children: [
    {
      path: 'staff-schedule',
      loadChildren: () =>
        import('./staff-schedule/staff-schedule.module').then((m) => m.StaffScheduleModule),
    },
    {
      path: 'schedule',
      loadChildren: () =>
        import('./schedule/schedule.module').then((m) => m.ScheduleModule),
    },
    {
      path: 'add-schedule',
      loadChildren: () =>
        import('./add-schedule/add-schedule.module').then(
          (m) => m.AddScheduleModule
        ),
    },
    {
      path: 'edit-schedule',
      loadChildren: () =>
        import('./edit-schedule/edit-schedule.module').then(
          (m) => m.EditScheduleModule
        ),
    },

    {
      path:'test-schedule',
      loadChildren: () =>
        import('./test-Schedule/testModule').then(
          (m) => m.TestModuleModule
        ),
    },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorScheduleRoutingModule {

  constructor()
  {

  }
}
