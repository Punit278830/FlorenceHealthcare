import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { InvoiceService } from '../../../shared/Services/invoice/invoice.service';
import { LoadingService } from '../../../shared/Services/loader/loader.service';
import { PatientService } from '../../../shared/Services/patient/patient.service';
import { DataService } from '../../../shared/data/data.service';
import { pageSelection, apiResultFormat, invoices, Iinvoice, IpatientInfo, InvoiceInfoResponse, IInvoiceSummaryResponse, SearchCriteriaBase, SearchResponseBase, InvoiceSearch, PaymentStatus, PaymentMode } from '../../../shared/models/models';
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
  public pageSize = 100;
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

  public searchCriteria: InvoiceSearch = {
    sortFieldName: 'InvoiceId',
    sortDirection: 1, // Descending
    pageNumber: 1,
    pageSize: 100,
    fromDate: '',
    toDate: '',
    paymentStatus: PaymentStatus.All,
    paymentMode: PaymentMode.All
  };

  public searchResponse: SearchResponseBase<Iinvoice> = {
    results: [],
    totalCount: 0,
    totalPages: 0
  };


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
    this.loggedIn = JSON.parse(localStorage.getItem('data') || '');

    // Set default date range to last 30 days in IST
    const today = dayjs().tz('Asia/Kolkata');
    const fromDate = today.subtract(30, 'day').format('YYYY-MM-DD');
    const toDate = today.format('YYYY-MM-DD');
    this.searchCriteria = {
      fromDate: fromDate,
      toDate: toDate,
      paymentMode: PaymentMode.All,
      paymentStatus: PaymentStatus.All,
      pageNumber: 1,
      pageSize: 100,
      sortFieldName: 'InvoiceId',
      sortDirection: 1
    };
    this.initSearchForm();
    this.searchForm.patchValue({ from: fromDate, to: toDate });
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
    this.getFormData();
    this.getTableData();
  }

  // Private method to extract form data and return it
  private getFormData() {
    const formData = this.searchForm.value;
    const today = dayjs().tz('Asia/Kolkata');
    this.searchCriteria.fromDate = formData.from ? dayjs(formData.from).tz('Asia/Kolkata').format('YYYY-MM-DD') : today.format('YYYY-MM-DD');
    this.searchCriteria.toDate = formData.to ? dayjs(formData.to).tz('Asia/Kolkata').format('YYYY-MM-DD') : today.format('YYYY-MM-DD');
    this.searchCriteria.paymentMode = Number(formData.paymentMode ?? 0);
    this.searchCriteria.paymentStatus = Number(formData.paymentStatus ?? 0);
  }

  // Now you can call getFormData in getTableData directly
 public getTableData(): void {
  this.loadingService.showLoader();
  this.invoiceService.searchInvoices(this.searchCriteria).subscribe(
    (response) => {
      this.searchResponse = response;
      this.invoices = response?.results ?? [];
      // Serial number calculation: S.No. should be 1-100 on page 1, 101-200 on page 2, etc.
      const startSerial = ((this.searchCriteria.pageNumber ?? 1) - 1) * (this.searchCriteria.pageSize ?? 100) + 1;
      this.serialNumberArray = this.invoices.map((_, idx) => startSerial + idx);
      this.totalData = response?.totalCount ?? 0;
      this.calculateTotalPages(this.totalData, this.searchCriteria.pageSize ?? 100);
      this.dataSource = new MatTableDataSource<any>(this.invoices);
      this.loadingService.hideLoader();

      // If no data after filter, fallback to last 30 days
      if (this.invoices.length === 0 && this.searchCriteria.fromDate && this.searchCriteria.toDate) {
        const today = dayjs().tz('Asia/Kolkata');
        const fromDate = today.subtract(30, 'day').format('YYYY-MM-DD');
        const toDate = today.format('YYYY-MM-DD');
        this.searchCriteria.fromDate = fromDate;
        this.searchCriteria.toDate = toDate;
        this.searchForm.patchValue({ from: fromDate, to: toDate });
        this.invoiceService.searchInvoices(this.searchCriteria).subscribe((fallbackResponse) => {
          this.searchResponse = fallbackResponse;
          this.invoices = fallbackResponse?.results ?? [];
          const startSerial = ((this.searchCriteria.pageNumber ?? 1) - 1) * (this.searchCriteria.pageSize ?? 100) + 1;
          this.serialNumberArray = this.invoices.map((_, idx) => startSerial + idx);
          this.totalData = fallbackResponse?.totalCount ?? 0;
          this.calculateTotalPages(this.totalData, this.searchCriteria.pageSize ?? 100);
          this.dataSource = new MatTableDataSource<any>(this.invoices);
        });
      }
    },
    (error) => {
      this.loadingService.hideLoader();
    }
  );
}

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
    if (event == 'next' && (this.searchCriteria.pageNumber ?? 1) < (this.searchResponse.totalPages ?? 1)) {
      this.searchCriteria.pageNumber = (this.searchCriteria.pageNumber ?? 1) + 1;
      this.getTableData();
    } else if (event == 'previous' && (this.searchCriteria.pageNumber ?? 1) > 1) {
      this.searchCriteria.pageNumber = (this.searchCriteria.pageNumber ?? 1) - 1;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.searchCriteria.pageNumber = pageNumber;
    this.getTableData();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  // Update calculateTotalPages to use new pageSize
  public calculateTotalPages(totalData: number, pageSize: number): void {
    this.totalPages = Math.ceil(totalData / pageSize);
    this.pageNumberArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.pageSelection = this.pageNumberArray.map(page => ({
      skip: (page - 1) * pageSize,
      limit: page * pageSize
    }));
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
        this.toaster.success("Invoice is deleted!")
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
      const rowsPerPage = 25;
      const totalRows = this.invoices.length;
      const totalPages = Math.ceil(totalRows / rowsPerPage);
      let pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 208;
      const pageHeight = 295;
      let formattedDate = dayjs().tz('Asia/Kolkata').format('DD-MM-YYYY');
      const allRows = Array.from(data.querySelectorAll('tbody tr'));

      // Helper to render one page
      const renderPage = async (page: number) => {
        // Hide all rows except the current page
        allRows.forEach((row, idx) => {
          (row as HTMLElement).style.display = (idx >= page * rowsPerPage && idx < (page + 1) * rowsPerPage) ? '' : 'none';
        });
        // Wait for html2canvas to render
        const canvas = await html2canvas(data);
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        if (page > 0) pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        // Add page number at the bottom
        pdf.setFontSize(10);
        pdf.text(`Page ${page + 1} of ${totalPages}`, imgWidth / 2, pageHeight - 10, { align: 'center' });
      };

      // Sequentially render all pages
      (async () => {
        for (let page = 0; page < totalPages; page++) {
          // eslint-disable-next-line no-await-in-loop
          await renderPage(page);
        }
        // Restore all rows after export
        allRows.forEach(row => (row as HTMLElement).style.display = '');
        pdf.save(`Invoice${formattedDate}.pdf`);
        this.loadingService.hideLoader();
      })();
    } else {
      this.loadingService.hideLoader();
    }
  }
  
  
  }
