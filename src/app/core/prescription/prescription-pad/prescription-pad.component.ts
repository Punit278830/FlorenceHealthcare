
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-prescription-pad',
 // standalone: true,
  templateUrl: './prescription-pad.component.html',
  styleUrls: ['./prescription-pad.component.scss'],
})
export class PrescriptionPadComponent implements AfterViewInit {
  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
  prescriptionPad!: SignaturePad;
  isDrawing: boolean = false;
  penSize: number = 2;
  maxPenSize: number = 5;
  minPenSize: number = 1;
  isEraserActive: boolean = false;

  ngAfterViewInit() {
    const canvas = this.canvasEl.nativeElement;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = 450;
    this.prescriptionPad = new SignaturePad(canvas, {
      minWidth: this.penSize,
      maxWidth: this.penSize,
      penColor: 'black',
    });
  }

  toggleEraser() {
    this.isEraserActive = !this.isEraserActive;
    if (this.isEraserActive) {
      this.prescriptionPad.penColor = 'white';
      this.prescriptionPad.minWidth = 10;
      this.prescriptionPad.maxWidth = 10;
    } else {
      this.prescriptionPad.penColor = 'black';
      this.prescriptionPad.minWidth = this.penSize;
      this.prescriptionPad.maxWidth = this.penSize;
    }
  }

  adjustPenSize(input: HTMLInputElement) {
    const size = input.valueAsNumber;
    if (size >= this.minPenSize && size <= this.maxPenSize) {
      this.penSize = size;
      if (!this.isEraserActive) {
        this.prescriptionPad.minWidth = size;
        this.prescriptionPad.maxWidth = size;
      }
    } else {
      alert(`Pen size must be between ${this.minPenSize} and ${this.maxPenSize}`);
    }
  }

  clearPad() {
    this.prescriptionPad.clear();
  }

  printPad() {
    if (this.prescriptionPad.isEmpty()) {
      alert('No content to print! Please draw something.');
      return;
    }

    const canvas = this.canvasEl.nativeElement;
    const dataUrl = canvas.toDataURL();

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Prescription</title>
            <style>
              body {
                text-align: center;
                margin: 0;
                padding: 20px;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <h2>Prescription Pad</h2>
            <img src="${dataUrl}" alt="Prescription Image" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  }
}