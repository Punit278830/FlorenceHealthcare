import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../../shared/data/data.service';
import { pageSelection, apiResultFormat, allInvoice } from '../../../../shared/models/models';
import { routes } from '../../../../shared/routes/routes';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-invoice',
  templateUrl: './all-invoice.component.html',
  styleUrls: ['./all-invoice.component.scss'],
  providers: [DatePipe]
})
export class AllInvoiceComponent implements OnInit{
  public routes = routes;
  public checkboxes: string[] = [];

  public allInvoice: Array<allInvoice> = [];
  dataSource!: MatTableDataSource<allInvoice>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 25;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;

  constructor(public data : DataService, private datePipe: DatePipe){
    this.initializePagination();
  }

  private initializePagination(): void {
    this.pageSelection = [];
    this.pageNumberArray = [];
    this.currentPage = 1;
    this.skip = 0;
    this.limit = this.pageSize;
  }

  ngOnInit() {
    this.getTableData();
  }

  private getTableData(): void {
    this.allInvoice = [];
    this.serialNumberArray = [];

    this.data.getAllInvoice().subscribe((data: apiResultFormat) => {
      this.totalData = data.totalData;
      const startIndex = this.skip;
      const endIndex = Math.min(this.skip + this.pageSize, this.totalData);
      
      data.data.map((res: allInvoice, index: number) => {
        if (index >= startIndex && index < endIndex) {
          this.allInvoice.push(res);
          this.serialNumberArray.push(index + 1);
        }
      });
      
      this.dataSource = new MatTableDataSource<allInvoice>(this.allInvoice);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.allInvoice = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.allInvoice.slice();

    if (!sort.active || sort.direction === '') {
      this.allInvoice = data;
    } else {
      this.allInvoice = data.sort((a, b) => {
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
    this.initializePagination();
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.pageSelection = [];
    this.totalPages = Math.ceil(totalData / pageSize);
    
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  public openCheckBoxes(val: string){
    if (this.checkboxes[0] != val) {
      this.checkboxes[0] = val;
    } else {
      this.checkboxes = [];
    }
  }

  formatDate(date: string | number): string {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
      // Convert to IST by adding 5 hours and 30 minutes
      const istDate = new Date(dateObj.getTime() + (5.5 * 60 * 60 * 1000));
      return this.datePipe.transform(istDate, 'dd/MM/yyyy HH:mm:ss', '+0530') || '';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  formatDateOnly(date: string | number): string {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
      const istDate = new Date(dateObj.getTime() + (5.5 * 60 * 60 * 1000));
      return this.datePipe.transform(istDate, 'dd/MM/yyyy', '+0530') || '';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  // Helper method to get payment date
  getPaymentDate(data: allInvoice): string {
    if (data.status === 'Paid' && data.paymentDate) {
      return this.formatDate(data.paymentDate);
    }
    return '';
  }
}
