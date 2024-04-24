import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { DataService } from 'src/app/shared/data/data.service';
import { Idepartment, IstaffInfo, apiResultFormat, pageSelection, staffList } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit{
  public routes = routes;
  public staffList: Array<any>=[];
  dataSource!: MatTableDataSource<IstaffInfo>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  private _staffDto!:Array<IstaffInfo>;
  public img="assets/img/profiles/avatar-08.jpg";
  public combinedData:any[]=[];

  constructor(public data : DataService,
    private staffService:StaffService,
    private departmentService:DepartmentService){
      //this.fetchCombineData();

  }
  ngOnInit() {
    //this.getTableData();
    this.fetchCombineData();
  }

  fetchCombineData()
  {
    const departmentData$=this.departmentService.getDepartmentList();
    const staffData$=this.staffService.getStaffList();

    
forkJoin([staffData$, departmentData$]).subscribe(([staff, department]) => {
 this.totalData=staff.length;
 this.staffList=[];
 this.serialNumberArray = [];

 this.combinedData = staff.map((staffres: IstaffInfo) => {
 const dept = department.find((dept: Idepartment) => dept.departmentId == staffres.departmentId);
    return {
      ...staffres,
      departmentName: dept ? dept.departmentName : null
    };
  });
this.combinedData.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.staffList.push(res);
          //console.log(res.DOJ)
          this.serialNumberArray.push(serialNumber);
        }
      });
 this.dataSource = new MatTableDataSource<IstaffInfo>(this.staffList);
              this.calculateTotalPages(this.totalData, this.pageSize);
});

  }
  private getTableData() 
  {
    this.staffList = [];
    this.serialNumberArray = [];
     
      this.staffService.getStaffList().subscribe((data:any)=>{
         this.totalData=data.length;
         data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.staffList.push(res);
          console.log(res.DOJ)
          this.serialNumberArray.push(serialNumber);
        }
      });
              this.dataSource = new MatTableDataSource<IstaffInfo>(this.staffList);
              this.calculateTotalPages(this.totalData, this.pageSize);
        
      })
      
    // this.data.getStaffList().subscribe((data: apiResultFormat) => {
    //   this.totalData = data.totalData;
     
      
    // });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.staffList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.staffList.slice();

    if (!sort.active || sort.direction === '') {
      this.staffList = data;
    } else {
      this.staffList = data.sort((a, b) => {
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
      //this.getTableData();
      this.fetchCombineData();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
     // this.getTableData();
     this.fetchCombineData()
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
   // this.getTableData();
    this.fetchCombineData();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    //this.getTableData();
    this.fetchCombineData();
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

  onEditStaff(item:number)
  {
    this.staffService.staffId=item;

  }
}
