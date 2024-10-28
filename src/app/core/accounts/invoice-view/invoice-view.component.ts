import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { InvoiceService } from 'src/app/shared/Services/invoice/invoice.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { Iappointment, Iinvoice, IpatientInfo, IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { DecimalPipe } from '@angular/common';
import { create, SheetsRegistry } from "jss";
import preset from "jss-preset-default";
import { IInvoicePaymentDto, IPaymentMode, ISubItemInvoicePaymentDto } from '../../../shared/models/models';
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
  public paymentModeDetails!: IPaymentMode;
  public invoicePaymentDto!: IInvoicePaymentDto;
  public subInvoicePaymentDto!: ISubItemInvoicePaymentDto;
  private invoiceId!: number;
  public patientDetails!: IpatientInfo;
  public appointmentDetails!: Iappointment;
  public doctorDetails!: IstaffInfo;
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
  tempInvoiceID: any;
  patientId: any;
  formatToTwoDecimalPlaces(value: number): string {
    return value.toFixed(2); // Converts to a string with 2 decimal places
  }
  public paymentMode!: string;
  public ReferenceTextBoxVal!: string;
  buttonColors = {
    Cash: 'lightgray',
    Online: 'lightgray'
  };
  isTextboxVisible = false;
  changeColor(button: string) {
    // Reset all buttons to default color
    this.buttonColors.Cash = 'lightgray';
    this.buttonColors.Online = 'lightgray';

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
  }


  toggleTextbox() {
    this.isTextboxVisible = !this.isTextboxVisible;
  }

  constructor(private invoiceService: InvoiceService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private staffService: StaffService,
    private toastr: ToastrService,
    private decimalPipe: DecimalPipe,

    private route: Router) {
    this.loggedIn = JSON.parse(localStorage.getItem('data') || '');
    this.paymentMode = '';
    this.ReferenceTextBoxVal = '';
    this.ConsultationPaidStatus = '';

    this.paymentModeDetails = {
      invoiceId: 0,
      paymentMode: '',
      transactionId: '',
      amount: 0
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

  getInvoiceDetails() {

    this.invoiceService.getInvoiceId().subscribe(data => {
      this.tempInvoiceID = data.data;
      console.log("invoiceId", this.tempInvoiceID);
  
    });
    

    if (this.tempInvoiceID == null || this.tempInvoiceID == undefined) {
      this.invoiceId = this.invoiceService.invoiceId;

      if (this.invoiceId == null) {
        this.route.navigate(['/accounts/invoices'])
      }
    }
    else{
      this.invoiceId = this.tempInvoiceID;

      if (!this.invoiceId) {
        this.route.navigate(['/accounts/invoices'])
      }
    }



    if (this.invoiceId > 0) {
      this.invoiceService.getInvoiceById(this.invoiceId).subscribe(res => {
        this.isPaidButtonVisible = res.status != 'Paid'
        this.isAllowed = res.status == 'Paid';

        this.invoiceDetails = res;
        console.log("invoice details", res)
        if (!res.isConsultationPaid && (res.status == 'Unpaid' || res.status == "Partially Paid")) {
          //this.isPaidButtonVisible=false;
          this.balanceAmount = this.balanceAmount + res.amount;
        }

        //this.totalInvoiceAmount += res.amount;
        this.decimalPipe.transform(this.totalInvoiceAmount += res.amount, '1.2-2') || '';
        this.getPatientDetails(res.patientId);
        this.getAddtionalItems(this.invoiceId);

        if (res.appointmentId > 0) {
          this.getAppointDetails(res.appointmentId);
        }
      });
    }
  }

  ngOnInit() {
    this.getInvoiceDetails();
    const jss = create(preset());
    this.sheets = new SheetsRegistry();
    const sheet = jss.createStyleSheet(styles);
    this.sheets.add(sheet);
    this.classes = sheet.attach().classes;
    this.width = '80mm';


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
      console.log("appoint", this.appointmentDetails)
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

    this.invoiceService.getPatientId().subscribe(data =>{
      console.log('data ', data);
      
      this.patientId = data;
    });
    
    // const patientId = this.patientService.patientId;
    console.log('patientId:', this.patientId); // Log the patientId

    if (!this.patientId) {
        console.error('Patient ID is undefined. Check patientService for correct initialization.');
        return; // Exit if patientId is undefined
    }

    this.appointmentService.getAppointmentListByPatientId(this.patientId.data, currentYear).subscribe(res => {
        this.appointmentList = res;
        this.checkLatestAppointmentWithin7Days();
    });
}


  checkLatestAppointmentWithin7Days() {
    if (this.appointmentList.length > 0) {
      // Sort the appointments by date in descending order
      this.appointmentList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      let SelDoctor: Number | null = 0;
      const selectedAppointmentDate = new Date(this.appointmentDetails.date);
      SelDoctor = this.appointmentDetails.doctorId;
      let previousAppointmentDate: Date | null = null;
      let previousDoctor: Number | null = 0;

      for (let appointment of this.appointmentList) {

        const appointmentDate = new Date(appointment.date);
        if (appointmentDate < selectedAppointmentDate) {
          previousAppointmentDate = appointmentDate;
          previousDoctor = appointment.doctorId;
          break;
        }

      }

      if (previousAppointmentDate) {
        const differenceInTime = selectedAppointmentDate.getTime() - previousAppointmentDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        console.log("Selected Appointment Date:", selectedAppointmentDate);
        console.log("Previous Appointment Date:", previousAppointmentDate);
        console.log("Difference in Days:", differenceInDays);

        // Check if the difference between the selected and previous appointment is within 7 days
        this.flag = differenceInDays <= 7 && differenceInDays >= 0;

        if (previousDoctor == SelDoctor) {
          this.IsDoctorSameflag = true;
        }
        else {
          this.IsDoctorSameflag = false;
        }
      } else {
        console.warn("No appointment found before the selected appointment date.");
        this.flag = false;
      }
    } else {
      this.flag = false;
    }

    if (this.flag) {

      if (this.IsDoctorSameflag == false) {
        this.flag = false;
        this.totalInvoiceAmount = this.totalInvoiceAmount;
        this.disc = 0;
      }
      if (this.IsDoctorSameflag == true) {
        this.flag = true;
        this.totalInvoiceAmount = this.totalInvoiceAmount - this.invoiceDetails.amount;
        this.disc = 100;
      }

    }


    console.log("Flag:", this.flag);
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

    this.paymentModeDetails.paymentMode = this.paymentMode;
    this.paymentModeDetails.invoiceId = this.invoiceDetails.invoiceId;
    this.paymentModeDetails.amount = invoiceDetails.amount;

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

    if (this.paymentMode == '') {
      alert('Please select payment mode first!');
      return;
    }
    this.thermalvisible = true;
    var dateToday = new Date();
    this.Timenow = `${dateToday.getHours()}:${dateToday.getMinutes() < 10 ? '0' : ''}${dateToday.getMinutes()}`;

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
        //console.log(this.printView.nativeElement.innerHTML);
        //console.log(styles);
        tpm.setStyles(styles);
        tpm.addRawHtml(this.printView.nativeElement.innerHTML);
        tpm.print();

        this.thermalvisible = false;
      } else {
        console.error('printView is not defined');
      }
    }, 0);
  }

  getAddtionalItems(id: number) {
   
    
    this.invoiceService.getInvoiceById(id).subscribe((res: any) => {
      this.addtionalInoiveItem = res;
      res.map((data: any) => {
        if (data.status == 'Unpaid') {
          this.isPaidButtonVisible = false;
          this.balanceAmount = this.balanceAmount + data.finalAmount;
        }

        this.totalInvoiceAmount = this.totalInvoiceAmount + data.finalAmount;
      })
      console.log("addi", this.addtionalInoiveItem);
      console.log("appo", this.appointmentDetails);
      console.log("doc", this.doctorDetails);


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
    // mywindow.close();
  }

}

