import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import {  IinvoiceItem, Iinvoice, IPaymentMode, IInvoicePaymentDto, ITotalPaymentDetails, ISubItemInvoicePaymentDto } from '../../models/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

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
  
  getAllInvoice(paymentMode: string): Observable<Iinvoice[]> {
    const params = new HttpParams().set('paymentMode', paymentMode); // Set query string params
    return this.http.get(`${this.apiUrl}InvoiceInfoes`, { params });
  }

  getPaymentDetails(): Observable<ITotalPaymentDetails> {
    return this.http.get(`${this.apiUrl}InvoiceInfoes/totalAmount`);
  }
  
  getInvoiceById(id:number):Observable<Iinvoice>
  {
    return this.http.get(this.apiUrl+'InvoiceInfoes/'+id);  
  }
  
  updateInvoice(id:number,invoiceData:IInvoicePaymentDto):Observable<any>
  {
    return this.http.put(this.apiUrl+'InvoiceInfoes/'+id,invoiceData);  
  }

  
  payAll(id:number,paymentModeInfo: IPaymentMode):Observable<any>
  {
    return this.http.put(this.apiUrl+'AdditionalInvoiceItems/payAll/'+id, paymentModeInfo);  
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
  
  updateSubInvoiceItem(id: number, data:ISubItemInvoicePaymentDto): Observable<any> {
    return this.http.put(this.apiUrl + 'AdditionalInvoiceItems/' + id, data);
  }

  getInvoiceItem()
   {
     return this.http.get(this.apiUrl+'InvoiceItemMaster/');
   }
  
   postInvoiceItem(InvoiceItemMaster:IinvoiceItem)
   {
     return this.http.post(this.apiUrl+'InvoiceItemMaster/',InvoiceItemMaster);
   }
   
    

}

