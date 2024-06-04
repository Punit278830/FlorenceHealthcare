import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {
  private modalData = new Subject<any>();
  modalData$ = this.modalData.asObservable();

  openModal(data: any) {
    this.modalData.next(data);
  }
}
