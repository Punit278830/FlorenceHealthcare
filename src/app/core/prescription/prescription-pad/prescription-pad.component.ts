
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
  penSize: number = 1;
  maxPenSize: number = 5;
  minPenSize: number = 1;
  isEraserActive: boolean = false;
  penColor: string = '#000000';  // Default pen color is black

  ngAfterViewInit() {
    this.prescriptionPad = new SignaturePad(this.canvasEl.nativeElement);
    this.prescriptionPad.penColor = this.penColor;  // Set initial pen color
    this.canvasEl.nativeElement.style.cursor = 'crosshair';
    this.canvasEl.nativeElement.addEventListener('mousedown', this.onBeginDrawing.bind(this));
    this.canvasEl.nativeElement.addEventListener('mouseup', this.onEndDrawing.bind(this));
    this.canvasEl.nativeElement.addEventListener('mousemove', this.onMouseMove.bind(this));

  }

 // Event handler for when drawing begins
 onBeginDrawing(): void {
  this.isDrawing = true;
  this.canvasEl.nativeElement.style.cursor = 'url("/assets/img/pen-cursor.png"), auto'; // Custom pen cursor
}

// Event handler for when drawing ends
onEndDrawing(): void {
  this.isDrawing = false;
  this.canvasEl.nativeElement.style.cursor = 'crosshair'; // Default crosshair cursor
}

// Optional: Change cursor when moving over the canvas (if you need this functionality)
onMouseMove(event: MouseEvent): void {
  if (this.isDrawing) {
    // If user is drawing, change the cursor to a pen
    this.canvasEl.nativeElement.style.cursor = 'url("/assets/img/pen-cursor.png"), auto';
  } else {
    // Default crosshair cursor
    this.canvasEl.nativeElement.style.cursor = 'crosshair';
  }
}

  // Update pen color
  setPenColor(color: string): void {
    this.penColor = color;
    this.prescriptionPad.penColor = this.penColor;
  }

  toggleEraser() {
    this.isEraserActive = !this.isEraserActive;
    if (this.isEraserActive) {
      this.prescriptionPad.penColor = this.penColor;
      this.prescriptionPad.minWidth = 10;
      this.prescriptionPad.maxWidth = 10;
    } else {
      this.prescriptionPad.penColor = this.penColor;
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