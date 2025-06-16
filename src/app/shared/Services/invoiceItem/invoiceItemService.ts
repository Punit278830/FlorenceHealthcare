import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../apiService/apiHttpService';
import { api_Url } from 'src/environment/environment';
import { Observable, throwError } from 'rxjs';
import { IinvoiceItem } from '../../models/models';


@Injectable({
  providedIn: 'root'
})

export class InvoiceItemService
{
private readonly apiUrl = api_Url;
  public itemId!: number;
  constructor(private http: ApiHttpService,) {
    console.log();
  }

  getItemById(itemId:number):Observable<IinvoiceItem>
  {
    return this.http.get(this.apiUrl+'InvoiceItemMasters/'+itemId);

  }

  getAllItems() {
  return this.http.get(this.apiUrl + 'InvoiceItemMaster') as unknown as Observable<IinvoiceItem[]>;
}

searchItemByName(itemName: string): Observable<IinvoiceItem[]> {
    return this.http.get(`${this.apiUrl}InvoiceItemMasters/search/${itemName}`);
}


}