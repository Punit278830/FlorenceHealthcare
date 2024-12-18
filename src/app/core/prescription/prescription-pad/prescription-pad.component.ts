import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-prescription-pad',
  templateUrl: './prescription-pad.component.html',
  styleUrls: ['./prescription-pad.component.scss'],
})
export class PrescriptionPadComponent implements AfterViewInit {
  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
  prescriptionPad!: SignaturePad;
  title: string = '';
  isDrawing = false;
  penColor = '#000000'; // Default pen color
  penWidth = 2; // Default pen width
  minPenSize = 1;
  maxPenSize = 5;
  isEraserActive = false;
  debounceTimer: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the title parameter from the route
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title') == 'Draw' ? 'Drawing Pad' : 'Prescription Pad'; 
    });
  }

  ngAfterViewInit() {
    const canvas = this.canvasEl.nativeElement;
    canvas.width = 900;
    canvas.height = 600;

    this.prescriptionPad = new SignaturePad(canvas, {
      penColor: this.penColor,
      minWidth: this.penWidth,
      maxWidth: this.penWidth * 2,
      velocityFilterWeight: 0.7,  // Adjust this value to smooth the drawing - 
      //Higher values make the stroke smoother but less responsive, 
      //and lower values make it more responsive but less smooth
      throttle: 16, // Adjust for smoother performance
    });
  }

  // Handle the beginning of drawing
  onBeginDrawing(): void {
    this.isDrawing = true;
    this.setCursor('pen');
  }

  // Handle the end of drawing
  onEndDrawing(): void {
    this.isDrawing = false;
    this.setCursor('crosshair');
  }

  // Update cursor based on drawing state
  onMouseMove(): void {
    if (this.isDrawing) {
      requestAnimationFrame(() => {
        this.setCursor('pen');
      });
    } else {
      requestAnimationFrame(() => {
        this.setCursor('crosshair');
      });
    }
  }

  // Utility to set the cursor style
  private setCursor(style: string): void {
     this.canvasEl.nativeElement.style.cursor = style == 'pen' ?
       'url("/assets/img/icons/edit.svg"), auto'
       : 'crosshair';
  }

  // Update pen colors
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
      this.prescriptionPad.maxWidth = width * 2; // Max width can be twice the min width
    }
  }

  // Toggle eraser mode
  toggleEraser(): void {
    this.isEraserActive = !this.isEraserActive;
    this.prescriptionPad.penColor = this.isEraserActive ? 'white' : this.penColor;
    this.prescriptionPad.minWidth = this.isEraserActive ? 10 : this.penWidth;
    this.prescriptionPad.maxWidth = this.isEraserActive ? 20 : this.penWidth * 2;
  }

  // Adjust pen size
  adjustPenSize(input: HTMLInputElement): void {
    const size = input.valueAsNumber;

    clearTimeout(this.debounceTimer); // Clear any previous debounce
    this.debounceTimer = setTimeout(() => {
      if (size >= this.minPenSize && size <= this.maxPenSize) {
        this.penWidth = size;
        if (!this.isEraserActive) {
          this.prescriptionPad.minWidth = size;
          this.prescriptionPad.maxWidth = size * 2; // Max width can be twice the min width
        }
      } else {
        alert(`Pen size must be between ${this.minPenSize} and ${this.maxPenSize}`);
      }
    }, 200); // Adjust debounce time as needed
  }


  // Clear the canvas
  clearPad(): void {
    this.prescriptionPad.clear();
  }

  // Print the canvas content
  printPad(): void {
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
