import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { StaffScheduleService } from 'src/app/shared/Services/appointment/staff-schedule.service';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { DataService } from 'src/app/shared/data/data.service';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';
import { pageSelection, apiResultFormat, schedule, IstaffInfo, Idepartment, Istaffschedule } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  public routes = routes;

  public schedule: any[] = [];
  dataSource!: MatTableDataSource<any[]>;

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
  public combinedData: any[] = [];
  public flag: boolean = false;
  public loggedInUser!:any;

  constructor(public data: DataService,
    private staffService: StaffService,
    private departmentService: DepartmentService,
    private staffScheduleService: StaffScheduleService, 
    private route: Router,
  private modalservice : ModalServiceService,
  private toaster: ToastrService,) {

  }
  ngOnInit() {
    // this.fetchCombineData()
    this.loggedInUser=JSON.parse(localStorage.getItem('data')||'')

    this.fetchCombineData();
  }

  deleteSchedule(idhere:number){
    this.modalservice.openModal({
      type: 'schedule',
      id: idhere,
      confirmCallback: () => this.confirmDelete(idhere)
    });
  }

  confirmDelete(idhere:number){
    this.staffScheduleService.deleteScheuleById(idhere).subscribe(res => {
      if (res == null) {
        this.toaster.success("Schedule is deleted!")
        this.fetchCombineData()
      }
    })

  }





  onRefresh() {
    this.schedule = [];
    this.searchDataValue = ''
    this.fetchCombineData()
  }
  moveToEdit(idhere: number) {
    this.staffScheduleService.scheduleId = idhere;
    // this.staffScheduleService.data=this.schedule;
    this.route.navigate([routes.editSchedule])
  }


  fetchCombineData() {
    const departmentData$ = this.departmentService.getDepartmentList();
    const staffData$ = this.staffService.getScheduleList();
    const staffData1$ = this.staffService.getStaffList();


    forkJoin([staffData$, departmentData$, staffData1$]).subscribe(([staff, department, allStaff]) => {
      
      this.schedule = [];
      this.serialNumberArray = [];

      this.combinedData = staff.map((staffres: Istaffschedule) => {
        const dept = department.find((dept: Idepartment) => dept.departmentId == staffres.departmentId);
        console.log("dept", dept)
        return {
          ...staffres,
          departmentName: dept ? dept.departmentName : null
        };
      });
      console.log("the com", this.combinedData)
      this.combinedData = this.combinedData.map((staffres) => {

        const staff = allStaff.find((dept: IstaffInfo) => dept.staffId == staffres.staffId);
        return {
          ...staffres,
          staffName: staff ? `${staff.firstName} ${staff?.lastName}` : null
        };
      });
      if(this.loggedInUser.userRole == "doctor"){
        this.combinedData=this.combinedData.filter((item)=>item.staffId == this.loggedInUser.loginId)

      }
      this.combinedData.map((res: any, index: number) => {
        const serialNumber = index + 1;

        if (index >= this.skip && serialNumber <= this.limit) {
          this.schedule.push(res);
          //console.log(res.DOJ)
          this.serialNumberArray.push(serialNumber);
        }
      });
      console.log("list", this.schedule)
      this.totalData = this.schedule.length;
      this.dataSource = new MatTableDataSource<any[]>(this.schedule);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

    // this.staffService.getStaffList().subscribe((data) => {
    //   this.allstaffList = data;
    // })



  }






  private getTableData(): void {
    this.schedule = [];
    this.serialNumberArray = [];

    this.staffService.getScheduleList().subscribe((data) => {
      this.totalData = data.length;
      data.map((res, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {

          this.schedule.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      console.log("data", this.schedule)
      // this.dataSource = new MatTableDataSource<schedule>(this.schedule);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.serialNumberArray = [];
    this.totalData = 0;

    if (value != '') {
      this.dataSource.filter = value.trim().toLowerCase();
      this.schedule = this.dataSource.filteredData;
      if (this.schedule.length > 0) {
        this.flag = false;
        this.schedule.map((item: any, index: number) => {
          this.serialNumberArray.push(index + 1)
        })
        this.totalData = this.schedule.length;
        this.calculateTotalPages(this.totalData, this.pageSize);

      }
      else {
        this.flag = true;
        this.serialNumberArray = [];
        this.totalData = 0;
      }

    }
    else {
      this.fetchCombineData()
    }

  }

  public sortData(sort: Sort) {
    const data = this.schedule.slice();

    if (!sort.active || sort.direction === '') {
      this.schedule = data;
    } else {
      this.schedule = data.sort((a, b) => {
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
      this.fetchCombineData()
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
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
    this.fetchCombineData()
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.fetchCombineData()
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
}
