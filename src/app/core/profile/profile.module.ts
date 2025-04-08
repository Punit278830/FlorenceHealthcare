import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import {CheckValidityPipe} from '../../shared/pipes/check-validity.pipe';

@NgModule({
  declarations: [
    ProfileComponent,
    CheckValidityPipe
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatStepperModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    MatIconModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileModule { }
