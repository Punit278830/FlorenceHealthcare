import { Component } from '@angular/core';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: false
})
export class ModalComponent {
  modalData: any;
  isVisible = false;

  constructor(private modalService: ModalServiceService) { }

  ngOnInit() {
    this.modalService.modalData$.subscribe(data => {
      this.modalData = data;
      this.isVisible = true;
    });
  }

  closeModal() {
    this.isVisible = false;
  }

  confirmDelete() {
    if (this.modalData && this.modalData.confirmCallback) {
      this.modalData.confirmCallback();
    }
    this.closeModal();
  }
}
