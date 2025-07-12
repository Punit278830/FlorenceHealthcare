import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { IinvoiceItem, Iinvoice, IPaymentMode, IInvoicePaymentDto, ITotalPaymentDetails, ISubItemInvoicePaymentDto, ICreateInvoiceDto, IInvoiceSummaryResponse, SearchCriteriaBase, SearchResponseBase } from '../../models/models';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {


  private readonly apiUrl = api_Url;
  public diagnosisId!: number;
  public invoiceId!: number;
  public itemId!: number;

  constructor(private http: ApiHttpService,) {
    console.log();
  }

  // getAllInvoice(paymentMode: string): Observable<Iinvoice[]> {
  //   const params = new HttpParams().set('paymentMode', paymentMode); // Set query string params
  //   return this.http.get(`${this.apiUrl}InvoiceInfoes`, { params });
  // }

  getAllInvoice(paymentMode: string, paymentStatus: string, fromDate?: string, toDate?: string, skip: number = 0, pageSize: number = 100): Observable<IInvoiceSummaryResponse> {
    let params = new HttpParams()
      .set('paymentMode', paymentMode)
      .set('paymentStatus', paymentStatus)
      .set('skip', skip)
      .set('pageSize', pageSize);

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get(`${this.apiUrl}InvoiceInfoes`, { params });
  }

 

  getPaymentDetails(fromDate: string, toDate: string): Observable<ITotalPaymentDetails> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get(`${this.apiUrl}InvoiceInfoes/totalAmount`, { params });
  }
  getTotalAmount():Observable<number>
   {
      return this.http.get(`${this.apiUrl}InvoiceInfoes/totalAmountDashboard`);
   }

  getInvoiceById(id: number): Observable<Iinvoice> {
    return this.http.get(this.apiUrl + 'InvoiceInfoes/' + id);
  }

  getInvoiceByInvoiceId(invoiceId: number): Observable<Iinvoice> {
    return this.http.get(this.apiUrl + 'InvoiceInfoes/by-invoice-id/' + invoiceId);
  }

  updateInvoice(id: number, invoiceData: IInvoicePaymentDto): Observable<any> {
    return this.http.put(this.apiUrl + 'InvoiceInfoes/' + id, invoiceData);
  }

  createInvoice(patientId: number, invoiceData: ICreateInvoiceDto): Observable<any> {
    return this.http.post(this.apiUrl + 'InvoiceInfoes/createInvoice/' + patientId, invoiceData).pipe(
      catchError(this.handleError)
    );
  }
  deleteInvoice(invoiceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}InvoiceInfoes/${invoiceId}`);
  }


  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err.error);
  }

  payAll(id: number, paymentModeInfo: IPaymentMode): Observable<any> {
    return this.http.put(this.apiUrl + 'AdditionalInvoiceItems/payAll/' + id, paymentModeInfo);
  }

  getAddtionalInvoiceItemById(id: number): Observable<any[]> {
    return this.http.get(this.apiUrl + 'AdditionalInvoiceItems/invoiceId/' + id);
  }

  getAddtionalSubInvoiceItemById(id: number): Observable<any[]> {
    return this.http.get(this.apiUrl + 'AdditionalInvoiceItems/' + id);
  }

  getInvoicesForToday():Observable<any>{
    return this.http.get(this.apiUrl+'InvoiceInfoes/GetInvoicesForToday');
  }

  getAllInvoiceMaster(): Observable<any[]> {
    return this.http.get(this.apiUrl + 'InvoiceItemMasters');
  }

  getInvoiceMasterById(id:number):Observable<any>{
    return this.http.get(this.apiUrl+'InvoiceItemMasters/'+ id);
  }

  addToaddtionalItemInvoice(data: IinvoiceItem): Observable<any> {
    return this.http.post(this.apiUrl + 'AdditionalInvoiceItems', data);
  }

  updateSubInvoiceItem(id: number, data: ISubItemInvoicePaymentDto): Observable<any> {
    return this.http.put(this.apiUrl + 'AdditionalInvoiceItems/' + id, data);
  }

  deleteSubInvoiceItem(invoiceId: number, itemName: string): Observable<any> {
    return this.http.delete(this.apiUrl + 'AdditionalInvoiceItems/' + invoiceId + '/' + itemName);
  }
 


  deleteInvoiceItems(id:number):Observable<any>{
    return this.http.delete(this.apiUrl+'InvoiceItemMasters/'+ id);
  }
 
  putInvoiceMastersItem(id:number, InvoiceItemMaster: IinvoiceItem) {
    return this.http.put(this.apiUrl + 'InvoiceItemMaster/'+ id, InvoiceItemMaster);
  }

  getInvoiceItem() {
    return this.http.get(this.apiUrl + 'InvoiceItemMaster/');
  }

  postInvoiceItem(InvoiceItemMaster: IinvoiceItem) {
    return this.http.post(this.apiUrl + 'InvoiceItemMaster/', InvoiceItemMaster);
  }

  searchInvoices(criteria: SearchCriteriaBase): Observable<SearchResponseBase<Iinvoice>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Send criteria directly, not wrapped in { criteria: ... }
    return this.http.post(
      `${this.apiUrl}InvoiceInfoes/Search`,
      criteria,
      { headers }
    ) as unknown as Observable<SearchResponseBase<Iinvoice>>;
  }
}

