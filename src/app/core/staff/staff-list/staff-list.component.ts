import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { DataService } from 'src/app/shared/data/data.service';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';
import { Idepartment, IstaffInfo, apiResultFormat, pageSelection, staffList } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  public routes = routes;
  public staffList: Array<any> = [];
  public allstaffList: Array<any> = [];
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
  private _staffDto!: Array<IstaffInfo>;
  public img = "assets/img/profiles/avatar-08.jpg";
  public combinedData: any[] = [];
  public loggedIn: any;

  constructor(public data: DataService,
    private staffService: StaffService,
    private departmentService: DepartmentService,
    private modalservice: ModalServiceService,
    private route: Router,
    private toaster: ToastrService) {
    //this.fetchCombineData();

  }

  deleteStaff(idhere: number) {
    this.modalservice.openModal({
      type: 'staff',
      id: idhere,
      confirmCallback: () => this.confirmDelete(idhere)
    });
  }

  confirmDelete(idhere: number) {
    this.staffService.deleteStaff(idhere).subscribe(res => {
      if (res == null) {
        this.toaster.success("Staff is deleted!")
        this.fetchCombineData()
      }
    })

  }



  ngOnInit() {
    this.loggedIn = JSON.parse(localStorage.getItem('data') || '')
    console.log("loggedin", this.loggedIn)


    //this.getTableData();
    this.fetchCombineData();

  }
  onRefresh() {
    this.staffList = [];
    this.searchDataValue = '';
    this.fetchCombineData()
  }

  fetchCombineData() {
    const departmentData$ = this.departmentService.getDepartmentList();
    const staffData$ = this.staffService.getStaffList();


    forkJoin([staffData$, departmentData$]).subscribe(([staff, department]) => {
      this.totalData = staff.length;
      this.staffList = [];
      this.allstaffList = [];
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
        this.allstaffList.push(res)

        if (index >= this.skip && serialNumber <= this.limit) {
          this.staffList.push(res);
          //console.log(res.DOJ)
          this.serialNumberArray.push(serialNumber);
        }
      });
      console.log("list",this.staffList)
      // this.dataSource = new MatTableDataSource<IstaffInfo>(this.staffList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

    // this.staffService.getStaffList().subscribe((data) => {
    //   this.allstaffList = data;
    // })
    this.dataSource = new MatTableDataSource<IstaffInfo>(this.allstaffList);


  }
  private getTableData() {
    this.staffList = [];
    this.serialNumberArray = [];

    this.staffService.getStaffList().subscribe((data: any) => {
      this.totalData = data.length;
      this.allstaffList = data;
      data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.staffList.push(res);
          console.log(res.DOJ)
          this.serialNumberArray.push(serialNumber);
        }
      });

      // this.dataSource = new MatTableDataSource<IstaffInfo>(this.staffList);
      this.calculateTotalPages(this.totalData, this.pageSize);

    })
    this.dataSource = new MatTableDataSource<IstaffInfo>(this.allstaffList);
    console.log("stafflist", this.staffList)

    // this.data.getStaffList().subscribe((data: apiResultFormat) => {
    //   this.totalData = data.totalData;


    // });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.serialNumberArray = [];
    this.totalData = 0;
    console.log("value",value)

    if (value != '') {
      this.dataSource.filter = value.trim().toLowerCase();
      this.staffList = this.dataSource.filteredData;
      console.log("stafflist",this.staffList)
      if (this.staffList.length > 0) {
        this.staffList.map((item: any, index: number) => {
          this.serialNumberArray.push(index + 1)
        })
        this.totalData = this.staffList.length;
        this.calculateTotalPages(this.totalData, this.pageSize);

      }
      else {
        this.serialNumberArray = [];
        this.totalData = 0;
      }

    }
    else {
      this.fetchCombineData()
    }

  }

  // sortData(sort: Sort) {
  //   const data = this.staffList.slice();
  //   if (!sort.active || sort.direction === "") {
  //     this.staffList = data;
  //     return;
  //   }

  //   this.staffList = data.sort((a, b) => {
  //     console.log("a b", a, b)
  //     const isAsc = sort.direction === "asc";
  //     switch (sort.active) {
  //       case "doj":
  //         return this.compare(a.doj, b.doj, isAsc);

  //       default:
  //         return 0;
  //     }
  //   });
  // }


  // compare(a: number | string, b: number | string, isAsc: boolean) {
  //   return (a > b ? -1 : 1) * (isAsc ? -1 : 1);
  // }
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

  onEditStaff(item: number) {
    this.staffService.staffId = item;
    this.staffService.staffId = item;

  }
  moveToProfile(idhere: number) {
    this.staffService.staffId = idhere;
    this.route.navigate([routes.staffProfile])
  }
}
