import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { IinvoiceItem, Iinvoice, IPaymentMode, IInvoicePaymentDto, ITotalPaymentDetails, ISubItemInvoicePaymentDto, ICreateInvoiceDto, IInvoiceSummaryResponse } from '../../models/models';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {


  private readonly apiUrl = api_Url;
  public diagnosisId!: number;
  public invoiceId!: number;

  constructor(private http: ApiHttpService,) {
    console.log();
  }

  // getAllInvoice(paymentMode: string): Observable<Iinvoice[]> {
  //   const params = new HttpParams().set('paymentMode', paymentMode); // Set query string params
  //   return this.http.get(`${this.apiUrl}InvoiceInfoes`, { params });
  // }

  getAllInvoice(paymentMode: string, paymentStatus: string, fromDate?: string, toDate?: string): Observable<IInvoiceSummaryResponse> {
    let params = new HttpParams()
      .set('paymentMode', paymentMode)
      .set('paymentStatus', paymentStatus);

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

  getInvoiceById(id: number): Observable<Iinvoice> {
    return this.http.get(this.apiUrl + 'InvoiceInfoes/' + id);
  }

  updateInvoice(id: number, invoiceData: IInvoicePaymentDto): Observable<any> {
    return this.http.put(this.apiUrl + 'InvoiceInfoes/' + id, invoiceData);
  }

  createInvoice(patientId: number, invoiceData: ICreateInvoiceDto): Observable<any> {
    return this.http.post(this.apiUrl + 'InvoiceInfoes/createInvoice/' + patientId, invoiceData).pipe(
      catchError(this.handleError)
    );
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

  getAllInvoiceMaster(): Observable<any[]> {
    return this.http.get(this.apiUrl + 'InvoiceItemMasters');
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

  getInvoiceItem() {
    return this.http.get(this.apiUrl + 'InvoiceItemMaster/');
  }

  postInvoiceItem(InvoiceItemMaster: IinvoiceItem) {
    return this.http.post(this.apiUrl + 'InvoiceItemMaster/', InvoiceItemMaster);
  }



}

