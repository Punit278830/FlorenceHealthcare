import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterByAadharStepperRoutingModule } from './register-by-aadhar-stepper-routing.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterByAadharStepperComponent } from './register-by-aadhar-stepper.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [RegisterByAadharStepperComponent],
  imports: [
    CommonModule,
    RegisterByAadharStepperRoutingModule,
    MatStepperModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ]
})
export class RegisterByAadharStepperModule { }
