import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import SignaturePad from 'signature_pad';
import { LoadingService } from '../../../shared/Services/loader/loader.service';
import { IconsultationFiles } from '../../../shared/models/models';
import { FileUploadService } from '../../../shared/Services/fileUpload/file-upload.service';

@Component({
  selector: 'app-prescription-pad',
  templateUrl: './prescription-pad.component.html',
  styleUrls: ['./prescription-pad.component.scss'],
})
export class PrescriptionPadComponent implements AfterViewInit {
  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
  prescriptionPad!: SignaturePad;
  title: string = '';
  appointmentId: number = 0;
  isDrawing = false;
  penColor = '#000000'; // Default pen color
  penWidth = 2; // Default pen width
  minPenSize = 1;
  maxPenSize = 5;
  isEraserActive = false;
  debounceTimer: any;
  private FileUploadDto: IconsultationFiles = {} as IconsultationFiles;

  constructor(private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoadingService,
    private fileUploadServie: FileUploadService,
  ) {

  }

  ngOnInit(): void {
    // Get the title parameter from the route
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title') == 'Draw' ? 'Drawing Pad' : 'Prescription Pad';
      this.appointmentId = Number(params.get('appointmentId')) || 0;
      if (this.appointmentId == 0) {
        this.toastr.error("Appointment id is missing in URL.", "Error");
        return;
      }

      this.FileUploadDto.docName = this.title == 'Draw' ? "prescription" : 'pen-prescription';
      this.FileUploadDto.appointmentId = this.appointmentId;
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

  saveAsImage(): void {
    if (this.prescriptionPad.isEmpty()) {
      alert('No content to save! Please draw something.');
      return;
    }

    const canvas = this.canvasEl.nativeElement;

    // Create a temporary canvas to add a white background
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');

    if (tempContext) {
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // Fill with white background
      tempContext.fillStyle = '#ffffff';
      tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original canvas content on top
      tempContext.drawImage(canvas, 0, 0);

      // Generate the data URL from the temporary canvas
      const dataUrl = tempCanvas.toDataURL('image/png');

      // Trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'prescription-pad-image.png';
      link.click();
    }
  }


  saveCanvasToDatabase(): void {
    if (this.prescriptionPad.isEmpty()) {
      this.toastr.error("No content to save! Please draw something.", "Error");
      return;
    }

    this.loaderService.showLoader();

    const canvas = this.canvasEl.nativeElement;

    // Create a temporary canvas to ensure the image has a white background
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');

    if (tempContext) {
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // Fill with white background
      tempContext.fillStyle = '#ffffff';
      tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original canvas content on top
      tempContext.drawImage(canvas, 0, 0);

      // Convert the temporary canvas content to a Base64 string
      const base64String = tempCanvas.toDataURL('image/png');

      // Prepare the file upload DTO
      this.FileUploadDto.fileName = `prescription-${Date.now()}.png`; // Unique file name
      this.FileUploadDto.FileType = 'image/png';
      this.FileUploadDto.fileData = base64String;

      // Call the upload service
      this.fileUploadServie.uploadConsultationFile(this.FileUploadDto).subscribe(
        result => {
          console.log(result);
          this.loaderService.hideLoader();
          this.toastr.success('Canvas image uploaded successfully', 'Success');
        },
        error => {
          this.loaderService.hideLoader();
          console.error('Error uploading canvas image:', error);
          this.toastr.error('Image upload failed', 'Error');
        }
      );
    } else {
      this.loaderService.hideLoader();
      this.toastr.error('Failed to process the canvas.', 'Error');
    }
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
