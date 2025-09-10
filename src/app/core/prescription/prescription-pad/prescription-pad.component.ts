import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import SignaturePad from 'signature_pad';
import { LoadingService } from '../../../shared/Services/loader/loader.service';
import { IconsultationFiles } from '../../../shared/models/models';
import { FileUploadService } from '../../../shared/Services/fileUpload/file-upload.service';
import { routes } from 'src/app/shared/routes/routes';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';

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
  drawingpad=false;
  debounceTimer: any;
  fileId?: number;
  private FileUploadDto: IconsultationFiles = {} as IconsultationFiles;

  constructor(private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoadingService,
    private fileUploadServie: FileUploadService,
    private router: Router,
    private patientService: PatientService

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
      
      // this.FileUploadDto.docName = this.title == 'Draw' ? "prescription" : 'pen-prescription';
      if(this.title== 'Prescription Pad' && this.drawingpad===false)
      {
        this.FileUploadDto.docName = 'pen-prescription';
      }
      else
      {
        this.drawingpad=true;
        this.title='Drawing Pad';
        this.FileUploadDto.docName='drawing'
      }
       
      this.FileUploadDto.appointmentId = this.appointmentId;

      this.route.queryParamMap.subscribe(queryParams => {
        this.fileId = queryParams.has('fileId')
          ? Number(queryParams.get('fileId'))
          : undefined; 

        if (this.fileId) {
          this.fileUploadServie.getConsulationFileById(this.fileId).subscribe(res => {
            this.loadImageData(res.fileData || '');
          });
        }
      });
    });
  }

  ngAfterViewInit() {
    const canvas = this.canvasEl.nativeElement;
    const dpr = window.devicePixelRatio || 1;

    const parent = canvas.parentElement;
    if (parent) {
      // Calculate display and actual dimensions
      const displayWidth = parent.clientWidth;
      const displayHeight = parent.clientHeight;

      // Set CSS dimensions for display
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      // Set actual canvas dimensions for drawing
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr); // Scale canvas for high DPI
      }
    }

    // Initialize SignaturePad
    this.prescriptionPad = new SignaturePad(canvas, {
      penColor: this.penColor,
      minWidth: this.penWidth,
      maxWidth: this.penWidth * 2,
      velocityFilterWeight: 0.7,
      throttle: 16, // Smoother drawing
    });
    this.setCursor('pen');
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
    this.isEraserActive ? this.setCursor('pen'):this.setCursor('crosshair')
    this.isEraserActive = !this.isEraserActive;
    this.prescriptionPad.penColor = this.isEraserActive ? '#f9f9f9' : this.penColor;
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

  clearPad(): void {
    const canvas = this.canvasEl.nativeElement;

    // Clear the entire canvas area using actual dimensions
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2);
    }

    // Clear SignaturePad's internal state
    this.prescriptionPad.clear();

    // Force SignaturePad to refresh its internal boundaries
    this.prescriptionPad.off();
    this.prescriptionPad.on();
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
      this.FileUploadDto.fileData = base64String;

      // If the existing file is updated, call update method. else, call upload method
      if (this.fileId != undefined && this.fileId > 0) {
        this.FileUploadDto.fileId = this.fileId;
        this.updateExistingImage();
      } else {
          // Prepare the file upload DTO
        if(this.title== 'Prescription Pad')
        {
          this.FileUploadDto.fileName = `prescription-${Date.now()}.png`;
          this.FileUploadDto.docName = 'pen-prescription';
        }
        else
        {
          this.FileUploadDto.fileName = `drawing-${Date.now()}.png`;
          this.FileUploadDto.docName = 'drawing';
        }
        //this.FileUploadDto.fileName = `prescription-${Date.now()}.png`; // Unique file name
        this.FileUploadDto.FileType = 'image/png';

        this.uploadNewImage();
      }
    }
    else {
      this.loaderService.hideLoader();
      this.toastr.error('Failed to process the canvas.', 'Error');
    }
   
  }

  uploadNewImage() {
    

    this.fileUploadServie.uploadConsultationFile(this.FileUploadDto).subscribe(
      result => {

        const newFileId = result.fileId;

        // Append the file ID to the URL as a query parameter
        this.loaderService.hideLoader();
        //this.router.navigate([routes.profile], { queryParams: { patientId: this.patientService.patientId } });
        this.router.navigate([routes.profile], {
          queryParams: {
            patientId: this.patientService.patientId,
            step: 4 // for example, go to step 3 (index 2)
          }
        });
        this.toastr.success('Canvas image uploaded successfully', 'Success');
        this.clearPad();
        
        
        if (newFileId) {
          const queryParams = newFileId ? { newFileId } : {}; // Include fileId in queryParams if provided
          const urlTree = this.router.createUrlTree(['/prescription-pad', this.appointmentId, this.title], { queryParams });
          this.router.navigateByUrl(urlTree); // Navigate to the constructed URL
        }
      },
      error => {
        this.loaderService.hideLoader();

        this.toastr.error('Image upload failed', 'Error');
      }
    );
  }


  updateExistingImage() {
    this.fileUploadServie.updateConsultationFile(this.fileId ?? 0, this.FileUploadDto).subscribe(
      result => {
       this.loaderService.hideLoader();
        this.toastr.success('Canvas image updated successfully', 'Success');
      },
      error => {
        this.loaderService.hideLoader();

        this.toastr.error('Image update failed', 'Error');
      }
    );

  }

  backToPrescription() {
     //navigate to prescription
     //this.router.navigate([routes.profile], { queryParams: { patientId: this.patientService.patientId } });
     this.router.navigate([routes.profile], {
      queryParams: {
        patientId: this.patientService.patientId,
        step: 4 // for example, go to step 3 (index 2)
      }
    }); 
    }

  loadImageData(base64Image: string): void {
    if (!base64Image.startsWith('data:image')) {
      this.toastr.error('Invalid image data.', 'Error');
      return;
    }

    const image = new Image(); // Create an image object
    image.src = base64Image;

    image.onload = () => {
      const canvas = this.canvasEl.nativeElement;
      const context = canvas.getContext('2d');

      if (context) {
        // Resize canvas to match the image dimensions
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image on the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
      }
    };

    image.onerror = () => {
      this.toastr.error('Failed to load the image.', 'Error');
    };
  }


  // Print the canvas content
  printPad(): void {
    if (this.prescriptionPad.isEmpty()) {
      
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
