import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterByAadharRoutingModule } from './register-by-aadhar-routing.module';
import { RegisterByAadharComponent } from './register-by-aadhar.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegisterByAadharComponent,
  ],
  imports: [
    CommonModule,
    RegisterByAadharRoutingModule,
    ReactiveFormsModule,
  ]
})
export class RegisterByAadharModule { }

