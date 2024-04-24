import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditStaffRoutingModule } from './edit-staff-routing.module';
import { EditStaffComponent } from './edit-staff.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditStaffComponent
  ],
  imports: [
    CommonModule,
    EditStaffRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    
  ]
})
export class EditStaffModule { }
