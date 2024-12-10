import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrescriptionPadComponent } from './prescription-pad.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PrescriptionPadComponent, // Use standalone component directly
      },
    ]),
  ],
})
export class PrescriptionPadModule {}
