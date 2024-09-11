import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { s } from '@fullcalendar/core/internal-common';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { DataService } from 'src/app/shared/data/data.service';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';
import { pageSelection, apiResultFormat, appointmentList, Iappointment, Ilogin } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  providers: [DatePipe],

})
export class AppointmentListComponent implements OnInit {
  public routes = routes;
  public patientsList: Array<Iappointment> = [];
  dataSource!: MatTableDataSource<Iappointment>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 50;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public appointmentList: Array<any> = [];
  public finaldata: any[] = [];
  public totalPages = 0;
  public img = "assets/img/profiles/avatar-08.jpg";
  public age!: number;
  public combinedData: any[] = [];
  public loggedIn!: Ilogin;
  public appintmentDateForm!: FormGroup;
  private isAppointmentDateSelected = false;
  private dateOnly: any;
  public minToDate: Date | null = null;
  isAllowed: boolean = false; // Patient click Not allowed for receptionist

  constructor(public data: DataService, private appointmentService: AppointmentService,
    private departmentService: DepartmentService,
    private staffService: StaffService,
    private patientService: PatientService,
    private dosctoService: StaffService,
    private route: Router,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalservice: ModalServiceService,
    private loadingService: LoadingService
  ) {

  }
  ngOnInit() {
    this.loggedIn = JSON.parse(localStorage.getItem('data') || '')
    this.initializeAppointDateForm();
    // this.getTableData();
    this.fetchCombineData();
  }

  // initilizeAppointDateForm() {
  //   this.appintmentDateForm = this.fb.group({
  //     appointmentFrom: [null, Validators.required],
  //     appointmentTo: [null, Validators.required]
  //   })
  // }
  initializeAppointDateForm() {
    const today = new Date();
    const formattedToday = this.datePipe.transform(today, 'yyyy-MM-dd');

    this.appintmentDateForm = this.fb.group({
      appointmentFrom: [formattedToday, Validators.required],
      appointmentTo: [formattedToday, Validators.required]
    });
  }
  deleteAppointment(idhere: number) {
    this.modalservice.openModal({
      type: 'appointment',
      id: idhere,
      confirmCallback: () => this.confirmDelete(idhere)
    });
  }

  handleClick(event: MouseEvent): void {
    if (!this.isAllowed) {
      // Prevent default behavior if not allowed
      event.stopImmediatePropagation(); // Prevent event from propagating
      return; // Exit the function to avoid further processing
    }
  }

  confirmDelete(idhere: number) {
    this.appointmentService.deleteAppointment(idhere).subscribe(res => {
      if (res == null) {
        this.toastr.success("Appointment is deleted!")
        this.fetchCombineData()
      }
    })

  }


  onRefresh() {
    this.appintmentDateForm.reset()
    this.searchDataValue = ''

    this.fetchCombineData()
  }

  fetchCombineData() {
    this.loadingService.showLoader();
    this.appointmentList = [];
    const from = this.appintmentDateForm.get('appointmentFrom')?.value || null;
    const to = this.appintmentDateForm.get('appointmentTo')?.value || null;

    let appointmentData$;
    if (from !== null && to !== null) {
      console.log("from to", from, to)

      if (this.loggedIn.userRole == 'admin' || this.loggedIn.userRole == 'reception' || this.loggedIn.userRole == 'nursing') {

        appointmentData$ = this.appointmentService.getAppointmentByDate(from, to);
        this.isAppointmentDateSelected = false;
      }
      else {
        appointmentData$ = this.appointmentService.getappointmentByIdAndDate(this.loggedIn.loginId, from, to);
        this.isAppointmentDateSelected = false;
      }
    }
    else {
      if (this.loggedIn.userRole == 'admin' || this.loggedIn.userRole == 'reception' || this.loggedIn.userRole == 'nursing') {
        console.log("all")
        appointmentData$ = this.appointmentService.getAppointmentList();
      }
      else {
        appointmentData$ = this.appointmentService.getAppointmentByDoctorId(this.loggedIn.loginId);
      }
    }

    if (this.loggedIn.userRole == 'reception') {
     this.isAllowed = false;
    }
    else
    {
      this.isAllowed = true;
    }

    // if(this.loggedIn.userRole=='admin')
    // {
    //   appointmentData$=this.appointmentService.getAppointmentList();
    // }
    // else{
    //   appointmentData$=this.appointmentService.getAppointmentByDoctorId(this.loggedIn.loginId);
    // }
    const departmentData$ = this.departmentService.getDepartmentList();
    const staffData$ = this.staffService.getDoctorsList();
    const patientData$ = this.patientService.getPatientList();
    forkJoin([appointmentData$, departmentData$, staffData$, patientData$]).subscribe(([appointments, departments, staffs, patient]) => {
      // Combine data based on departmentId
      this.totalData = appointments.length;

      this.serialNumberArray = [];
      console.log("appointments", appointments)

      if (appointments.message === "No records found") {
        this.appointmentList = [];
        this.toastr.error("No Appointment Available", "Appointment Status");
      }
      else {
        this.combinedData = appointments.map((appointment: any) => {
          const doctor = staffs.find((doctor: any) => doctor.staffId === appointment.doctorId)
          const patients = patient.find((patient: any) => patient.patientId === appointment.patientId)
          const department = departments.find((department: any) => department.departmentId === appointment.departmentid)


          return {
            ...appointment,
            doctorFname: doctor ? doctor.firstName : 'Unknown Doctor',
            doctorLname: doctor ? doctor.lastName : '',
            departmentName: department ? department.departmentName : 'Unknown Department',
            patientFname: patients ? patients.firstName : 'Unknon Patients',
            patientLname: patients ? patients.lastName : 'Unknon Patients',
            patientId: patients ? patients.patientId : 'Unknon Patients'
          };

        });


        this.combinedData.map((res: any, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            // this.calculateDateDifference(res.dob);
            // res.ageinYear=this.age;

            this.appointmentList.push(res);
            // console.log(res.DOJ)
            this.serialNumberArray.push(serialNumber);
          }
        });

      }

      this.loadingService.hideLoader();

      this.dataSource = new MatTableDataSource<Iappointment>(this.appointmentList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    },

      error => {
        this.loadingService.hideLoader();

        this.toastr.error("No Appointment Available", "Appointment Status");
        console.log(error);

      });

  }

  private getTableData(): void {
    this.appointmentList = [];
    this.serialNumberArray = [];

    // this.appointmentService.getappointmentByIDAndDate(19,dateOnly).subscribe(res=>{
    //   console.log(res);
    // })
    this.appointmentService.getAppointmentList().subscribe((data: any) => {
      this.totalData = data.length;
      // this.staffList.push(data);

      console.log(data)
      data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          // this.calculateDateDifference(res.dob);
          // res.ageinYear=this.age;

          this.appointmentList.push(res);
          // console.log(res.DOJ)
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<Iappointment>(this.appointmentList);
      this.calculateTotalPages(this.totalData, this.pageSize);

    })

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

  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.appointmentList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.appointmentList.slice();

    if (!sort.active || sort.direction === '') {
      this.appointmentList = data;
    } else {
      this.appointmentList = data.sort((a, b) => {
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
      this.fetchCombineData();
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
    //this.getTableData();
    this.fetchCombineData();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    // this.getTableData();
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
      var limit = pageSize * i;
      var skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  // onEditPatient(id:number){
  //   this.patientService.patientId=id;

  // }

  calculateDateDifference(dob: Date) {
    const start = new Date(dob);
    const end = new Date();
    // Calculate the difference in years
    const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
    const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    this.age = yearsDifference;

  }
  onEditAppointment(id: number, status: string) {
    this.appointmentService.appointmentId = id;
    if (status !== 'Active') {
      this.appointmentService.appoinmentStatus = false;
    }

  }

  movetoProfile(patientId: number, appointmentId: number, departmentId: number, status: string, doctorId: number) {
    this.loadingService.showLoader();
    this.patientService.patientId = patientId;
    this.appointmentService.appointmentId = appointmentId;
    this.departmentService.departmentId = departmentId;
    this.dosctoService.staffId = doctorId;
    if (status != 'Active') {
      this.appointmentService.appoinmentStatus = false;
    }

    setTimeout(() => {
      this.route.navigate([routes.profile]);
      this.loadingService.hideLoader();
    }, 0);

  }

  appointmentByDate(event: any, type: string): void {
    // Extract the date part only
    // const datePipe = new DatePipe('en-US');
    this.dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    if (type == 'from') {
      this.minToDate = this.dateOnly;

      this.appintmentDateForm.get('appointmentFrom')?.setValue(this.dateOnly)
      this.appintmentDateForm.get('appointmentTo')?.setValue(null)
    }
    if (type == 'to') {
      this.appintmentDateForm.get('appointmentTo')?.setValue(this.dateOnly)
    }
    const from = this.appintmentDateForm.get('appointmentFrom')?.value || null;
    const to = this.appintmentDateForm.get('appointmentTo')?.value || null;

    //this.dateOnly = this.datePipe.transform(event.value, 'dd-MM-yyyy');
    if (from !== null && to !== null) {
      this.isAppointmentDateSelected = true;
      this.fetchCombineData();

    }



    //     this.appointmentService.getappointmentByIdAndDate(19,this.dateOnly).subscribe((data:any)=>{

    //     this.totalData=data.length;
    //      // this.staffList.push(data);

    //          console.log(data)
    //          data.map((res: any, index: number) => {
    //    const serialNumber = index + 1;
    //    if (index >= this.skip && serialNumber <= this.limit) {
    //      // this.calculateDateDifference(res.dob);
    //      // res.ageinYear=this.age;

    //      this.appointmentList.push(res);
    //      // console.log(res.DOJ)
    //      this.serialNumberArray.push(serialNumber);
    //    }
    //  });
    //          this.dataSource = new MatTableDataSource<Iappointment>(this.appointmentList);
    //          this.calculateTotalPages(this.totalData, this.pageSize);

    //  })

  }
}
