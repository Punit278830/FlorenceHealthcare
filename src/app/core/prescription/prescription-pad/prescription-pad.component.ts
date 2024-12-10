
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
  public penWidth: number = 2;  // Default pen width (thickness)

  ngAfterViewInit() {
     // Get the canvas element from the template
     const canvas = this.canvasEl.nativeElement;
     this.prescriptionPad = new SignaturePad(canvas);
    this.prescriptionPad.penColor = this.penColor;
    // Set initial pen color and stroke width
    this.prescriptionPad.penColor = this.penColor;
    this.prescriptionPad.minWidth = this.penWidth;
    this.prescriptionPad.maxWidth = this.penWidth * 2;  // Max width can be twice the min width for smooth transitions
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
  changePenColor(color: string): void {
    this.penColor = color;
    if (!this.isEraserActive) {
      this.prescriptionPad.penColor = color;
    }
  }

  // Change the pen thickness
  changePenWidth(width: number): void {
    this.penWidth = width;
    if (!this.isEraserActive) {
      this.prescriptionPad.minWidth = width;
      this.prescriptionPad.maxWidth = width * 2;  // Max width is twice the min width for smooth transitions
    }
  }

  toggleEraser() {
    this.isEraserActive = !this.isEraserActive;
    if (this.isEraserActive) {
      // When the eraser is active, set a transparent color and increase the stroke width for the eraser
      this.prescriptionPad.penColor = 'white';  // Set the pen color to transparent for erasing
      this.prescriptionPad.minWidth = 10;  // Set eraser size
      this.prescriptionPad.maxWidth = 20;  // Max eraser width
    } else {
      // When the pen is active, reset the pen color and thickness
      this.prescriptionPad.penColor = this.penColor;
      this.prescriptionPad.minWidth = this.penWidth;
      this.prescriptionPad.maxWidth = this.penWidth * 2;
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