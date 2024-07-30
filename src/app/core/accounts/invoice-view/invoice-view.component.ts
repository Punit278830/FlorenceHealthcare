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

import { create, SheetsRegistry } from "jss";
import preset from "jss-preset-default";

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
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit {
  @ViewChild('printview', { static: false }) printView!: ElementRef;
  public routes = routes;
  private sheets!: SheetsRegistry;
  public invoiceDetails!: Iinvoice;
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
  public classes: any;
  public width!: string;
  public thermalvisible: boolean = false;
  public disc: number = 0;
  public loggedIn!: any;
  public Timenow!: string;

  constructor(private invoiceService: InvoiceService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private staffService: StaffService,
    private toastr: ToastrService,
    private route: Router) {
    this.loggedIn = JSON.parse(localStorage.getItem('data') || '');
    console.log("invoiceId", this.invoiceService.invoiceId);
    if (!this.invoiceService.invoiceId) {
      this.route.navigate(['/accounts/invoices'])
    }

  }

  getInvoiceDetails() {

    this.invoiceId = this.invoiceService.invoiceId;
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe(res => {
      if (res.status == 'Paid') {
        this.isPaidButtonVisible = false;
      }
      else {
        this.isPaidButtonVisible = true;
      }
      this.invoiceDetails = res;
      console.log("invoice details", res)
      if (res.status == 'un Paid') {
        //this.isPaidButtonVisible=false;
        this.balanceAmount = this.balanceAmount + res.amount;
      }
      this.totalInvoiceAmount += res.amount;

      this.getPatientDetails(res.patientId);
      this.getAppointDetails(res.appoitmentId);
      this.getAddtionalItems(this.invoiceId)




    })



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

    this.appointmentService.getAppointmentListByPatientId(this.patientService.patientId, currentYear).subscribe(res => {
      this.appointmentList = res;

      // Find the latest appointment and check if it is within the last 7 days
      this.checkLatestAppointmentWithin7Days();
    });
  }

  checkLatestAppointmentWithin7Days() {
    if (this.appointmentList.length > 0) {
      // Sort the appointments by date in descending order
      this.appointmentList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const selectedAppointmentDate = new Date(this.appointmentDetails.date);
      let previousAppointmentDate: Date | null = null;

      for (let appointment of this.appointmentList) {
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate < selectedAppointmentDate) {
          previousAppointmentDate = appointmentDate;
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
      } else {
        console.warn("No appointment found before the selected appointment date.");
        this.flag = false;
      }
    } else {
      this.flag = false;
    }

    if (this.flag) {
      this.totalInvoiceAmount = this.totalInvoiceAmount - this.invoiceDetails.amount;
      this.disc = 100;
    }
    console.log("Flag:", this.flag);
  }





  paidinvoice(id: number) {
    this.invoiceDetails.status = 'Paid';
    this.invoiceService.updateInvoice(id, this.invoiceDetails).subscribe(res => {
      if (res) {
        this.getInvoiceDetails();
        this.balanceAmount = 0;
        this.toastr.success("Invoice Paid Successfully", "Update Invoice");

      }
    })

  }

  print() {
    this.thermalvisible = true;
    var dateToday = new Date();
    this.Timenow = `${dateToday.getHours()} ${dateToday.getMinutes()}`;

    setTimeout(() => {
      if (this.printView) {
        const tpm = new ThermalPrinterService('80mm');
        const styles = this.sheets.toString();
        console.log(this.printView.nativeElement.innerHTML);
        console.log(styles);
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

    this.invoiceService.getAddtionalInvoiceItemById(id).subscribe((res: any) => {

      this.addtionalInoiveItem = res;
      res.map((data: any) => {
        if (data.status == 'un Paid') {
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


  paidsubInvoiceItem(id: number) {
    this.invoiceService.getAddtionalSubInvoiceItemById(id).subscribe((result: any) => {
      result.status = 'Paid';
      this.invoiceService.updateSubInvoiceItem(id, result).subscribe(res => {
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

