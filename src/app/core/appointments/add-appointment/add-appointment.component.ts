import { DatePipe, formatNumber } from '@angular/common';
import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../../shared/Services/appointment/appointment.service';
import { StaffScheduleService } from '../../../shared/Services/appointment/staff-schedule.service';
import { DepartmentService } from '../../../shared/Services/department/department.service';
import { FileUploadService } from '../../../shared/Services/fileUpload/file-upload.service';
import { PatientService } from '../../../shared/Services/patient/patient.service';
import { StaffService } from '../../../shared/Services/staff/staff.service';
import { ModalServiceService } from '../../../shared/modalService/modal-service.service';
import { Iappointment, Idepartment, IfileUpload, IpatientInfo, IstaffInfo, Istaffschedule, pageSelection } from '../../../shared/models/models';
import { routes } from '../../../shared/routes/routes';
import { InvoiceService } from '../../../shared/Services/invoice/invoice.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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
export class AddAppointmentComponent implements OnInit {
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
  constructor(private patierntService: PatientService, 
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
    private patientService: PatientService,
    private modalservice: ModalServiceService,

  ) {

    this.getDepartmentLits();
    this.getTableData()




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
        this.getTableData()
      }
    })

  }

  private getTableData(): void {

    this.patientlist = [];
    this.serialNumberArray = [];

    this.patientService.getPatientList().subscribe((data: any) => {
      this.totalData = data.length;
      // this.staffList.push(data);

      console.log(data)
      data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.calculateDateDifference(res.dob);
          res.ageinYear = this.age;

          this.patientlist.push(res);
          console.log(res.DOJ)
          this.serialNumberArray.push(serialNumber);
        }
      });

      this.calculateTotalPages(this.totalData, this.pageSize);

    })

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
    if(this.patierntService.patientId && localStorage.getItem('lastPath')==='patientList')
    {
      this.postDatatoAppointment(this.patierntService.patientId);
      localStorage.removeItem('lastPath');
      this.patientService.patientId =0;
    }
    //this.updateFormattedDateTime();
    //this.downloadPatientFile();

    this.bookappointment.get('appointTime')?.valueChanges.subscribe(() => {
      this.clearOtherFields();
    });


  }

  clearOtherFields(){
    this.bookappointment.patchValue({
      
      doctorId: '',
      departmentid:''
      

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
      appointTime: ['', Validators.required],

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
    if (!data || data.trim() === '') {
      return;
    }
    this.patierntService.getPatientList().subscribe((patients: any[]) => {
      const search = data.trim().toLowerCase();
      this.searchResults = patients.filter(p =>
        (p.firstName && p.firstName.toLowerCase().includes(search)) ||
        (p.lastName && p.lastName.toLowerCase().includes(search)) ||
        (p.mobile && p.mobile.toLowerCase().includes(search)) ||
        (p.email && p.email.toLowerCase().includes(search))
      );
    });
  }
  // ngAfterViewInit()
  // {
  //    const inputField:HTMLInputElement=this.searchInput.nativeElement;
  //    inputField.value=''
  // }

  postDatatoAppointment(id: number) {
    this.flag = true;
    this.patientAppointmentData = [];
    //const inputField:HTMLInputElement=this.searchInput.nativeElement;
    this.patientId = id;
    if (this.searchResults.length > 0) {
      this.searchResults.filter(res => {
        if (res.patientId == id) {
          this.age = this.appointmentService.calculateDateDifference(res.dob)
          res.ageinYear = this.age;
          this.patientAppointmentData.push(res)

        }
      })
    }
    else {
      this.patientService.getPatientData(id).subscribe(res => {
        this.age = this.appointmentService.calculateDateDifference(res.dob)
        res.ageinYear = this.age;
        this.patientAppointmentData.push(res)
      })


    }


    this.searchResults = [];
    //inputField.value=''
    console.log("appointmentData", this.patientAppointmentData);
    //this.route.navigate([routes.addAppointment])

  }

  updateFormattedDateTime(event: any) {
    if (!event.value) return;

    // Convert the date to a proper Date object
    this.formattedDateTime = new Date(event.value);

    console.log("formattedDateTime", this.formattedDateTime);
    this.bookappointment.patchValue({
      date: this.formattedDateTime
    });
  }

  bookAppointment(appointment: any) {
    if (this.bookappointment.valid) {
      let formattedTime = "";
      if (this.bookappointment.get('appointTime')?.value) {
        console.log("value", this.bookappointment.get('appointTime')?.value);
        const appointTime = dayjs(this.bookappointment.get('appointTime')?.value).tz('Asia/Kolkata');

        let hours = appointTime.hour();
        let minutes = appointTime.minute();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)

        formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }

      const userData = JSON.parse(localStorage.getItem('data') || '');
      // Send ISO string in IST to backend for correct date/time
      this.appointmentDto.date = dayjs(this.bookappointment.get('date')?.value).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ssZ');
      this.appointmentDto.doctorId = appointment.value.doctorId;
      this.appointmentDto.notes = appointment.value.notes;
      this.appointmentDto.patientId = this.patientId;
      this.appointmentDto.appointmentStatus = appointment.value.appointmentStatus;

      this.appointmentDto.appointTime = formattedTime;
      console.log("tme", this.appointmentDto);
      this.appointmentDto.scheduledByid = userData.loginId;
      this.appointmentService.createAppointment(this.appointmentDto).subscribe(result => {
        console.log("Appointment created successfully", result);
        this.toater.success("Appointment created successfully");
        this.invoiceService.invoiceId = result.invoiceId;
        this.route.navigate(['/accounts/invoice-view']);
      }, error => {
        console.error("Error creating appointment", error);
        this.toater.error("Failed to create appointment");
      });
    } else {
      this.bookappointment.markAllAsTouched();
    }



  }
  // calculateDateDifference(dob:Date) {
  //   const start = new Date(dob);
  //   const end = new Date();
  //   // Calculate the difference in years
  //   const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
  //   const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

  //   this.age = yearsDifference;

  // }

  getDepartmentLits() {
    this.departmentService.getDepartmentList().subscribe((data: any) => {
      console.log(data);
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
    console.log(event.value);
    this.appointmentDto.departmentid = event.value;

    await this.staffScheduleService.getStaffOnLeve(event.value, this.formattedDateTime).subscribe(res => {
      if (res.length > 0) {
        res.map(e => doctorOnLeave.push(e.staffId))
      }
    })
    await this.staffService.getScheduleList().subscribe(data => {
      console.log("schedule ress", data)
      data.forEach(item => {
        allDocSchedule.push(item)
      })
    })
    await this.staffService.getDoctorsListByDepartment(event.value).subscribe((data: any) => {
      console.log("doctoronleave", doctorOnLeave);
      data.map((res: any) => {
        console.log("doc res", res);
        
        const available = doctorOnLeave.find(e => e == res.staffId)
        console.log("doc avai", available);
        if (!available) {
          if (this.bookappointment.value.appointTime != null) {
            console.log("entered book appoint.time")
            const docschedule: any = allDocSchedule.find(item => 
              item.staffId == res.staffId && 
              item.scheduleDate.getTime() === this.formattedDateTime.getTime() && 
              item.leaveStatus == 1 && 
              item.status == "Approved"
            );
            console.log("doc sche", docschedule);
            if (docschedule && docschedule.fromTime != '' && docschedule.toTime != '') {
              const fromTime: any = this.convertToComparableTime(docschedule.fromTime, docschedule.fromPostfix);
              const toTime: any = this.convertToComparableTime(docschedule.toTime, docschedule.toPostfix);
              
              // Check if appointment time falls within doctor's available time range
              if (!this.isTimeBetween(this.bookappointment.value.appointTime, fromTime, toTime)) {
                console.log("Doctor added based on time:", res);
                this.doctorList.push(res);
              }
            }
            else {
              console.log("Doctor added without time check:", res);
              this.doctorList.push(res);
            }
          }
          else {
            console.log("Doctor added without appointTime value entered:", res);
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
    console.log("app 1",appointmentHours)
    console.log("app 1",appointmentMinutes)
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

  //   onUpload()
  //   {
  //     if (this.selectedFile) {

  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.base64String = reader.result as string;
  //       this.FileUploadDto.FileName=this.selectedFile.name;
  //       this.FileUploadDto.FileType=this.selectedFile.type;
  //       this.FileUploadDto.FileData=this.base64String;
  //       //this.FileUploadDto.FileData= this.base64String;
  //       this.FileUploadDto.AppointmentId=18;
  //       this.fileUploadService.uploadFiletoDataBase(this.FileUploadDto).subscribe(result=>{
  //       console.log(result);
  //       })
  //       };

  //       reader.readAsDataURL(this.selectedFile);



  //   }
  // }

  //   onFileSelected(event: any): void {
  //     this.selectedFile = event.target.files[0];
  //   }
  //   deleteIconFunc()
  //   {
  //     this.deleteIcon = !this.deleteIcon
  //   }

  //   downloadPatientFile()
  //   {
  //     const id=18;

  //     this.base64StringArray=[];
  //     this.fileUploadService.getUpodedFileByAppointment(id).subscribe((data:any)=>{

  //       JSON.parse(data).map((res:any)=>{
  //       //   const x=JSON.parse(res).fileData||'';
  //       //    const fileName=JSON.parse(data).fileName;
  //       // const type=JSON.parse(data).fileType;
  //       const addDownloads={fileName:'',downloadLink:''};
  //       const x=res.fileData||'';
  //          this.downlodedFileName=res.fileName;
  //       const type=res.fileType;
  //       if(x)
  //       {
  //         let base64Data
  //         if(type=='image/jpeg')
  //         {
  //           base64Data=(x.split('jpeg;base64,'))[1]
  //         }
  //         if(type=='application/pdf')
  //         {
  //           base64Data=(x.split('pdf;base64,'))[1]
  //         }

  //     const byteCharacters = atob(base64Data);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //    const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], { type: 'application/octet-stream' });
  //     const objectUrl = URL.createObjectURL(blob);
  //     addDownloads.fileName=this.downlodedFileName;
  //     addDownloads.downloadLink=objectUrl;
  //     this.downLoadList.push(addDownloads);
  //     console.log("downLoadList"+this.downLoadList);

  //   //   this.downloadLink = document.createElement('a');
  //   //  this.downloadLink.href = objectUrl;
  //   //  this.downloadLink.download = fileName;   // Specify the filename here



  //     // Append the link to the DOM

  //     //document.body.appendChild(this.downloadLink);


  //       }

  //       })

  //       // const x=JSON.parse(data).fileData||'';
  //       // const fileName=JSON.parse(data).fileName;
  //       // const type=JSON.parse(data).fileType;

  //        //const base64Data=(x.split('jpeg;base64,'))[1]
  //      // const byteCharacters = atob(base64Data);
  //     //const byteNumbers = new Array(byteCharacters.length);
  //     // for (let i = 0; i < byteCharacters.length; i++) {
  //     //   byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     // }
  //    // const byteArray = new Uint8Array(byteNumbers);
  //     //const blob = new Blob([byteArray], { type: 'application/octet-stream' });

  //     // Create an object URL
  //    // const objectUrl = URL.createObjectURL(blob);

  //     // Create a link with the object URL
  //    // this.downloadLink = document.createElement('a');
  //    // this.downloadLink.href = objectUrl;
  //    // this.downloadLink.download = fileName; // Specify the filename here

  //     // Append the link to the DOM
  //     //document.body.appendChild(this.downloadLink);

  //     // Programmatically click on the link to trigger the download




  //      // })
  //       // this.base64StringArray.map(base64Data=>{


  //     })

  //   }
  //   downloadFile()
  //   {
  //     this.downloadLink.click();
  //   }

  OnCancel() {
    this.patientAppointmentData = []
    this.flag = false
    this.route.navigate([routes.appointmentList])
  }
}
