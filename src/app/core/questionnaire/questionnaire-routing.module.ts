import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire.component';


const routes: Routes = [
  { path: '', component: QuestionnaireComponent,
  children: [
    {
      path: 'add-questionnaire',
      loadChildren: () =>
        import('./add-questionnaire/add-questionnaire.module').then((m) => m.AddQuestionnaireModule),
    },
],
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionnaireRoutingModule {}