import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../shared/Services/invoice/invoice.service';
import { LoadingService } from '../../../shared/Services/loader/loader.service';
import { PatientService } from '../../../shared/Services/patient/patient.service';
import { AppointmentService } from '../../../shared/Services/appointment/appointment.service';
import { DataService } from '../../../shared/data/data.service';
import { pageSelection, apiResultFormat, invoices, Iinvoice, IpatientInfo, InvoiceInfoResponse, IInvoiceSummaryResponse } from '../../../shared/models/models';
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
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Kolkata');

interface data {
  value: string;
}
@Component({
  selector: 'app-doctor-invoices-list',
  templateUrl: './doctor-invoices-list.component.html',
  styleUrls: ['./doctor-invoices-list.component.scss'],
  providers: [DatePipe]
})
export class DoctorInvoicesListComponent implements OnInit {
  public routes = routes;
  public selectedValue !: string;
  public invoices: any[] = [];
  public loggedIn: any;
  dataSource!: MatTableDataSource<Iinvoice>;
  invoiceId: InvoiceInfoResponse[] = [];
  filteredInvoices: InvoiceInfoResponse[] = [];
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
  constructor(
    public data: DataService,
    private invoiceService: InvoiceService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private route: Router,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalservice: ModalServiceService,
    private toaster: ToastrService
  ) {}
  ngOnInit() {
    this.loggedIn = JSON.parse(localStorage.getItem('data') || '')
    this.initSearchForm();
    this.getTableData();
  }
  initSearchForm() {
    const today = dayjs().tz('Asia/Kolkata');
    const formattedToday = today.format('YYYY-MM-DD');
    this.searchForm = this.fb.group({
      from: [formattedToday, Validators.required],
      to: [formattedToday, Validators.required],
      paymentStatus: ['All'],
      paymentMode: ['All']
    });
  }
  public searchInvoices(): void {
    this.getTableData();
  }
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
  public getTableData(): void {
    const { paymentMode, paymentStatus, fromDate, toDate } = this.getFormData();
    this.loadingService.showLoader();
    const doctorId = this.loggedIn?.loginId;
    this.data.getDoctorInvoices(doctorId, fromDate, toDate).subscribe(
      (result: apiResultFormat) => {
        // Assuming result.data is the array of invoices
        let invoices = result.data || [];
        // Optionally filter by paymentMode and paymentStatus if backend does not do it
        if (paymentMode !== 'All') {
          invoices = invoices.filter((inv: any) => inv.paymentMode === paymentMode);
        }
        if (paymentStatus !== 'All') {
          invoices = invoices.filter((inv: any) => inv.status === paymentStatus);
        }
        this.combinedData = invoices;
        this.totalPaymentAmount = invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
        this.invoices = [];
        this.serialNumberArray = [];
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
      },
      (error) => {
        console.error('Error loading data:', error);
        this.loadingService.hideLoader();
      }
    );
  }
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
        const aValue = (a as any)[sort.active];
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
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  movetoInvoiceView(Id: number, patienId: number) {
    this.invoiceService.invoiceId = Id;
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
  exportInvoiceList() {
    if (this.invoices.length > 0) {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.invoices);
      const workbook: XLSX.WorkBook = { Sheets: { 'Invoice': worksheet }, SheetNames: ['Invoice'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Invoice');
    }
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
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
        const formattedDate = dayjs().tz('Asia/Kolkata').format('DD-MM-YYYY');
        pdf.save(`Invoice${formattedDate}.pdf`);        
      })
    }
    this.loadingService.hideLoader();
  }
  exportInvoiceListAsCsv() {
    if (this.invoices.length > 0) {
      const replacer = (key: string, value: any) => value === null || value === undefined ? '' : value;
      const header = Object.keys(this.invoices[0]);
      const csv = [
        header.join(','),
        ...this.invoices.map(row =>
          header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
        )
      ].join('\r\n');
      const formattedDate = dayjs().tz('Asia/Kolkata').format('DD-MM-YYYY');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      FileSaver.saveAs(blob, `Invoice_export_${formattedDate}.csv`);
    }
  }
}
