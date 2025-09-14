import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppointmentService } from '../../../shared/Services/appointment/appointment.service';
import { InvoiceService } from '../../../shared/Services/invoice/invoice.service';
import { PatientService } from '../../../shared/Services/patient/patient.service';
import { StaffService } from '../../../shared/Services/staff/staff.service';
import { Iappointment, Iinvoice, IinvoiceTemp, IpatientInfo, IstaffInfo } from '../../../shared/models/models';
import { routes } from '../../../shared/routes/routes';
import { DecimalPipe } from '@angular/common';
import { create, SheetsRegistry } from "jss";
import preset from "jss-preset-default";
import { IInvoicePaymentDto, IPaymentMode, ISubItemInvoicePaymentDto } from '../../../shared/models/models';
import { api_Url } from 'src/environment/environment';
import { TimezoneService } from 'src/app/shared/Services/timezone/timezone.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to IST
dayjs.tz.setDefault('Asia/Kolkata');

const styles = {
  singleLine: `
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    white-space: pre-wrap;
  `,
  printAreaContainer: `
    padding: 8px;
  `,
  fontMono: {
    fontFamily: "monospace"
  },
  textCenter: {
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },
  textLeft: {
    textAlign: "left"
  },
  fontBold: {
    fontWeight: "bold"
  },
  grid3Col: {
    display: "grid",
    columnGap: "5px",
    gridTemplateColumns: "1fr auto auto"
  },
  gridBorderSolid: `
    border-bottom: 1px solid;
  `,
  gridBorderDashed: `
    border-bottom: 1px dashed;
  `,
  gridBorderDouble: `
    border-bottom: 3px double;
  `,
  gridBorder: `
    grid-column: 1 / -1;
    margin: 4px 0;
  `,
  nowrap: {
    overflow: "hidden",
    textOverflow: "clip",
    whiteSpace: "nowrap"
  },
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "70mm"

  },
  colSpan2: {
    gridColumn: "span 2 / span 2"
  },
  maxLine2: {
    maxHeight: "30px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  }
};
// const sheets = new SheetsRegistry();
// const sheet = jss.createStyleSheet(styles);
// sheets.add(sheet);
// const { classes } = sheet.attach();


@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
  providers: [DecimalPipe]  // Add DecimalPipe to providers
})


export class InvoiceViewComponent implements OnInit {
  @ViewChild('printview', { static: false }) printView!: ElementRef;
  @ViewChild('RefNoInput') RefNoInput!: ElementRef;
  public routes = routes;
  private sheets!: SheetsRegistry;
  public invoiceDetails!: Iinvoice;
  public tempinvoiceDetails!: IinvoiceTemp;
  public paymentModeDetails!: IPaymentMode;
  public invoicePaymentDto!: IInvoicePaymentDto;
  public subInvoicePaymentDto!: ISubItemInvoicePaymentDto;
  private invoiceId!: number;
  public transactionId?: string;
  uniqueTransactionIds: { transactionId: string }[] = [];
  public patientDetails!: IpatientInfo;
  public appointmentDetails!: Iappointment;
  public doctorDetails!: IstaffInfo;
  
  // Hospital details for invoice
  public hospitalDetails: any = null;
  public addtionalInoiveItem: any[] = [];
  public totalInvoiceAmount = 0;
  public balanceAmount = 0;
  public isPaidButtonVisible = true;
  public appointmentList: any[] = [];
  public flag: boolean = false;
  public IsDoctorSameflag: boolean = false;
  public classes: any;
  public width!: string;
  public thermalvisible: boolean = false;
  public disc: number = 0;
  public loggedIn!: any;
  public Timenow!: string;
  public ConsultationPaidStatus: string;
  isAllowed: boolean = false; // disable print button incase of unpaid
  public isReferenceLabelVisible = false;
  public invoiceDate?: Date | string; // Added for InvoiceDate
  formatToTwoDecimalPlaces(value: number): string {
    return value.toFixed(2); // Converts to a string with 2 decimal places
  }
  public paymentMode: string;
  public ReferenceTextBoxVal: string;
  buttonColors = {
    Cash: 'lightgray',
    Online: 'lightgray',
    both: 'lightgray'
  };
  isTextboxVisible = false;
  changeColor(button: string) {
    // Reset all buttons to default color
    this.buttonColors.Cash = 'lightgray';
    this.buttonColors.Online = 'lightgray';
    this.buttonColors.both = 'lightgray';

    // Change the color of the clicked button
    if (button === 'Cash') {
      this.buttonColors.Cash = 'orange';
      this.isTextboxVisible = false;
      this.paymentMode = 'Cash';
      this.isReferenceLabelVisible = false;

    } else if (button === 'Online') {

      this.buttonColors.Online = 'green';
      this.isTextboxVisible = !this.isTextboxVisible;
      this.paymentMode = 'Online';
      this.isReferenceLabelVisible = true;
    }
    else if (button === 'both') {
      this.buttonColors.both = 'blue';
      this.isTextboxVisible = false;
      this.paymentMode = 'both';
      this.isReferenceLabelVisible = false;
    }
  }


  toggleTextbox() {
    this.isTextboxVisible = !this.isTextboxVisible;
  }

  constructor(private invoiceService: InvoiceService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private staffService: StaffService,
    private http: HttpClient,
    private toastr: ToastrService,
    private decimalPipe: DecimalPipe,
    private route: Router,
    private timezoneService: TimezoneService) {
    this.loggedIn = JSON.parse(localStorage.getItem('data') || '');
    if (!this.invoiceService.invoiceId) {
      this.route.navigate(['/accounts/invoices'])
    }
    this.paymentMode = '';
    this.ReferenceTextBoxVal = '';
    this.ConsultationPaidStatus = '';

    this.paymentModeDetails = {
      invoiceId: 0,
      paymentMode: '',
      transactionId: '',
      amount: 0,
      itemName: '',
      itemId: ''
    };

    this.subInvoicePaymentDto = {
      additionalInvoiceItem: null,
      paymentModeInfo: this.paymentModeDetails
    }

    this.invoicePaymentDto = {
      invoiceInfo: this.invoiceDetails,
      paymentModeInfo: this.paymentModeDetails
    };
  }

  tempDoctorModels: any = {
    name: '',
    transactionId: 0
  };

  getInvoiceDetails() {
    this.invoiceId = this.invoiceService.invoiceId;
    if (this.invoiceId > 0) {
      this.invoiceService.getInvoiceByInvoiceId(this.invoiceId).subscribe(res => {
        this.isPaidButtonVisible = res.status != 'Paid'
        this.isAllowed = res.status == 'Paid';

        this.invoiceDetails = res;
        this.tempinvoiceDetails = {
          ...res,            // Spread the properties of Iinvoice
          tempItemName: 'Consultation'   // Add the missing tempItemName property
        };

        // Load hospital details if hospitalId is available
        if (res.hospitalId) {
          this.getHospitalDetails(res.hospitalId);
        }

        if (!res.isConsultationPaid && (res.status == 'Unpaid' || res.status == "Partially Paid")) {
          this.balanceAmount = this.balanceAmount + res.amount;
        }

        this.decimalPipe.transform(this.totalInvoiceAmount += res.amount, '1.2-2') || '';
        this.getPatientDetails(res.patientId);
        this.getAddtionalItems(this.invoiceId);

        if (res.appointmentId > 0) {
          this.getAppointDetails(res.appointmentId);
        }
      });
    }
  }

  public currentInvoiceDate: Date = new Date(); // Add this property

  // Method to get hospital details for invoice
  getHospitalDetails(hospitalId: number) {
    this.http.get(`${api_Url}Hospitals/invoice-info/${hospitalId}`).subscribe({
      next: (res: any) => {
        this.hospitalDetails = res;
      },
      error: (error) => {
        console.error('Error fetching hospital details:', error);
        this.hospitalDetails = null;
      }
    });
  }

  ngOnInit() {
    this.currentInvoiceDate = new Date(); // Set current date at runtime
    this.getInvoiceDetails();
    const jss = create(preset());
    this.sheets = new SheetsRegistry();
    const sheet = jss.createStyleSheet(styles);
    this.sheets.add(sheet);
    this.classes = sheet.attach().classes;
    this.width = '80mm';
  }

  // Method to merge transaction IDs and remove duplicates in JSON format
  getMergedTransactionIds(): { transactionId: string }[] {
    const transactionIds: { transactionId: string }[] = [];

    // Check and add the transactionId from invoiceDetails if it exists
    if (this.invoiceDetails && this.invoiceDetails.transactionId) {
      // Ignore "Cash Payment"
      if (this.invoiceDetails.transactionId !== 'Cash') {
        transactionIds.push({ transactionId: this.invoiceDetails.transactionId });
      }
    }

    // Check and add transactionIds from additionalInvoiceItem array
    if (this.addtionalInoiveItem && this.addtionalInoiveItem.length > 0) {
      this.addtionalInoiveItem.forEach(item => {
        if (item.transactionId && item.transactionId !== 'Cash Payment') {
          transactionIds.push({ transactionId: item.transactionId });
        }
      });
    }

    // Remove duplicates using Set (by converting objects to strings)
    const uniqueTransactionIds = Array.from(new Set(transactionIds.map(a => JSON.stringify(a))))
      .map(e => JSON.parse(e));

    return uniqueTransactionIds;
  }

  getPatientDetails(id: number) {
    this.patientService.getPatientData(id).subscribe(res => {
      this.patientDetails = res;
    })
  }

  handleClick(event: MouseEvent): void {
    if (!this.isAllowed) {
      // Prevent default behavior if not allowed
      event.stopImmediatePropagation(); // Prevent event from propagating
      return; // Exit the function to avoid further processing
    }
  }

  getAppointDetails(id: number) {
    this.appointmentService.getAppointmentById(id).subscribe(res => {
      this.appointmentDetails = res;
      this.getDoctorDetails();
    })
  }

  getDoctorDetails() {
    this.staffService.getStaffByID(this.appointmentDetails.doctorId).subscribe(res => {
      this.doctorDetails = res;
      this.loadPatientAppointments();
    }
    )
  }

  loadPatientAppointments() {
    this.appointmentList = [];
    const currentYear = new Date().getFullYear();

    this.appointmentService.getAppointmentListByPatientId(this.patientService.patientId, currentYear).subscribe(res => {
      this.appointmentList = res;

      // Find the latest appointment and check if it is within the last 6 days
      this.checkLatestAppointmentWithin6Days();
    });
  }

  checkLatestAppointmentWithin6Days() {
    this.flag = false;
    this.IsDoctorSameflag = false;
    this.disc = 0;

    if (!this.appointmentList.length) return;

    // Sort appointments by date descending
    this.appointmentList.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

    const selectedDoctor = this.appointmentDetails.doctorId;
    const selectedDate = dayjs(this.appointmentDetails.date).tz('Asia/Kolkata');

    // Find the most recent previous appointment
    const previous = this.appointmentList.find(
      appt => dayjs(appt.date).tz('Asia/Kolkata').isBefore(selectedDate)
    );

    if (!previous) {
      console.warn("No appointment found before the selected appointment date.");
      return;
    }

    const previousDate = dayjs(previous.date).tz('Asia/Kolkata');
    const differenceInDays = selectedDate.diff(previousDate, 'day');
    this.IsDoctorSameflag = previous.doctorId === selectedDoctor;

    // Only set flag if within 6 days, doctor is the same, and previousDate <= selectedDate
    if (differenceInDays <= 6 && differenceInDays >= 0 && this.IsDoctorSameflag && (previousDate.isBefore(selectedDate) || previousDate.isSame(selectedDate))) {
      this.flag = true;
      this.totalInvoiceAmount -= this.invoiceDetails.amount;
      this.disc = 100;
      // Set previousAppointmentDate for display
      this.invoiceDetails.previousAppointmentDate = previousDate.format('YYYY-MM-DD');
    } else {
      this.flag = false;
      this.invoiceDetails.previousAppointmentDate = undefined;
    }
  } 
  
  backToAppointmentList() {
    this.route.navigate(['/appointments/appointment-list']);
  }

  payAll(invoiceId: number) {
    if (this.paymentMode == '') {
      alert('Please select payment mode first!');
      return;
    }

    if (this.paymentMode == 'Online') {
      if (this.RefNoInput.nativeElement.value == '') {
        alert('Please enter online payment reference number!');
        return;
      }

      this.paymentModeDetails.transactionId = this.RefNoInput.nativeElement.value;
    }
    else {
      this.paymentModeDetails.transactionId = null;
    }

    this.paymentModeDetails.paymentMode = this.paymentMode;
    this.paymentModeDetails.invoiceId = this.invoiceDetails.invoiceId;
    this.paymentModeDetails.amount = 0;
    this.paymentModeDetails.itemId = this.addtionalInoiveItem.filter(x => x.status == 'Unpaid').map(x => x.id).join(',');
    this.paymentModeDetails.itemName = this.addtionalInoiveItem.filter(x => x.status == 'Unpaid').map(x => x.itemName).join(',');

    if (this.tempinvoiceDetails.tempItemName == 'Consultation' && this.tempinvoiceDetails.isConsultationPaid == false) {
      this.paymentModeDetails.itemId = this.paymentModeDetails.itemId + ',Consultation';
      this.paymentModeDetails.itemName = this.paymentModeDetails.itemName + ',Consultation';


    }

    this.invoiceService.payAll(invoiceId, this.paymentModeDetails).subscribe(res => {
      this.totalInvoiceAmount = 0;
      this.getInvoiceDetails();
      this.balanceAmount = 0;
      this.toastr.success("Invoice Paid Successfully", "Update Invoice");
    })
  }

  removeItem(itemName: string): void {
    this.invoiceService.deleteSubInvoiceItem(this.invoiceId, itemName).subscribe(res => {
      this.totalInvoiceAmount = 0;
      this.balanceAmount = 0;
      this.getInvoiceDetails();
      this.toastr.success("Additional item deleted Successfully", "Update Invoice")
    });
  }

  paidinvoice(invoiceDetails: any) {

    if (this.paymentMode == '') {
      alert('Please select payment mode first!');
      return;
    }

    if (this.paymentMode == 'Online') {
      if (this.RefNoInput.nativeElement.value == '') {
        alert('Please enter online payment reference number!');
        return;
      }

      this.paymentModeDetails.transactionId = this.RefNoInput.nativeElement.value;
    }
    else {
      this.paymentModeDetails.transactionId = null;
    }

    this.invoiceDetails.status = 'Paid';
    this.invoiceDetails.isConsultationPaid = true;
    this.isAllowed = true;

    this.paymentModeDetails.itemName = 'Consultation';
    this.paymentModeDetails.paymentMode = this.paymentMode;
    this.paymentModeDetails.invoiceId = this.invoiceDetails.invoiceId;
    this.paymentModeDetails.amount = invoiceDetails.amount;
    this.paymentModeDetails.itemId = 'Consultation';
    this.paymentModeDetails.itemName = 'Consultation';

    this.invoicePaymentDto.invoiceInfo = this.invoiceDetails;
    this.invoicePaymentDto.paymentModeInfo = this.paymentModeDetails;

    this.invoiceService.updateInvoice(invoiceDetails.invoiceId, this.invoicePaymentDto).subscribe(res => {
      this.balanceAmount = 0;
      this.totalInvoiceAmount = 0;
      this.getInvoiceDetails();
      this.toastr.success("Invoice Paid Successfully", "Update Invoice");
    })

  }

  print() {
    this.getMergedTransactionIds();
    this.thermalvisible = true;

    // Use invoice generated time for Timenow
    let invoiceTime: string | undefined = undefined;
    if (this.invoiceDetails?.InvoiceDate) {
      invoiceTime = this.timezoneService.convertToISTTimeOnly(this.invoiceDetails.InvoiceDate);
    } else if (this.invoiceDetails?.createdDate) {
      invoiceTime = this.timezoneService.convertToISTTimeOnly(this.invoiceDetails.createdDate);
    }
    this.Timenow = invoiceTime || '';

    if (this.isTextboxVisible == false) {
      this.ReferenceTextBoxVal = 'NA';
    }
    else {
      const inputValue = this.RefNoInput.nativeElement.value;
      this.ReferenceTextBoxVal = inputValue;
    }

    setTimeout(() => {
      if (this.printView) {
        const tpm = new ThermalPrinterService('80mm');
        const styles = this.sheets.toString();
        tpm.setStyles(styles);
        tpm.addRawHtml(this.printView.nativeElement.innerHTML);
        tpm.print();
        this.thermalvisible = false;
      } else {
        console.error('printView is not defined');
      }
    }, 100);
  }

  getAddtionalItems(id: number) {

    this.invoiceService.getAddtionalInvoiceItemById(id).subscribe((res: any) => {
      this.addtionalInoiveItem = res;
      res.map((data: any) => {
        if (data.status == 'Unpaid') {
          this.isPaidButtonVisible = false;
          this.balanceAmount = this.balanceAmount + data.finalAmount;
        }
        else {
          this.tempDoctorModels.transactionId = res[0].transactionId ? res[0].transactionId : 'Cash Payment';

        }

        this.totalInvoiceAmount = this.totalInvoiceAmount + data.finalAmount;
      })
    })
  }


  paidsubInvoiceItem(data: any) {
    if (this.paymentMode == '') {
      alert('Please select payment mode first!');
      return;
    }

    if (this.paymentMode == 'Online') {
      if (this.RefNoInput.nativeElement.value == '') {
        alert('Please enter online payment reference number!');
        return;
      }

      this.paymentModeDetails.transactionId = this.RefNoInput.nativeElement.value;
    }
    else {
      this.paymentModeDetails.transactionId = null;
    }

    this.paymentModeDetails.paymentMode = this.paymentMode;
    this.paymentModeDetails.invoiceId = this.invoiceDetails.invoiceId;
    this.paymentModeDetails.amount = data.finalAmount;
    this.paymentModeDetails.itemName = data.itemName;
    this.paymentModeDetails.itemId = data.id.toString();


    this.invoiceService.getAddtionalSubInvoiceItemById(data.id).subscribe((result: any) => {
      result.status = 'Paid';
      if (result.status == 'Paid') {
        this.isAllowed = true;
      }
      else {
        this.isAllowed = false;
      }

      this.subInvoicePaymentDto.additionalInvoiceItem = result;
      this.subInvoicePaymentDto.paymentModeInfo = this.paymentModeDetails;

      this.invoiceService.updateSubInvoiceItem(data.id, this.subInvoicePaymentDto).subscribe(res => {
        this.toastr.success("Invoice Paid", 'Paid');
        this.balanceAmount = 0;
        this.totalInvoiceAmount = 0;
        this.getInvoiceDetails();
      })
    })

  }


  moveToEditInvoice(id: number) {
    this.invoiceService.invoiceId = id;
    this.route.navigate(['/invoice/edit-invoice'])

  }

  getLocalInvoiceDate(): string {
    if (this.invoiceDetails?.InvoiceDate) {
      // Prefer InvoiceDate if present
      return dayjs.utc(this.invoiceDetails.InvoiceDate).local().format('DD-MMMM-YYYY');
    }
    if (!this.invoiceDetails?.createdDate) return '';
    // Fallback to createdDate
    return dayjs.utc(this.invoiceDetails.createdDate).local().format('DD-MMMM-YYYY');
  }
}

class ThermalPrinterService {
  printContent: string = '';
  cssStyles = ``;

  constructor(private paperWidth: "80mm" | "58mm") { }


  addRawHtml(htmlEl: string) {
    this.printContent += `\n${htmlEl}`;
  }

  addLine(text: string) {
    this.addRawHtml(`<p>${text}</p>`);
  }

  addLineWithClassName(className: string, text: string) {
    this.addRawHtml(`<p class="${className}">${text}</p>`);
  }

  addEmptyLine() {
    this.addLine(`&nbsp;`);
  }

  addLineCenter(text: string) {
    this.addLineWithClassName("text-center", text);
  }
  setStyles(cssStyles: string) {
    this.cssStyles = cssStyles;
  }



  print() {

    const printerWindow = window.open(``, `_blank`);
    if (printerWindow) {
      printerWindow.document.write(`
        <!DOCTYPE html>
        <html>
        
        <head>
          <title>Print</title>
          <style>
            html { padding: 0; margin: 0; width: ${this.paperWidth}; }
            body { margin: 0; padding: 8px; }
            p { margin-top: 0.25rem; margin-bottom: 0.25rem; white-space: pre-wrap; }
            ${this.cssStyles}
          </style>
          <script>
            window.onafterprint = event => {
              window.close();
            };
          </script>
        </head>
    
        <body>
          ${this.printContent}
        </body>
        
        </html>
      `);
      printerWindow.document.close();
      printerWindow.focus();
      printerWindow.print();
    } else {
      console.error("Failed to open the print window. Please check your browser settings and try again.");
    }
  }
}

