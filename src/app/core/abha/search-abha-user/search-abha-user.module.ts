import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchAbhaUserRoutingModule } from './search-abha-user-routing.module';
import { SearchAbhaUserComponent } from './search-abha-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    SearchAbhaUserComponent
  ],
  imports: [
    CommonModule,
    SearchAbhaUserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class SearchAbhaUserModule { }
