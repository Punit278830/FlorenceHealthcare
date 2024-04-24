import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionnaireComponent } from './add-questionnaire.component';




const routes: Routes = [
  { path: '', component: AddQuestionnaireComponent,
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class AddQuestionnaireRoutingModule {}