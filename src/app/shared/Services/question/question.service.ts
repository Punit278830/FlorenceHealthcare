import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { IQuestionnaires, Ioptions, Iquestion, Ivital } from '../../models/models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private readonly apiUrl=api_Url;
   constructor(private http:ApiHttpService) {
    console.log();
   }

   getAllQuestionaireName():Observable<IQuestionnaires[]>
   {
    return this.http.get(this.apiUrl+'Questionnaires');

   }

   
   CreateQuestionaireName(questName:IQuestionnaires):Observable<any>
   {
    return this.http.post(this.apiUrl+'Questionnaires',questName)
   }


   //*********Question Related API calls ******** */

   createQuestion(question:Iquestion):Observable<any>
   {
    return this.http.post(this.apiUrl+'Questions',question);
   }

   updateQuestion(id:number,question:Iquestion):Observable<any>
   {
    return this.http.put(this.apiUrl+'Questions/'+id,question);
   }



   getQuestionById(id:number):Observable<Iquestion>
   {
    return this.http.get(this.apiUrl+'Questions/'+id);
   }

   getQuestionByQuestionaireId(id:number):Observable<any>
   {
    return this.http.get(this.apiUrl+'Questions/questionnareId/'+id);
   }

   //*********Option related API******* */

   createOption(questionOption:any[]):Observable<any>
   {
    return this.http.post(this.apiUrl+'Options',questionOption);
   }

   getAllOptions():Observable<Ioptions[]>
   {
    return this.http.get(this.apiUrl+'Options');
   }

   //***********Answer related API */

   postQuestionniareAnswers(answers:any):Observable<any>
   {
    return this.http.post(this.apiUrl+'Answers',answers);
   }

   //Get Questionnaire by Department Id
   getQuestionnaireByDepId(depId:number):Observable<IQuestionnaires[]>
   {
    return this.http.get(this.apiUrl+'Questionnaires/departmentId/'+depId)
   }


   //***************Vital relatedAPI********** */

   postVitalInformation(vital:Ivital):Observable<any>
   {
    return this.http.post(this.apiUrl+'VitalInfoes',vital)

   }

   getVitalInfoByAppointmentId(id:number):Observable<Ivital>
   {
    return this.http.get(this.apiUrl+'VitalInfoes/byAppointment/'+id)

   }

   updateVitalInfo(id:number,vital:Ivital):Observable<any>
   {
    return this.http.put(this.apiUrl+'VitalInfoes/'+id,vital)
   }

   //get submit questionary detail on preview

   getQuestionwithAnswerByAppointmentId(appointmentId:number):Observable<any>
   {
    return this.http.get(this.apiUrl+"Questions/appointmentId/"+appointmentId);

   }
}
