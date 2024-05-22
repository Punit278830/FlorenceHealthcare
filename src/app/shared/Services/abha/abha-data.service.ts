import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbhaDataService {
  private dataSource = new BehaviorSubject({ message: 'default', 
  txnId: 'default',
   });
  currentData = this.dataSource.asObservable();

  setData(data: { message: string, txnId: string }) { 
    this.dataSource.next(data);
  }
}
