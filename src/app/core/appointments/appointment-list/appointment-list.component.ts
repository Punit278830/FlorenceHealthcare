import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { s } from '@fullcalendar/core/internal-common';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { forkJoin } from 'rxjs';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';
import { DataService } from 'src/app/shared/data/data.service';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';
import { pageSelection, apiResultFormat, appointmentList, Iappointment, Ilogin } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

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
  public minToDate: dayjs.Dayjs | null = dayjs().tz('Asia/Kolkata');
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
    const todayIST = dayjs().tz('Asia/Kolkata');
    const formattedTodayIST = todayIST.format('YYYY-MM-DD');
    this.appintmentDateForm = this.fb.group({
      appointmentFrom: [formattedTodayIST, Validators.required],
      appointmentTo: [formattedTodayIST, Validators.required]
    });
    this.minToDate = todayIST;
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
        this.toastr.success("Appointment is deleted!");
        // Reset pagination and clear data to force refetch
        this.skip = 0;
        this.currentPage = 1;
        this.pageIndex = 0;
        this.combinedData = [];
        this.fetchCombineData();
      }
    });
  }


  onRefresh() {
    this.appintmentDateForm.reset();
    this.searchDataValue = '';
    // Reset pagination
    this.skip = 0;
    this.currentPage = 1;
    this.pageIndex = 0;
    this.combinedData = []; // Clear existing data to force refetch
    this.fetchCombineData();
  }

  // Apply pagination to the current data (either combinedData or filtered data)
  applyPagination(dataToPage?: any[]) {
    const sourceData = dataToPage || this.combinedData;
    this.totalData = sourceData.length;

    // Apply pagination to the source data
    const startIndex = this.skip;
    const endIndex = this.skip + this.pageSize;
    this.appointmentList = sourceData.slice(startIndex, endIndex);

    // Generate serial numbers for current page
    this.serialNumberArray = [];
    for (let i = 0; i < this.appointmentList.length; i++) {
      this.serialNumberArray.push(startIndex + i + 1);
    }

    this.dataSource = new MatTableDataSource<Iappointment>(this.appointmentList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  fetchCombineData() {
    this.loadingService.showLoader();
    this.appointmentList = [];
    let from = this.appintmentDateForm.get('appointmentFrom')?.value || null;
    let to = this.appintmentDateForm.get('appointmentTo')?.value || null;

    // Ensure 'to' date includes the full day
    if (to) {
      to = to + 'T23:59:59';
    }
    let appointmentData$;
    if (from !== null && to !== null) {
      console.log("from to", from, to)
      if (this.loggedIn.userRole == 'admin' || this.loggedIn.userRole == 'reception' || this.loggedIn.userRole == 'nursing' || this.loggedIn.userRole == 'Doctor') {
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

    this.isAllowed = this.loggedIn.userRole == 'reception' ? false : true;
 
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
            patientFname: patients ? patients.firstName : 'Unknown Patient',
            patientLname: patients ? patients.lastName : '',
            patientId: patients ? patients.patientId : null
          };
        });

        // Apply pagination to the combined data
        this.applyPagination();
      }

      this.loadingService.hideLoader();
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

  }

  public searchData(value: any): void {
    if (value != '') {
      // Filter the combined data
      const filteredData = this.combinedData.filter((item: any) => {
        return (
          item.patientFname?.toLowerCase().includes(value.toLowerCase()) ||
          item.patientLname?.toLowerCase().includes(value.toLowerCase()) ||
          item.doctorFname?.toLowerCase().includes(value.toLowerCase()) ||
          item.doctorLname?.toLowerCase().includes(value.toLowerCase()) ||
          item.departmentName?.toLowerCase().includes(value.toLowerCase()) ||
          item.appointmentId?.toString().includes(value)
        );
      });

      // Reset pagination and apply to filtered data
      this.skip = 0;
      this.currentPage = 1;
      this.pageIndex = 0;
      this.applyPagination(filteredData);
    } else {
      this.searchDataValue = '';
      this.skip = 0;
      this.currentPage = 1;
      this.pageIndex = 0;
      this.applyPagination();
    }
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
      this.skip = this.pageSize * this.pageIndex;
      this.applyPagination();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.skip = this.pageSize * this.pageIndex;
      this.applyPagination();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.pageIndex = pageNumber - 1;
    this.skip = this.pageSize * this.pageIndex;
    this.applyPagination();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.skip = 0;
    this.currentPage = 1;
    this.pageIndex = 0;
    this.applyPagination();
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
    //this.patientService.patientId = patientId;
    this.patientService.patientId=0;
    this.appointmentService.appointmentId = appointmentId;
    this.departmentService.departmentId = departmentId;
    this.dosctoService.staffId = doctorId;
    if (status != 'Active') {
      this.appointmentService.appoinmentStatus = false;
    }

    setTimeout(() => {
      this.route.navigate([routes.profile], { queryParams: { patientId: patientId } });
      this.loadingService.hideLoader();
    }, 0);

  }

  appointmentByDate(event: any, type: string): void {
    // Use the selected date directly without timezone conversion to avoid date shifting
    const selectedDate = dayjs(event.value).format('YYYY-MM-DD');

    if (type === 'from') {
        this.minToDate = dayjs(event.value);
        this.appintmentDateForm.get('appointmentFrom')?.setValue(selectedDate);
        this.appintmentDateForm.get('appointmentTo')?.setValue(null);
    }
    if (type === 'to') {
        const fromDate = this.appintmentDateForm.get('appointmentFrom')?.value;
        if (dayjs(selectedDate).isBefore(dayjs(fromDate))) {
            this.toastr.error('End date cannot be earlier than start date');
            return;
        }
        this.appintmentDateForm.get('appointmentTo')?.setValue(selectedDate);
    }

    const from = this.appintmentDateForm.get('appointmentFrom')?.value || null;
    const to = this.appintmentDateForm.get('appointmentTo')?.value || null;

    if (from !== null && to !== null) {
        this.isAppointmentDateSelected = true;
        // Reset pagination when dates change
        this.skip = 0;
        this.currentPage = 1;
        this.pageIndex = 0;
        this.combinedData = []; // Clear existing data to force refetch
        this.fetchCombineData();
    }
  }

  exportAppointmentList()
    {
      if (this.appointmentList.length > 0) 
        {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.appointmentList);
        const workbook: XLSX.WorkBook = { Sheets: { 'Appointment': worksheet }, SheetNames: ['Appointment'] };

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Call saveAsExcel
        this.saveAsExcelFile(excelBuffer, 'Appointment');
      }

    }
    

    exportAppointmentListAsPdf()
    {
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
          const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
           pdf.save(`Appointment${formattedDate}.pdf`);
          
        })
      }
  
      this.loadingService.hideLoader();
    }
      
      private saveAsExcelFile(buffer: any, fileName: string): void 
      {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    FileSaver.saveAs(data, `${fileName}_export_${formattedDate}.xlsx`);
        
  }

  // Add a method to format date/time using dayjs
  getLocalDateTime(date: any): string {
    if (!date) return '';
    // Convert to local time zone (e.g., 'Asia/Kolkata')
    return dayjs(date).tz(dayjs.tz.guess()).format('DD/MM/YYYY hh:mm A');
  }

  getLocalDate(date: any): string {
    if (!date) return '';
    return dayjs(date).tz(dayjs.tz.guess()).format('DD/MM/YYYY');
  }

}
