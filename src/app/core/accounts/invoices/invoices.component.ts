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
  public searchInvoices(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    console.log('Search button clicked - searchInvoices method called');
    console.log('Form valid:', this.searchForm.valid);
    console.log('Form value:', this.searchForm.value);
    console.log('Form errors:', this.searchForm.errors);
    
    // Temporarily remove form validation to test
    // if (!this.searchForm.valid) {
    //   console.log('Form is invalid, marking all fields as touched');
    //   this.searchForm.markAllAsTouched();
    //   return;
    // }
    
    // Call getTableData with filtered parameters
    this.getFormData();
    console.log('Search criteria after getFormData:', this.searchCriteria);
    this.getTableData();
  }

  // Private method to extract form data and return it
  private getFormData() {
    const formData = this.searchForm.value;
    const today = dayjs(); // no timezone adjustment
    this.searchCriteria.fromDate = formData.from ? dayjs(formData.from).format('YYYY-MM-DD') : today.format('YYYY-MM-DD');
    this.searchCriteria.toDate = formData.to ? dayjs(formData.to).format('YYYY-MM-DD') : today.format('YYYY-MM-DD');
    this.searchCriteria.paymentMode = Number(formData.paymentMode ?? 0);
    this.searchCriteria.paymentStatus = Number(formData.paymentStatus ?? 0);
    // Update the selected values used in calculation
    this.selectedPaymentMode = formData.paymentMode || 'All';
    this.selectedPaymentStatus = formData.paymentStatus || 'All';
  }

  // Utility: Get invoice generated time in IST for display
  // public getInvoiceGeneratedTime(invoice: any): string {
  //   // Prefer InvoiceDate, fallback to createdDate
  //   let dateStr = invoice?.InvoiceDate || invoice?.createdDate;
  //   if (!dateStr) return '';
  //   // Use dayjs.tz to ensure IST time
  //   return dayjs.tz(dateStr, 'Asia/Kolkata').format('HH:mm');
  // }

  // Now you can call getFormData in getTableData directly
 public getTableData(): void {
  console.log('getTableData called with search criteria:', this.searchCriteria);
  this.loadingService.showLoader();
  
  console.log('Making API call to searchInvoices...');
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
    this.searchCriteria.pageSize = this.pageSize; // Ensure API receives new page size
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
          const formattedDate = dayjs().format('DD-MM-YYYY');
          const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
          FileSaver.saveAs(data, `${fileName}_export_${formattedDate}.xlsx`);
    }

    exportInvoiceListAsPdf() {
      this.loadingService.showLoader();
      
      // Calculate totals for the PDF
      let totalPaidAmount = 0;
      let totalUnpaidAmount = 0;
      let totalDayAmount = 0;
      
      this.invoices.forEach((invoice: any) => {
        const amount = Number(invoice.amount) || 0;
        totalDayAmount += amount;
        
        if (invoice.status) {
          if (invoice.status.toLowerCase() === 'paid') {
            totalPaidAmount += amount;
          } else if (invoice.status.toLowerCase() === 'unpaid') {
            totalUnpaidAmount += amount;
          }
        }
      });
      
      // Prepare data for PDF export
      const exportRows = this.invoices.map((invoice: any, idx: number) => {
        // Invoice #
        const invoiceNumber = invoice.invoiceNumber || invoice.invoiceId || '';
        // Patient Name - try multiple possible fields
        const patientName = invoice.patientName || 
                           (invoice.patientInfo && invoice.patientInfo.name) || 
                           (invoice.patientInfo && invoice.patientInfo.patientName) ||
                           invoice.patient?.name ||
                           invoice.patient?.patientName ||
                           'N/A';
        // Payment Status
        const paymentStatus = invoice.status || '';
        // Amount & Status (combine)
        let amountStatus = '';
        if (Array.isArray(invoice.paymentDetails) && invoice.paymentDetails.length > 0) {
          amountStatus = invoice.paymentDetails.map((pd: any) => {
            return `₹${pd.amount || ''} (${pd.status || paymentStatus})`;
          }).join(', ');
        } else {
          amountStatus = `₹${invoice.amount || ''} (${paymentStatus})`;
        }
        // Payment Mode (with reference # if present)
        let paymentMode = '';
        if (Array.isArray(invoice.paymentDetails) && invoice.paymentDetails.length > 0) {
          paymentMode = invoice.paymentDetails.map((pd: any) => {
            let mode = pd.paymentMode || '';
            if (pd.referenceNumber) {
              mode += ` (Ref: ${pd.referenceNumber})`;
            }
            return mode;
          }).join(', ');
        } else {
          paymentMode = invoice.paymentMode || '';
        }
        // Payment Date (date only)
        let paymentDate = '';
        if (Array.isArray(invoice.paymentDetails) && invoice.paymentDetails.length > 0) {
          paymentDate = invoice.paymentDetails.map((pd: any) => {
            if (pd.paymentDate) {
              return pd.paymentDate.split('T')[0];
            }
            return '';
          }).join(', ');
        } else if (invoice.paymentDate) {
          paymentDate = invoice.paymentDate.split('T')[0];
        }
        return {
          invoiceNumber,
          patientName,
          paymentStatus,
          amountStatus,
          paymentMode,
          paymentDate
        };
      });

      // PDF setup
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // revert to original margin
      let y = 20;
      const lineHeight = 6;
      const formattedDate = dayjs().format('DD-MM-YYYY');
      const fromDate = dayjs(this.searchCriteria.fromDate).format('DD-MM-YYYY');
      const toDate = dayjs(this.searchCriteria.toDate).format('DD-MM-YYYY');

      // Header - Title with blue background
      pdf.setFillColor(63, 81, 181); // Material blue
      pdf.rect(0, 0, pageWidth, 35, 'F');
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Invoice Report', pageWidth / 2, 15, { align: 'center' });
      
      // Date Range in header
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date Range: ${fromDate} to ${toDate}`, pageWidth / 2, 25, { align: 'center' });
      
      // Export Date in header
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${formattedDate}`, pageWidth / 2, 32, { align: 'center' });
      
      y = 45;
      pdf.setTextColor(0, 0, 0); // Reset to black

      // Summary Section with background
      pdf.setFillColor(247, 250, 251); // Light gray background
      pdf.rect(margin, y - 5, pageWidth - (margin * 2), 35, 'F');
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(33, 37, 41); // Dark text
      pdf.text('Summary:', margin + 14, y + 5);
      y += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      // First row: Total Paid and Total Unpaid
      pdf.setTextColor(40, 167, 69); // Green
      pdf.text(`Total Paid: Rs ${totalPaidAmount.toFixed(2)}`, margin + 20, y);
      pdf.setTextColor(220, 53, 69); // Red
      pdf.text(`Total Unpaid: Rs ${totalUnpaidAmount.toFixed(2)}`, pageWidth - margin - 70, y);
      y += 8;
      // Second row: Total Amount and Invoice Count
      pdf.setTextColor(0, 123, 255); // Blue
      pdf.text(`Total Amount: Rs ${totalDayAmount.toFixed(2)}`, margin + 20, y);
      pdf.setTextColor(33, 37, 41); // Dark
      pdf.text(`Total Invoices: ${this.invoices.length}`, pageWidth - margin - 70, y);
      y += 20;

      // Table Headers
      const colHeaders = [
        'Invoice #',
        'Patient Name',
        'Status',
        'Amount & Status',
        'Payment Mode',
        'Payment Date'
      ];
      // Balanced column widths for A4
      const colWidths = [28, 50, 28, 50, 50, 28];
      const totalTableWidth = colWidths.reduce((sum, width) => sum + width, 0);
      const startX = margin;
      let xPos = startX;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFillColor(52, 58, 64); // Dark gray
      pdf.rect(startX, y - 4, totalTableWidth, 10, 'F');
      colHeaders.forEach((header, i) => {
        pdf.text(header, xPos + 2, y + 2, { maxWidth: colWidths[i] - 4 });
        xPos += colWidths[i];
      });
      y += 12;
      // Table rows with alternating colors
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      exportRows.forEach((row: any, idx: number) => {
        if (y + 10 > pageHeight - 25) {
          pdf.addPage();
          y = 20;
          // Redraw headers on new page
          xPos = startX;
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor(255, 255, 255);
          pdf.setFillColor(52, 58, 64);
          pdf.rect(startX, y - 4, totalTableWidth, 10, 'F');
          colHeaders.forEach((header, i) => {
            pdf.text(header, xPos + 2, y + 2, { maxWidth: colWidths[i] - 4 });
            xPos += colWidths[i];
          });
          y += 12;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
        }
        if (idx % 2 === 0) {
          pdf.setFillColor(249, 249, 249); // Very light gray
          pdf.rect(startX, y - 2, totalTableWidth, 8, 'F');
        }
        xPos = startX;
        const rowData = [
          row.invoiceNumber,
          row.patientName,
          row.paymentStatus,
          row.amountStatus.replace('₹', 'Rs'), // Always use Rs
          row.paymentMode,
          row.paymentDate
        ];
        rowData.forEach((cell, i) => {
          let cellText = String(cell || '');
          if (i === 2) { // Status column
            const status = cellText.toLowerCase();
            if (status === 'paid') {
              pdf.setTextColor(40, 167, 69); // Green
            } else if (status === 'unpaid') {
              pdf.setTextColor(220, 53, 69); // Red
            } else if (status.includes('partial')) {
              pdf.setTextColor(255, 193, 7); // Yellow/Orange
            } else {
              pdf.setTextColor(33, 37, 41); // Default dark
            }
          } else {
            pdf.setTextColor(33, 37, 41); // Default dark
          }
          const maxWidth = colWidths[i] - 4;
          if (cellText.length > 0) {
            const lines = pdf.splitTextToSize(cellText, maxWidth);
            if (lines.length > 0) {
              pdf.text(lines[0], xPos + 2, y + 2);
            }
          }
          xPos += colWidths[i];
        });
        y += 8;
      });
      // Footer with page numbers
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(108, 117, 125); // Gray text
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text('Generated by Florence Healthcare System', pageWidth / 2, pageHeight - 5, { align: 'center' });
      }
      pdf.save(`Invoice_Report_${fromDate}_to_${toDate}.pdf`);
      this.loadingService.hideLoader();
    }
getTotalInvoiceAmount(): number {
  return this.invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
}

getTotalPaidAmount(): number {
  return this.invoices.reduce((sum, inv) => {
    const amount = Number(inv.amount) || 0;
    let paid: number;

    // Prefer API-provided totalUnpaidAmount if present
    if (inv.totalUnpaidAmount !== undefined && inv.totalUnpaidAmount !== null) {
      const unpaid = Number(inv.totalUnpaidAmount) || 0;
      paid = Math.max(0, amount - unpaid);
    } else if (Array.isArray(inv.paymentDetails) && inv.paymentDetails.length > 0) {
      // Fallback: sum paymentDetails amounts
      paid = inv.paymentDetails.reduce((acc: number, pd: any) => acc + (Number(pd?.amount) || 0), 0);
    } else if (typeof inv.status === 'string' && inv.status.toLowerCase() === 'paid') {
      // If status says Paid and no details
      paid = amount;
    } else {
      paid = 0;
    }

    return sum + (isNaN(paid) ? 0 : paid);
  }, 0);
}

getTotalUnpaidAmount(): number {
  return this.invoices.reduce((sum, inv) => {
    const amount = Number(inv.amount) || 0;
    let unpaid: number;

    // Prefer API-provided totalUnpaidAmount if present
    if (inv.totalUnpaidAmount !== undefined && inv.totalUnpaidAmount !== null) {
      unpaid = Number(inv.totalUnpaidAmount) || 0;
    } else if (Array.isArray(inv.paymentDetails) && inv.paymentDetails.length > 0) {
      // Fallback: amount minus paid
      const paid = inv.paymentDetails.reduce((acc: number, pd: any) => acc + (Number(pd?.amount) || 0), 0);
      unpaid = Math.max(0, amount - paid);
    } else if (typeof inv.status === 'string' && inv.status.toLowerCase() === 'unpaid') {
      unpaid = amount;
    } else {
      unpaid = 0;
    }

    return sum + (isNaN(unpaid) ? 0 : unpaid);
  }, 0);
}

// Helper method to safely format any date field
  public formatDate(dateValue: any, format: string = 'dd-MM-yyyy'): string {
    if (!dateValue || dateValue === 'null' || dateValue === null || dateValue === undefined) {
      return 'N/A';
    }
    
    try {
      // Handle different date formats
      let dateToFormat = dateValue;
      
      // If it's already a Date object
      if (dateValue instanceof Date) {
        dateToFormat = dateValue;
      }
      // If it's a string that needs timezone
      else if (typeof dateValue === 'string' && !dateValue.includes('Z') && !dateValue.includes('+')) {
        dateToFormat = dateValue + 'Z';
      }
      
      const formatted = this.datePipe.transform(dateToFormat, format, 'Asia/Kolkata');
      return formatted || 'Invalid Date';
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', dateValue);
      return 'Invalid Date';
    }
  }

  formatPaymentDate(paymentDetails: any[]): string {
    if (!paymentDetails || paymentDetails.length === 0) {
      return 'N/A';
    }

    // Find the most recent payment date
    const validDates = paymentDetails
      .map(payment => payment?.paymentDate)
      .filter(date => {
        // Filter out null, undefined, empty strings, and problematic values
        if (!date || date === null || date === undefined || date === '' || 
            date === 'null' || date === 'nullZ' || date === 'undefined') {
          return false;
        }
        // Additional check for invalid date strings
        if (typeof date === 'string' && (date.toLowerCase().includes('null') || date.toLowerCase().includes('undefined'))) {
          return false;
        }
        return true;
      })
      .map(date => {
        try {
          const parsedDate = new Date(date);
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        } catch {
          return null;
        }
      })
      .filter(date => date !== null) as Date[];

    if (validDates.length === 0) {
      return 'N/A';
    }

    // Get the most recent date
    const latestDate = new Date(Math.max(...validDates.map(d => d.getTime())));
    
    try {
      const formatted = this.formatDate(latestDate, 'dd/MM/yyyy HH:mm');
      return formatted || 'N/A';
    } catch (error) {
      console.error('Error formatting payment date:', error);
      return 'N/A';
    }
  }
}