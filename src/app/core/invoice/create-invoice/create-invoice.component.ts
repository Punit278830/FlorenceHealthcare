import { Component } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { Iappointment, Idepartment, IinvoiceItem, Ilogin, IpatientInfo, IstaffInfo, Istaffschedule, pageSelection } from '../../../shared/models/models';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { StaffScheduleService } from 'src/app/shared/Services/appointment/staff-schedule.service';
import { DatePipe } from '@angular/common';
import { InvoiceService } from '../../../shared/Services/invoice/invoice.service';



interface data {
  value: string;
}
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  providers: [DatePipe]
})
export class CreateInvoiceComponent {
  public routes = routes;
  public selectedValue !: string;
  public bookappointment!: FormGroup;

  private formattedDateTime: any;

  public searchResults: IpatientInfo[] = [];
  public patientAppointmentData: IpatientInfo[] = [];
  public flag: boolean = false;
  public age!: number;
  private patientId!: number;

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
  public doctorList: IstaffInfo[] = [];
  public appointmentDto: Iappointment = {} as Iappointment;
  public departmentList: Idepartment[] = [];

  public totalPages = 0;

  public addItemFormGroup!: FormGroup;
  public invoiceItemForm!: FormGroup;
  public allnvoiceItems: any[] = [];
  public total = 0;
  private IinvoiceDto!: IinvoiceItem;
  public addItemflag: boolean = false;
  private loggedInUser!: Ilogin;


  constructor(private patientService: PatientService,
    private modalservice: ModalServiceService,
    private toaster: ToastrService,
    private appointmentService: AppointmentService,
    private route: Router,
    private fb: FormBuilder,
    private staffService: StaffService,
    private staffScheduleService: StaffScheduleService,
    private datePipe: DatePipe,
    private invoiceService: InvoiceService
  ) {
    this.getTableData();

    this.initlizeInvoiceMasterForm();
    this.InitlizeInvoiceItemForm();
    this.getInvoiceMaster();
    this.addItemFormGroup.get('discount')?.valueChanges.subscribe(() => {
      console.log("dis fee", this.addItemFormGroup.get('discount')?.value, this.addItemFormGroup.get('fee')?.value)
      this.updateTotal(this.addItemFormGroup.get('discount')?.value, this.addItemFormGroup.get('fee')?.value);
    });
  }

  bookAppointment(appointment: any) {
    if (this.bookappointment.valid) {
      let formattedTime = ""
      if (appointment.value.appointTime) {
        console.log("value", appointment.value.appointTime)
        const appointTime = new Date(appointment.value.appointTime);

        let hours = appointTime.getHours();
        let minutes = appointTime.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)

        formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }




      const userData = JSON.parse(localStorage.getItem('data') || '');
      this.appointmentDto.date = this.formattedDateTime;
      this.appointmentDto.doctorId = appointment.value.doctorId;
      this.appointmentDto.notes = appointment.value.notes;
      this.appointmentDto.patientId = this.patientId;
      this.appointmentDto.appointmentStatus = appointment.value.appointmentStatus;

      this.appointmentDto.appointTime = formattedTime;
      console.log("tme", this.appointmentDto)
      //this.appointmentDto.departmentId=3;
      this.appointmentDto.scheduledByid = userData.loginId;
      this.appointmentService.createAppointment(this.appointmentDto).subscribe(result => {
        console.log("result", result);
        this.toaster.success("Appointment booked succesfully", "Book Appointment");
        this.bookappointment.reset();
        this.route.navigate([routes.invoices])

      });

    }
    else {
      this.bookappointment.markAllAsTouched();
    }



  }

  appointmentFormInitlize() {
    this.bookappointment = this.fb.group({
      date: ['', Validators.required],
      doctorId: ['', Validators.required],
      notes: ['', Validators.required],
      appointmentStatus: ['Active', Validators.required],

      departmentid: ['', Validators.required],
      appointTime: [null],

    })
  }

  selectedList1: data[] = [
    { value: 'Select  Department' },
    { value: 'Orthopedics' },
    { value: 'Radiology' },
    { value: 'Dentist' },
  ];
  selectedList2: data[] = [
    { value: 'Select  Tax' },
    { value: 'VAT' },
    { value: 'GST' },
    { value: 'No GST' },
  ];
  selectedList3: data[] = [
    { value: 'Select Payment Method' },
    { value: 'Debit Card' },
    { value: 'Gpay' },
  ];
  selectedList4: data[] = [
    { value: 'Select  Tax' },
    { value: 'Paid' },
    { value: 'Un Paid' },
    { value: 'Partially Paid' },
  ];


  searchData(data: string) {
    this.searchResults = [];
    this.patientService.serarchPatient(data).subscribe((result: any) => {

      result.map((res: any) => {

        this.searchResults.push(res);
        this.searchResults = this.searchResults.slice(0, 3)
      })
    })
  }


  refresh() {
    this.patientAppointmentData = []
    this.flag = false
  }

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

  addFee(event: any) {

    const value = this.doctorList.find(result => result.staffId == event.value)
    if (value) {
      this.appointmentDto.fee = value.consultationFee;
    }

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
            const docschedule: any = allDocSchedule.find(item => item.staffId == res.staffId && item.scheduleDate == this.formattedDateTime && item.leaveStatus == 1 && item.status == "Approved")
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
    console.log("app 1", appointmentHours)
    console.log("app 1", appointmentMinutes)
    const fromHours = fromTime.getHours();
    const fromMinutes = fromTime.getMinutes();
    const toHours = toTime.getHours();
    const toMinutes = toTime.getMinutes();

    const appointmentTotalMinutes = appointmentHours * 60 + appointmentMinutes;
    const fromTotalMinutes = fromHours * 60 + fromMinutes;
    const toTotalMinutes = toHours * 60 + toMinutes;

    return appointmentTotalMinutes >= fromTotalMinutes && appointmentTotalMinutes <= toTotalMinutes;
  }



  calculateDateDifference(dob: Date) {
    const start = new Date(dob);
    const end = new Date();
    // Calculate the difference in years
    const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
    const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    this.age = yearsDifference;

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
        this.toaster.success("Patient is deleted!")
        this.getTableData()
      }
    })

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

  OnCancel() {
    this.patientAppointmentData = []
    this.flag = false
    this.route.navigate([routes.appointmentList])
  }

  updateFormattedDateTime(event: any) {
    const currentDate = new Date();
    console.log("currentDate" + currentDate)

    this.formattedDateTime = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    //this.formattedDateTime=currentDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
    console.log("formattedDateTime" + this.formattedDateTime);
    this.bookappointment.get('doctorId')?.patchValue('');
    this.bookappointment.get('departmentid')?.patchValue('');
    this.bookappointment.get('appointTime')?.patchValue(null);

    //this.bookappointment.get('')?.patchValue('')
  }

  getInvoiceMaster() {
    this.invoiceService.getAllInvoiceMaster().subscribe(res => {
      this.allnvoiceItems = res;
    })
  }

  InitlizeInvoiceItemForm() {
    this.addItemFormGroup = this.fb.group({
      itemName: [{ value: '', disabled: true }, Validators.required],
      description: [{ value: '', disabled: true }, Validators.required],
      discount: [{ value: '', disabled: false }, Validators.required],
      fee: [{ value: '', disabled: true }, Validators.required],
      finalAmount: [{ value: '', disabled: true }, Validators.required]
    });
  }

  initlizeInvoiceMasterForm() {
    this.invoiceItemForm = this.fb.group({
      InvoiceItem: ['', Validators.required]
    })
  }

  addItemToInvoice(event: any) {
    const id = event.value;
    const data = this.allnvoiceItems.find(e => e.itemId == id)
    this.addItemFormGroup.get('itemName')?.patchValue(data.itemName);
    this.addItemFormGroup.get('description')?.patchValue(data.description);
    this.addItemFormGroup.get('discount')?.patchValue(data.discount);
    this.addItemFormGroup.get('fee')?.patchValue(data.fee);
    this.updateTotal(data.discount, data.fee);
    this.addItemflag = true;
  }

  submitItemToInvoice(formData: FormGroup) {
    this.IinvoiceDto = formData.getRawValue();
    this.IinvoiceDto.createdBy = this.loggedInUser.loginId;
    this.IinvoiceDto.invoiceId = this.invoiceService.invoiceId;
    this.IinvoiceDto.status = 'un Paid';
    //delete this.IinvoiceDto.total;
    this.invoiceService.addToaddtionalItemInvoice(this.IinvoiceDto).subscribe(res => {
      this.toaster.success("Item Added to Invoice", "Invoice Item");
      this.addItemFormGroup.reset();
      this.invoiceService.invoiceId = this.IinvoiceDto.invoiceId;
      this.route.navigate(['/accounts/invoice-view'])

    })



  }

  updateTotal(dis: any, fee: any) {
    if (dis <= 0) {
      this.addItemFormGroup.get('finalAmount')?.patchValue(fee);
    }
    else {

      this.total = fee - (fee * dis / 100);
      console.log("total", this.total)
      this.total = Math.round(this.total);
      console.log("total", this.total)
      this.addItemFormGroup.get('finalAmount')?.patchValue(this.total);
    }
  }
}
