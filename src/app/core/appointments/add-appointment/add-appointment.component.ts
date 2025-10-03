import { DatePipe, formatNumber } from '@angular/common';
import { OnInit, OnDestroy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../../shared/Services/appointment/appointment.service';
import { StaffScheduleService } from '../../../shared/Services/appointment/staff-schedule.service';
import { DepartmentService } from '../../../shared/Services/department/department.service';
import { FileUploadService } from '../../../shared/Services/fileUpload/file-upload.service';
import { PatientService } from '../../../shared/Services/patient/patient.service';
import { StaffService } from '../../../shared/Services/staff/staff.service';
import { HospitalService } from '../../../shared/Services/hospital/hospital.service';
import { ModalServiceService } from '../../../shared/modalService/modal-service.service';
import { Iappointment, Idepartment, IfileUpload, IpatientInfo, IstaffInfo, Istaffschedule, pageSelection } from '../../../shared/models/models';
import { routes } from '../../../shared/routes/routes';
import { InvoiceService } from '../../../shared/Services/invoice/invoice.service';
import dayjs from 'dayjs';

interface data {
  value: string;
}

interface IdownloadFile {
  fileName: string;
  downloadLink: string;
}
@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss'],
  providers: [DatePipe],
})
export class AddAppointmentComponent implements OnInit, OnDestroy {
  // ...existing code...
  private loadPatients() {
    this.patientService.getPatientList().subscribe((patients: any[]) => {
      this.allPatients = patients;
      this.getTableData();
    });
  }
  public dataSource!: MatTableDataSource<IpatientInfo>;
  
  private initialHospitalLoad = true;
  public routes = routes;
  public selectedValue!: string;
  public searchResults: IpatientInfo[] = [];
  public patientAppointmentData: IpatientInfo[] = [];
  public appointmentDto: Iappointment = {} as Iappointment;
  public bookappointment!: FormGroup;
  public fileForm!: FormGroup;
  private patientId!: number;
  private formattedDateTime: Date = new Date();
  public age!: number;
  public doctorList: IstaffInfo[] = [];
  public selectedDoctor: IstaffInfo = {} as IstaffInfo;
  public departmentList: Idepartment[] = [];
  public flag: boolean = false;
  public minDate: Date = new Date(); // sets today as the minimum selectable date
  private hospitalSubscription: Subscription = new Subscription();

  // public deleteIcon=false;
  // public selectedFile!:File
  // private FileUploadDto:IfileUpload={}as IfileUpload;
  // public base64String!:string;
  // public base64StringArray:string[]=[];
  // public downloadLink:any;
  // public downLoadList:IdownloadFile[]=[];

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
  public patientlist: Array<IpatientInfo> = [];
  public totalPages = 0;

  public downlodedFileName!: string
  @ViewChild('searchDataValue') searchInput!: ElementRef;

  //public searchDataValue = '';
  public searchDataValue: string = '';
  public allPatients: any[] = [];
  constructor(private patientService: PatientService,
    private route: Router,
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private staffService: StaffService,
    private departmentService: DepartmentService,
    private fileUploadService: FileUploadService,
    private staffScheduleService: StaffScheduleService,
    private toater: ToastrService,
    private modalservice: ModalServiceService,
    private hospitalService: HospitalService,

  ) {
  this.getDepartmentLits();
  this.loadPatients();
  }

  onEditPatient(id: number) {
    this.patientService.patientId = id;

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
        this.toater.success("Patient is deleted!")
        this.loadPatients();
      }
    })

  }

  private getTableData(): void {

    this.patientlist = [];
    this.serialNumberArray = [];
    const data = this.allPatients || [];
    this.totalData = data.length;
    data.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.calculateDateDifference(res.dob);
        res.ageinYear = this.age;
        this.patientlist.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.calculateTotalPages(this.totalData, this.pageSize);

  }
  calculateDateDifference(dob: Date) {
    const start = new Date(dob);
    const end = new Date();
    // Calculate the difference in years
    const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
    const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    this.age = yearsDifference;

  }
  public sortData(sort: Sort) {
    const data = this.patientlist.slice();

    if (!sort.active || sort.direction === '') {
      this.patientlist = data;
    } else {
      this.patientlist = data.sort((a, b) => {
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
      var limit = pageSize * i;
      var skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  refresh() {
    this.patientAppointmentData = []
    this.flag = false
  }


  ngOnInit() {
    this.appointmentFormInitlize();
    this.fileFormInitlize();
    this.flag = false;
    this.patientAppointmentData = [];
    if (this.patientService.patientId && localStorage.getItem('lastPath') === 'patientList') {
      this.postDatatoAppointment(this.patientService.patientId);
      localStorage.removeItem('lastPath');
      this.patientService.patientId = 0;
    }
    //this.updateFormattedDateTime();
    //this.downloadPatientFile();

    this.bookappointment.get('appointTime')?.valueChanges.subscribe(() => {
      this.clearOtherFields();
    });

    // Subscribe to hospital changes
    this.hospitalSubscription = this.hospitalService.currentHospitalId$.subscribe(hospitalId => {
      if (this.initialHospitalLoad) {
        this.initialHospitalLoad = false;
        return;
      }
      if (hospitalId !== null) {
        // Hospital changed, reload departments and clear doctor/department selections
        this.reloadDataForHospital();
      }
    });
  }

  ngOnDestroy() {
    this.hospitalSubscription.unsubscribe();
  }

  private reloadDataForHospital() {
    // Clear existing data
    this.departmentList = [];
    this.doctorList = [];
    
    // Reset form selections
    this.bookappointment.patchValue({
      departmentid: '',
      doctorId: ''
    });
    
    // Reload departments for the new hospital
    this.getDepartmentLits();
    
  // Reload patients for the new hospital
  this.loadPatients();
  }

  
  clearOtherFields() {
    this.bookappointment.patchValue({

      doctorId: '',
      departmentid: ''


    })

  }
  appointmentStatusData = [
    { value: 'Active' },
    { value: 'In Active' },
    { value: 'Cancel' },
  ];



  appointmentFormInitlize() {
    this.bookappointment = this.fb.group({
      date: ['', Validators.required],
      doctorId: ['', Validators.required],
      notes: ['', Validators.required],
      appointmentStatus: ['Active', Validators.required],

      departmentid: ['', Validators.required],
      appointTime: [''], // Remove Validators.required to make it optional
    })
  }

  fileFormInitlize() {
    this.fileForm = this.fb.group({
      //FileName:['',Validators.required],
      //FileType:['',Validators.required],
      FileData: [null, Validators.required],
      //AppointmentId:[null,Validators.required]
    })

  }

searchData(data: string) {
  this.searchResults = [];
  const search = data.trim().toLowerCase();

  this.searchResults = this.allPatients.filter(p =>
    (p.firstName && p.firstName.toLowerCase().startsWith(search)) ||
    (p.lastName && p.lastName.toLowerCase().startsWith(search)) ||
    (p.mobile && p.mobile.toLowerCase().startsWith(search)) ||
    (p.email && p.email.toLowerCase().startsWith(search))
  );
}

  postDatatoAppointment(id: number) {
    this.flag = true;
    this.patientAppointmentData = [];
    this.patientId = id;
    
    // Find the selected patient from the available patient data
    let selectedPatient = null;
    
    // First check in search results
    if (this.searchResults.length > 0) {
      selectedPatient = this.searchResults.find(patient => patient.patientId === id);
    }
    
    // If not found in search results, check in all patients
    if (!selectedPatient && this.allPatients.length > 0) {
      selectedPatient = this.allPatients.find(patient => patient.patientId === id);
    }
    
    // If patient found, populate the appointment data
    if (selectedPatient) {
      this.calculateDateDifference(selectedPatient.dob);
      selectedPatient.ageinYear = this.age;
      this.patientAppointmentData = [selectedPatient];
    } else {
      // If patient not found in cached data, fetch from service
      this.patientService.getPatientData(id).subscribe({
        next: (patient: any) => {
          if (patient) {
            this.calculateDateDifference(patient.dob);
            patient.ageinYear = this.age;
            this.patientAppointmentData = [patient];
          }
        },
        error: (error: any) => {
          console.error('Error fetching patient:', error);
          this.toater.error('Error loading patient data');
        }
      });
    }

    // Clear search results to show the appointment form
    this.searchResults = [];
  }

  updateFormattedDateTime(event: any) {
    if (!event.value) return;

    // Convert the date to a proper Date object
    this.formattedDateTime = new Date(event.value);
  }

  bookAppointment(appointment: any) {
    // Remove strict form validity check for optional appointTime
    if (
      this.bookappointment.get('date')?.valid &&
      this.bookappointment.get('doctorId')?.valid &&
      this.bookappointment.get('notes')?.valid &&
      this.bookappointment.get('appointmentStatus')?.valid &&
      this.bookappointment.get('departmentid')?.valid
    ) {
      let formattedTime = "";
      let hour = 0;
      let minute = 0;
      if (appointment.value.appointTime) {
        const appointTime = new Date(appointment.value.appointTime);
        hour = appointTime.getHours();
        minute = appointTime.getMinutes();
        let ampm = hour >= 12 ? 'PM' : 'AM';
        let displayHour = hour % 12;
        displayHour = displayHour ? displayHour : 12;
        formattedTime = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
      }

      const datePart = this.bookappointment.value.date;      // e.g., "2025-07-01"
      let dateObj: Date;
      if (typeof datePart === 'string') {
        dateObj = new Date(datePart);
      } else {
        dateObj = datePart;
      }

      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1; // getMonth() is zero-based
      const day = dateObj.getDate();

      // Only set hour/minute if appointTime is present, else default to 0
      // Create UTC date directly without timezone conversion
      let combinedDateTimeUTC = new Date(Date.UTC(year, month - 1, day, hour, minute));

      const userData = JSON.parse(localStorage.getItem('data') || '');
      this.appointmentDto.date = combinedDateTimeUTC;
      this.appointmentDto.doctorId = appointment.value.doctorId;
      this.appointmentDto.notes = appointment.value.notes;
      this.appointmentDto.patientId = this.patientId;
      this.appointmentDto.appointmentStatus = appointment.value.appointmentStatus;

      this.appointmentDto.appointTime = formattedTime || '';

      this.appointmentDto.scheduledByid = userData.loginId;
      this.appointmentService.createAppointment(this.appointmentDto).subscribe(result => {

        this.toater.success("Appointment booked succesfully", "Book Appointment");
        this.bookappointment.reset();
        this.invoiceService.invoiceId = result.invoiceId;
        // If you want to go to profile after booking, pass vitalId and consultationId
        // this.route.navigate([routes.profile], { queryParams: { patientId: this.patientId, vitalId: result.vitalId, consultationId: result.consultationId } });
        this.route.navigate(['/accounts/invoice-view']);
      });
    } else {
      this.bookappointment.markAllAsTouched();
    }
  }

  getDepartmentLits() {
    this.departmentService.getDepartmentList().subscribe((data: any) => {

      data.map((res: any) => {
        if (res.departmentName != 'admin') {
          this.departmentList.push(res)
        }

      })

    })
  }
  async loadDoctorData(event: any) {
    this.doctorList = [];
    const doctorOnLeave: number[] = [];
    const allDocSchedule: Istaffschedule[] = [];

    this.appointmentDto.departmentid = event.value;

    await this.staffScheduleService.getStaffOnLeve(event.value, this.formattedDateTime).subscribe(res => {
      if (res.length > 0) {
        res.map(e => doctorOnLeave.push(e.staffId))
      }
    })
    await this.staffService.getScheduleList().subscribe(data => {

      data.forEach(item => {
        allDocSchedule.push(item)
      })
    })
    await this.staffService.getDoctorsListByDepartment(event.value).subscribe((data: any) => {

      data.map((res: any) => {


        const available = doctorOnLeave.find(e => e == res.staffId)

        if (!available) {
          if (this.bookappointment.value.appointTime != null) {

            const docschedule: any = allDocSchedule.find(item =>
              item.staffId == res.staffId &&
              item.scheduleDate.getTime() === this.formattedDateTime.getTime() &&
              item.leaveStatus == 1 &&
              item.status == "Approved"
            );

            if (docschedule && docschedule.fromTime != '' && docschedule.toTime != '') {
              const fromTime: any = this.convertToComparableTime(docschedule.fromTime, docschedule.fromPostfix);
              const toTime: any = this.convertToComparableTime(docschedule.toTime, docschedule.toPostfix);

              // Check if appointment time falls within doctor's available time range
              if (!this.isTimeBetween(this.bookappointment.value.appointTime, fromTime, toTime)) {

                this.doctorList.push(res);
              }
            }
            else {

              this.doctorList.push(res);
            }
          }
          else {

            this.doctorList.push(res);
          }
        }
      })
    })
  }

  convertToComparableTime(time: string, postfix: string): Date | null {
    if (!time) return null;

    // Parse time string to date object
    const parsedTime = new Date(`2000-01-01 ${time} ${postfix}`);
    return parsedTime;
  }

  isTimeBetween(appointmentTime: Date, fromTime: Date, toTime: Date): boolean {
    const appointmentHours = appointmentTime.getHours();
    const appointmentMinutes = appointmentTime.getMinutes();


    const fromHours = fromTime.getHours();
    const fromMinutes = fromTime.getMinutes();
    const toHours = toTime.getHours();
    const toMinutes = toTime.getMinutes();

    const appointmentTotalMinutes = appointmentHours * 60 + appointmentMinutes;
    const fromTotalMinutes = fromHours * 60 + fromMinutes;
    const toTotalMinutes = toHours * 60 + toMinutes;

    return appointmentTotalMinutes >= fromTotalMinutes && appointmentTotalMinutes <= toTotalMinutes;
  }


  addFee(event: any) {

    const value = this.doctorList.find(result => result.staffId == event.value)
    if (value) {
      this.appointmentDto.fee = value.consultationFee;
    }

  }

  OnCancel() {
    this.patientAppointmentData = []
    this.flag = false
    this.route.navigate([routes.appointmentList])
  }
}
