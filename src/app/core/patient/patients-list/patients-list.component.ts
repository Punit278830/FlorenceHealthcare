import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { MatTableDataSource } from "@angular/material/table";
import { pageSelection, IpatientInfo } from 'src/app/shared/models/models';
import { Sort } from '@angular/material/sort';
import { DataService } from 'src/app/shared/data/data.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup } from '@angular/forms';
import * as jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
  providers: [DatePipe],

})
export class PatientsListComponent implements OnInit {
  public routes = routes;
  public patientsList: Array<IpatientInfo> = [];
  dataSource!: MatTableDataSource<IpatientInfo>;

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
  public patientList: Array<IpatientInfo> = [];
  public allpatientList: Array<IpatientInfo> = [];
  public totalPages = 0;
  public img = "assets/img/profiles/avatar-08.jpg";
  public age!: number;
  public dateForm!: FormGroup;
  public minToDate: Date | null = null;
  public loggedIn: any;


  constructor(public data: DataService,
    private patientService: PatientService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private route: Router,
    private modalservice: ModalServiceService,
    private toaster: ToastrService,
  ) {



  }

  deletePatient(idhere: number) {
    this.modalservice.openModal({
      type: 'patient',
      id: idhere,
      confirmCallback: () => this.confirmDelete(idhere)
    });
  }

  confirmDelete(idhere: number) {
    this.patientService.deletePatient(idhere).subscribe(res => {
      if (res == null) {
        this.toaster.success("Patient is deleted!")
        this.getTableData()
      }
    })

  }





  initlizeDateForm() {
    this.dateForm = this.fb.group({
      from: [null],
      to: [null]
    });
  }


  ngOnInit() {
    this.loggedIn = JSON.parse(localStorage.getItem('data') || '')
    this.initlizeDateForm();
    this.getTableData();
  }

  onRefresh() {
    this.patientList = [];
    this.searchDataValue = '';
    this.dateForm.reset();
    this.getTableData()
  }

  private getTableData(): void {

    this.patientList = [];
    this.serialNumberArray = [];
    const from = this.dateForm.get('from')?.value || null;
    const to = this.dateForm.get('to')?.value || null;
    if (from !== null && to !== null) {
      // this.dateForm.reset();
      this.patientService.getPatientdateange(from, to).subscribe((data: any) => {
        this.totalData = data.length;
        // this.staffList.push(data);

        console.log(data)
        data.map((res: any, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.calculateDateDifference(res.dob);
            res.ageinYear = this.age;

            this.patientList.push(res);
            console.log(res.DOJ)
            this.serialNumberArray.push(serialNumber);
          }
        });
        // this.dataSource = new MatTableDataSource<IpatientInfo>(this.patientList);
        this.calculateTotalPages(this.totalData, this.pageSize);

      })
    }
    else {
      this.patientService.getPatientList().subscribe((data: any) => {
        this.totalData = data.length;
        // this.staffList.push(data);
        this.allpatientList = data;
        console.log("allpatients", this.allpatientList)

        console.log(data)
        data.map((res: any, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.calculateDateDifference(res.dob);
            res.ageinYear = this.age;

            this.patientList.push(res);
            console.log(res.DOJ)
            this.serialNumberArray.push(serialNumber);
          }
        });
        // this.dataSource = new MatTableDataSource<IpatientInfo>(this.patientList);
        this.calculateTotalPages(this.totalData, this.pageSize);

      })
    }
    this.dataSource = new MatTableDataSource<IpatientInfo>(this.allpatientList);
    // this.patientService.getPatientList().subscribe((data:any)=>{
    //    this.totalData=data.length;
    //     // this.staffList.push(data);

    //         console.log(data)
    //         data.map((res: any, index: number) => {
    //   const serialNumber = index + 1;
    //   if (index >= this.skip && serialNumber <= this.limit) {
    //     this.calculateDateDifference(res.dob);
    //     res.ageinYear=this.age;

    //     this.patientList.push(res);
    //     console.log(res.DOJ)
    //     this.serialNumberArray.push(serialNumber);
    //   }
    // });
    //         this.dataSource = new MatTableDataSource<IpatientInfo>(this.patientList);
    //         this.calculateTotalPages(this.totalData, this.pageSize);

    // })

    // this.data.getStaffList().subscribe((data: apiResultFormat) => {
    //   this.totalData = data.totalData;
    //   console.log("mock data"+data);


    //   // data.data.map((res: staffList, index: number) => {
    //   //   const serialNumber = index + 1;
    //   //   if (index >= this.skip && serialNumber <= this.limit) {

    //   //     //this.staffList.push(res);
    //   //     this.serialNumberArray.push(serialNumber);
    //   //   }
    //   // });
    //   //this.dataSource = new MatTableDataSource<staffList>(this.staffList);
    //   //this.calculateTotalPages(this.totalData, this.pageSize);
    // });
  }
  // private getTableData(): void {
  //   this.patientsList = [];
  //   this.serialNumberArray = [];

  //   this.data.getPatientsList().subscribe((data: apiResultFormat) => {
  //     this.totalData = data.totalData;
  //     data.data.map((res: patientsList, index: number) => {
  //       const serialNumber = index + 1;
  //       if (index >= this.skip && serialNumber <= this.limit) {

  //         this.patientsList.push(res);
  //         this.serialNumberArray.push(serialNumber);
  //       }
  //     });
  //     this.dataSource = new MatTableDataSource<patientsList>(this.patientsList);
  //     this.calculateTotalPages(this.totalData, this.pageSize);
  //   });
  // }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.serialNumberArray = [];
    this.totalData = 0;

    if (value != '') {
      this.dataSource.filter = value.trim().toLowerCase();
      this.patientList = this.dataSource.filteredData;
      if (this.patientList.length > 0) {
        this.patientList.map((item: any, index: number) => {
          this.serialNumberArray.push(index + 1)
        })
        this.totalData = this.patientList.length;
        this.calculateTotalPages(this.totalData, this.pageSize);

      }
      else {
        this.serialNumberArray = [];
        this.totalData = 0;
      }

    }
    else {
      this.getTableData()
    }

  }

  public sortData(sort: Sort) {
    const data = this.patientList.slice();

    if (!sort.active || sort.direction === '') {
      this.patientList = data;
    } else {
      this.patientList = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    console.log('Current Page:', this.currentPage);
    console.log('Total Pages:', this.totalPages);
    console.log('Patients List:', this.patientsList);

    if (event == 'next' && this.currentPage < this.pageNumberArray.length) {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event == 'previous' && this.currentPage > 1) {
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
      var limit = pageSize * i;
      var skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  onEditPatient(id: number) {
    this.patientService.patientId = id;
    console.log("stafflist", this.patientList)

  }

  calculateDateDifference(dob: Date) {
    const start = new Date(dob);
    const end = new Date();
    // Calculate the difference in years
    const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
    const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    this.age = yearsDifference;

  }

  onDobDateChange(event: any, dateType: string): void {
    // Extract the date part only
    // const datePipe = new DatePipe('en-US');
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    if (dateType == 'from') {
      this.minToDate = event.value
      this.dateForm.get('from')?.setValue(dateOnly)

    }
    if (dateType == 'to') {
      this.dateForm.get('to')?.setValue(dateOnly)
    }
    const from = this.dateForm.get('from')?.value || null;
    const to = this.dateForm.get('to')?.value || null;
    if (from !== null && to !== null) {

      this.getTableData();
    }



  }

  movetoProfile(id: number) {
    this.patientService.patientId = id;

    this.route.navigate([routes.profile]);

  }

  movetoBookappointment(id: number) {
    this.patientService.patientId = id;
    this.route.navigate([routes.addAppointment]);
  }

}