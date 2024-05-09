import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterCopyRoutingModule } from './register-copy-routing.module';
import { RegisterCopyComponent } from './register-copy.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegisterCopyComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegisterCopyRoutingModule,
  ],
  exports: [RegisterCopyComponent]
})
export class RegisterCopyModule { }
