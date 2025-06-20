import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { IinvoiceItem, Iinvoice, IPaymentMode, IInvoicePaymentDto, ITotalPaymentDetails, ISubItemInvoicePaymentDto, ICreateInvoiceDto, IInvoiceSummaryResponse } from '../../models/models';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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

  // All date/time handling in this file uses dayjs.tz('Asia/Kolkata') for IST compliance.
  getAllInvoice(paymentMode: string, paymentStatus: string, fromDate?: string, toDate?: string): Observable<IInvoiceSummaryResponse> {
    let params = new HttpParams()
      .set('paymentMode', paymentMode)
      .set('paymentStatus', paymentStatus);

    if (fromDate) {
      fromDate = dayjs(fromDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      toDate = dayjs(toDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      params = params.set('toDate', toDate);
    }

    return this.http.get(`${this.apiUrl}InvoiceInfoes`, { params });
  }

 

  getPaymentDetails(fromDate: string, toDate: string): Observable<ITotalPaymentDetails> {
    let params = new HttpParams();
    if (fromDate) {
      fromDate = dayjs(fromDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      toDate = dayjs(toDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
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
    return this.http.get(`${this.apiUrl}AdditionalInvoiceItems/invoiceId/${id}`);
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
    const encodedItemName = encodeURIComponent(itemName);
    return this.http.delete(`${this.apiUrl}AdditionalInvoiceItems/${invoiceId}/${encodedItemName}`);
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



}

