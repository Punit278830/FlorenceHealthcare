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

    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10);
    
    // Initialize search criteria with today's date
    this.searchCriteria = {
      fromDate: formattedToday,
      toDate: formattedToday,
      paymentMode: PaymentMode.All,
      paymentStatus: PaymentStatus.All,
      pageNumber: 1,
      pageSize: 100,
      sortFieldName: 'InvoiceId',
      sortDirection: 1
    };
    
    // Initialize form
    this.initSearchForm();
    
    // Set form values and component state
    this.searchForm.patchValue({ 
      from: formattedToday, 
      to: formattedToday, 
      paymentStatus: 'All', 
      paymentMode: 'All' 
    });
    
    this.selectedPaymentStatus = 'All';
    this.selectedPaymentMode = 'All';
    
    console.log('Initialized with date:', formattedToday);
    console.log('Form values:', this.searchForm.value);
    
    // Sync form data with search criteria and selected values before calling search
    this.getFormData();
    
    // Call search to load initial data and calculate total
    this.searchInvoices();
  }

  // Initialize the search form with From, To, Payment Status, and Payment Mode
  initSearchForm() {
    // Use user's local timezone date
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10);
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
    // Update the selected values used in calculation
    this.selectedPaymentMode = formData.paymentMode || 'All';
    this.selectedPaymentStatus = formData.paymentStatus || 'All';
  }

  // Now you can call getFormData in getTableData directly
 public getTableData(): void {
  console.log('getTableData called with search criteria:', this.searchCriteria);
  this.loadingService.showLoader();
  this.invoiceService.searchInvoices(this.searchCriteria).subscribe(
    (response) => {
      console.log('API response received:', response);
      this.searchResponse = response;
      this.invoices = response?.results ?? [];
      console.log('Number of invoices loaded:', this.invoices.length);
      
      // Calculate total payment amount for the selected date range, payment mode, and payment status using paymentDate
      this.calculateTotalPaymentAmount();
      
      // Serial number calculation: S.No. should be 1-100 on page 1, 101-200 on page 2, etc.
      const startSerial = ((this.searchCriteria.pageNumber ?? 1) - 1) * (this.searchCriteria.pageSize ?? 100) + 1;
      this.serialNumberArray = this.invoices.map((_, idx) => startSerial + idx);
      this.totalData = response?.totalCount ?? 0;
      this.calculateTotalPages(this.totalData, this.searchCriteria.pageSize ?? 100);
      this.dataSource = new MatTableDataSource<any>(this.invoices);
      this.loadingService.hideLoader();

      // If no data after filter, fallback to last 30 days
      if (this.invoices.length === 0 && this.searchCriteria.fromDate && this.searchCriteria.toDate) {
        console.log('No data found, trying fallback date range');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const formattedYesterday = yesterday.toISOString().slice(0, 10);
        const formattedToday = today.toISOString().slice(0, 10);
        this.searchCriteria.fromDate = formattedYesterday;
        this.searchCriteria.toDate = formattedToday;
        this.searchForm.patchValue({ from: formattedYesterday, to: formattedToday });
        this.invoiceService.searchInvoices(this.searchCriteria).subscribe((fallbackResponse) => {
          console.log('Fallback API response:', fallbackResponse);
          this.searchResponse = fallbackResponse;
          this.invoices = fallbackResponse?.results ?? [];
          console.log('Fallback: Number of invoices loaded:', this.invoices.length);
          this.calculateTotalPaymentAmount();
          const startSerial = ((this.searchCriteria.pageNumber ?? 1) - 1) * (this.searchCriteria.pageSize ?? 100) + 1;
          this.serialNumberArray = this.invoices.map((_, idx) => startSerial + idx);
          this.totalData = fallbackResponse?.totalCount ?? 0;
          this.calculateTotalPages(this.totalData, this.searchCriteria.pageSize ?? 100);
          this.dataSource = new MatTableDataSource<any>(this.invoices);
        });
      }
    },
    (error) => {
      console.error('Error loading invoice data:', error);
      this.loadingService.hideLoader();
    }
  );
}

private calculateTotalPaymentAmount(): void {
    const fromDate: string = this.searchCriteria.fromDate || '';
    const toDate: string = this.searchCriteria.toDate || '';
    const selectedMode: string = this.selectedPaymentMode;
    const selectedStatus: string = this.selectedPaymentStatus;
    let total = 0;
    
    console.log('Calculating total with filters:', { fromDate, toDate, selectedMode, selectedStatus });
    console.log('Number of invoices:', this.invoices.length);
    
    this.invoices.forEach((invoice: any) => {
      if (Array.isArray(invoice.paymentDetails)) {
        invoice.paymentDetails.forEach((pd: any) => {
          if (!pd || !pd.paymentDate) return;
          
          // Extract date from payment date (handle both date string and datetime string)
          const paymentDate = pd.paymentDate.includes('T') ? pd.paymentDate.split('T')[0] : pd.paymentDate;
          
          // Check date range
          const isDateMatch = paymentDate >= fromDate && paymentDate <= toDate;
          
          // Check payment mode - be more flexible with matching
          const isModeMatch = selectedMode === 'All' || 
            (pd.paymentMode && (
              pd.paymentMode.toLowerCase() === selectedMode.toLowerCase() ||
              (selectedMode === 'Cash' && pd.paymentMode.toLowerCase() === 'cash') ||
              (selectedMode === 'Online' && pd.paymentMode.toLowerCase() === 'online')
            ));
          
          // Check payment status - compare with invoice status
          const isStatusMatch = selectedStatus === 'All' || 
            (invoice.status && (
              invoice.status.toLowerCase() === selectedStatus.toLowerCase() ||
              (selectedStatus === 'Paid' && invoice.status.toLowerCase() === 'paid') ||
              (selectedStatus === 'Unpaid' && invoice.status.toLowerCase() === 'unpaid') ||
              (selectedStatus === 'Partially Paid' && (invoice.status.toLowerCase() === 'partially paid' || invoice.status.toLowerCase() === 'partial'))
            ));
          
          console.log('Payment detail check:', {
            paymentDate,
            isDateMatch,
            isModeMatch,
            isStatusMatch,
            amount: pd.amount,
            paymentMode: pd.paymentMode,
            invoiceStatus: invoice.status
          });
          
          if (isDateMatch && isModeMatch && isStatusMatch) {
            total += Number(pd.amount) || 0;
          }
        });
      }
    });
    
    console.log('Calculated total payment amount:', total);
    this.totalPaymentAmount = total;
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
