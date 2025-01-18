import { Injectable } from "@angular/core";
import { ApiHttpService } from "../../apiService/apiHttpService";
import { api_Url } from 'src/environment/environment';
import { Observable } from "rxjs";
import { IConsultationTemplate } from "../../models/models";

@Injectable({
    providedIn: 'root'
})
export class ConsultationTemplateMasterService {
    private readonly apiUrl = api_Url;

    constructor(private http: ApiHttpService) {
        console.log();
    }

    addConsultationTemplate(data: IConsultationTemplate): Observable<any> {
        return this.http.post(this.apiUrl + 'PrescriptionTemplateMaster', data)
    }

    getConsultationTemplate(id: number): Observable<IConsultationTemplate[]> {
        return this.http.get(this.apiUrl + "PrescriptionTemplateMaster/" + id);
    }

    getConsultationTemplates(): Observable<IConsultationTemplate> {
        return this.http.get(this.apiUrl + "PrescriptionTemplateMaster/");
    }

    updateConsultationTemplate(id: number, consult: IConsultationTemplate): Observable<any> {
        return this.http.put(this.apiUrl + 'PrescriptionTemplateMaster/' + id, consult)
    }

    deleteTemplate(id: number): Observable<any> {
        return this.http.delete(this.apiUrl + 'PrescriptionTemplateMaster/' + id);
    }
}