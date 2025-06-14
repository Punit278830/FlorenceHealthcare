import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { combineLatest } from 'rxjs';
import { InvoiceService } from '../../../shared/Services/invoice/invoice.service';
import { LoadingService } from '../../../shared/Services/loader/loader.service';
import { PatientService } from '../../../shared/Services/patient/patient.service';
import { DataService } from '../../../shared/data/data.service';
import { pageSelection, apiResultFormat, invoices, Iinvoice, IpatientInfo, InvoiceInfoResponse } from '../../../shared/models/models';
import { routes } from '../../../shared/routes/routes';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ModalServiceService } from '../../../shared/modalService/modal-service.service';
import { ToastrService } from 'ngx-toastr';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to IST
dayjs.tz.setDefault('Asia/Kolkata');

interface data {
  value: string;
}
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  providers: [DatePipe]
  
  
})



export class InvoicesComponent implements OnInit {
  public routes = routes;
  public selectedValue !: string;
  public invoices: any[] = [];
    public loggedIn: any;

  dataSource!: MatTableDataSource<Iinvoice>;
  
  invoiceId: InvoiceInfoResponse[] = [];           // Full list from API
filteredInvoices: InvoiceInfoResponse[] = [];   // Filtered list for view

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 30;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  public img = "assets/img/profiles/avatar-08.jpg";
  public combinedData: any[] = [];
  selectedPaymentMode: string = 'All';
  selectedPaymentStatus: string = 'All';
  totalPaymentAmount: number = 0;
  public searchForm!: FormGroup;

  constructor(public data: DataService,
    private invoiceService: InvoiceService,
    private patientService: PatientService,
    private route: Router,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalservice: ModalServiceService,
    private toaster: ToastrService  ) {

  }
  ngOnInit() {
        this.loggedIn = JSON.parse(localStorage.getItem('data') || '')

    this.initSearchForm();  // Initialize the search form
    this.getTableData();
  }

  // Initialize the search form with From, To, Payment Status, and Payment Mode
  initSearchForm() {
    // Use dayjs to get today's date in IST
    const today = dayjs().tz('Asia/Kolkata');
    const formattedToday = today.format('YYYY-MM-DD');

    this.searchForm = this.fb.group({
      from: [formattedToday, Validators.required],
      to: [formattedToday, Validators.required],
      paymentStatus: ['All'],
      paymentMode: ['All']
    });
  }

  // Method to search invoices based on form data
  public searchInvoices(): void {
    // Call getTableData with filtered parameters
    this.getTableData();
  }

  // Private method to extract form data and return it
  private getFormData() {
    const formData = this.searchForm.value;
    const today = dayjs().tz('Asia/Kolkata');

    const fromDate: string = formData.from
      ? dayjs(formData.from).tz('Asia/Kolkata').format('YYYY-MM-DD')
      : today.format('YYYY-MM-DD');

    const toDate: string = formData.to
      ? dayjs(formData.to).tz('Asia/Kolkata').format('YYYY-MM-DD')
      : today.format('YYYY-MM-DD');

    const paymentMode: string = formData.paymentMode || 'All';
    const paymentStatus: string = formData.paymentStatus || 'All';

    return { paymentMode, paymentStatus, fromDate, toDate };
  }

  // Now you can call getFormData in getTableData directly
 public getTableData(): void {
  const { paymentMode, paymentStatus, fromDate, toDate } = this.getFormData();

  this.loadingService.showLoader();

  const invoicesSummary$ = this.invoiceService.getAllInvoice(paymentMode, paymentStatus, fromDate, toDate);
  const patients$ = this.patientService.getPatientList();

  
  combineLatest([invoicesSummary$, patients$]).subscribe(
    ([invoicesSummary, patients]: [{ invoices: Iinvoice[] }, IpatientInfo[]]) => {
      this.combinedData = invoicesSummary.invoices.map((invoice: Iinvoice) => {
        const patient = patients.find((p: IpatientInfo) => p.patientId === invoice.patientId);
        const paymentDetail = invoice.paymentDetails?.[0];

        // Convert dates to IST
        const createdDate = invoice.createdDate 
          ? dayjs(invoice.createdDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
          : null;
        
        const paymentTime = paymentDetail?.paymentDate
          ? dayjs(paymentDetail.paymentDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
          : null;

        return {
          ...invoice,
          patientFname: patient?.firstName ?? 'Unknown Patient',
          patientLname: patient?.lastName ?? 'Unknown Patient',
          paymentTime: paymentTime,
          createdDate: createdDate,
          appointmentId: invoice.appointmentId ?? 'N/A',
          amount: invoice.amount ?? 'N/A',
          totalUnpaidAmount: invoice.totalUnpaidAmount ?? 'N/A',
          status: invoice.status ?? 'N/A',
          paymentMode: invoice.paymentMode ?? 'N/A'
        };
      });

      this.loadingService.hideLoader();
    },
    (error) => {
      console.error('Error loading data:', error);
      this.loadingService.hideLoader();
    }
  );
 




forkJoin([invoicesSummary$, patients$]).subscribe(([invoicesSummary, patients]) => {
  // Set total amount based on payment mode
  if (paymentMode === "All") {
    this.totalPaymentAmount = invoicesSummary.totalAmount;
  } else if (paymentMode === "Cash") {
    this.totalPaymentAmount = invoicesSummary.totalCashAmount;
  } else if (paymentMode === "Online") {
    this.totalPaymentAmount = invoicesSummary.totalOnlineAmount;
  } else {
    this.totalPaymentAmount = 0;
  }

  // ✅ Process each invoice
  this.combinedData = invoicesSummary.invoices.map((invoice: Iinvoice) => {
    const patient = patients.find((p: IpatientInfo) => p.patientId === invoice.patientId);
const paymentDetail = invoice.paymentDetails[invoice.paymentDetails.length - 1];

    return {
      ...invoice,
      patientFname: patient?.firstName ?? 'Unknown Patient',
      patientLname: patient?.lastName ?? 'Unknown Patient',
      paymentTime: paymentDetail?.paymentDate ?? null   // ✅ Actual backend time
    };
  });
});

   // Initialize required arrays
      this.invoices = [];
      this.serialNumberArray = [];
  
      // Handle pagination and setting the invoices
      this.totalData = this.combinedData.length;
      this.combinedData.forEach((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.invoices.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
  
      this.dataSource = new MatTableDataSource<any>(this.invoices);
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.loadingService.hideLoader();
    };
  
  // Method to get payment modes for a specific invoice
  private getPaymentModesForInvoice(invoice: Iinvoice): string[] {
    // Mocking the logic to get payment modes for an invoice
    // This should reflect the actual logic of determining payment modes for the given invoice
    return ["cash", "online"]; // Example payment modes
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.invoices = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.invoices.slice();

    if (!sort.active || sort.direction === '') {
      this.invoices = data;
    } else {
      this.invoices = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }


  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  
  selectedList: data[] = [
    { value: 'Select Payment Status' },
    { value: 'All' },
    { value: 'Paid' },
    { value: 'Unpaid' },
    { value: 'Partially Paid' },
  ];

  paymentModeList: data[] = [
    { value: 'Select Payment Mode' },
    { value: 'All' },
    { value: 'Cash' },
    { value: 'Online' },
  ];

  movetoInvoiceView(Id: number, patienId: number) {
    this.invoiceService.invoiceId = Id;
    // this.invoiceService.sendInvoiceId(Id);
    this.patientService.patientId = patienId;

    
    this.route.navigate(['/accounts/invoice-view'])
  }

  moveToEditInvoice(id: number) {
    this.invoiceService.invoiceId = id;
    this.route.navigate(['/invoice/edit-invoice'])

  }
 deleteInvoice(idhere: number) {
    this.modalservice.openModal({
      type: 'invoice',
      id: idhere,
      confirmCallback: () => this.confirmDelete(idhere)
    });
  }

  confirmDelete(idhere: number) {
    this.invoiceService.deleteInvoice(idhere).subscribe(res => {
      if (res == null) {
        this.toaster.success("Staff is deleted!")
        this.getTableData();
      }
    })

  }


  onPaymentModeChange(event: any) {
    this.selectedPaymentMode = event.value;
    this.getTableData();
  }
  exportInvoiceList()
      {
        if (this.invoices.length > 0) 
          {
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.invoices);
          const workbook: XLSX.WorkBook = { Sheets: { 'Invoice': worksheet }, SheetNames: ['Invoice'] };
  
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
          // Call saveAsExcel
          this.saveAsExcelFile(excelBuffer, 'Invoice');
        }
  
      }
        
        private saveAsExcelFile(buffer: any, fileName: string): void 
        {
          // Use dayjs for date formatting
          const formattedDate = dayjs().tz('Asia/Kolkata').format('DD-MM-YYYY');
          const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
          FileSaver.saveAs(data, `${fileName}_export_${formattedDate}.xlsx`);
    }

    exportInvoiceListAsPdf() {
      this.loadingService.showLoader();
      const data = document.getElementById('convertToPdf');
      if (data) {
        html2canvas(data).then(canvas => {
          const imgWidth = 208;
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const contentDataURL = canvas.toDataURL('image/png');
          let pdf = new jsPDF('p', 'mm', 'a4');
          const position = 0;
  
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          // Use dayjs for date formatting
          const formattedDate = dayjs().tz('Asia/Kolkata').format('DD-MM-YYYY');
          pdf.save(`Invoice${formattedDate}.pdf`);        
        })
      }
  
      this.loadingService.hideLoader();
    }
  
  
  }
