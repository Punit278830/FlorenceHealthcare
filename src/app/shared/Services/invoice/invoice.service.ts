import { Injectable } from '@angular/core';
import { api_Url } from 'src/environment/environment';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { Observable } from 'rxjs';
import { Iinvoice, IinvoiceItem } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private readonly apiUrl=api_Url;
public diagnosisId!:number;
public invoiceId!:number;
 
   constructor(private http:ApiHttpService,) {
    console.log();
   }


getAllInvoice():Observable<Iinvoice[]>
{
  return this.http.get(this.apiUrl+'InvoiceInfoes')
}

getInvoiceById(id:number):Observable<Iinvoice>
{
  return this.http.get(this.apiUrl+'InvoiceInfoes/'+id);

}

updateInvoice(id:number,invoiceData:Iinvoice):Observable<any>
{
  return this.http.put(this.apiUrl+'InvoiceInfoes/'+id,invoiceData);

}

getAddtionalInvoiceItemById(id:number):Observable<any[]>
{
  return this.http.get(this.apiUrl+'AdditionalInvoiceItems/invoiceId/'+id);
}

getAddtionalSubInvoiceItemById(id:number):Observable<any[]>
{
  return this.http.get(this.apiUrl+'AdditionalInvoiceItems/'+id);
}

getAllInvoiceMaster():Observable<any[]>
{
return this.http.get(this.apiUrl+'InvoiceItemMasters');
}

addToaddtionalItemInvoice(data:IinvoiceItem):Observable<any>
{
  return this.http.post(this.apiUrl+'AdditionalInvoiceItems',data);
}


updateSubInvoiceItem(id: number,data:any): Observable<any> {
  return this.http.put(this.apiUrl + 'AdditionalInvoiceItems/' + id, data);
}

}