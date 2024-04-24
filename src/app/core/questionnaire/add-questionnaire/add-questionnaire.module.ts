import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddQuestionnaireComponent } from './add-questionnaire.component';
import { AddQuestionnaireRoutingModule } from './addquestionnaire-routing.module';
import { materialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddQuestionnaireComponent
  ],
  imports: [
    CommonModule,
    AddQuestionnaireRoutingModule,
    materialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AddQuestionnaireModule { 

  
}
