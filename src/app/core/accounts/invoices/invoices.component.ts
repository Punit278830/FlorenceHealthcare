import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InvoiceService } from 'src/app/shared/Services/invoice/invoice.service';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { DataService } from 'src/app/shared/data/data.service';
import { pageSelection, apiResultFormat, invoices, Iinvoice, IpatientInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

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
  dataSource!: MatTableDataSource<Iinvoice>;

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
    private datePipe: DatePipe
  ) {

  }
  ngOnInit() {
    this.initSearchForm();  // Initialize the search form
    this.getTableData();
  }

  // Initialize the search form with From, To, Payment Status, and Payment Mode
  initSearchForm() {
    const today = new Date();
    const formattedToday = this.datePipe.transform(today, 'yyyy-MM-dd');

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
    const today = new Date();

    const fromDate: string = formData.from
      ? this.datePipe.transform(formData.from, 'yyyy-MM-dd')!
      : this.datePipe.transform(today, 'yyyy-MM-dd')!; // Default to today's date

    const toDate: string = formData.to
      ? this.datePipe.transform(formData.to, 'yyyy-MM-dd')!
      : this.datePipe.transform(today, 'yyyy-MM-dd')!; // Default to today's date

    const paymentMode: string = formData.paymentMode || 'All'; // Fallback to 'All' if paymentMode is null
    const paymentStatus: string = formData.paymentStatus || 'All'; // Assign 'All' if null

    return { paymentMode, paymentStatus, fromDate, toDate };
  }

  // Now you can call getFormData in getTableData directly
  private getTableData(): void {
    const { paymentMode, paymentStatus, fromDate, toDate } = this.getFormData();
  
    this.loadingService.showLoader();
  
    // Fetch invoices with the specified parameters
    const invoicesSummary$ = this.invoiceService.getAllInvoice(paymentMode, paymentStatus, fromDate, toDate);
    const patients$ = this.patientService.getPatientList();
  
    forkJoin([invoicesSummary$, patients$]).subscribe(([invoicesSummary, patients]) => {
      console.log(invoicesSummary);
  
      // Set total payment amounts based on paymentMode
      if (paymentMode === "All") {
        this.totalPaymentAmount = invoicesSummary.totalAmount; // Total amount for all payments
      } else if (paymentMode === "Cash") {
        this.totalPaymentAmount = invoicesSummary.totalCashAmount; // Total cash amount
      } else if (paymentMode === "Online") {
        this.totalPaymentAmount = invoicesSummary.totalOnlineAmount; // Total online amount
      } else {
        this.totalPaymentAmount = 0; // Default to 0 if mode doesn't match
      }
  
      // Now properly map invoices from the invoices array in the response
      this.combinedData = invoicesSummary?.invoices.map((invoice: Iinvoice) => {
        const patient = patients.find((p: IpatientInfo) => p.patientId === invoice.patientId);
        return {
          ...invoice,
          patientFname: patient ? patient.firstName : 'Unknown Patient',
          patientLname: patient ? patient.lastName : 'Unknown Patient',
        };
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
    });
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

  onPaymentModeChange(event: any) {
    this.selectedPaymentMode = event.value;
    this.getTableData();
  }
}
