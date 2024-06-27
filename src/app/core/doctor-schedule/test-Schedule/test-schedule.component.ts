import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StaffScheduleService } from 'src/app/shared/Services/appointment/staff-schedule.service';
import { Ilogin, Istaffschedule } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';


@Component({
  selector: 'app-test-schedule',
  templateUrl: './test-schedule.component.html',
  styleUrls: ['./test-schedule.component.scss'],
  providers: [DatePipe],
})

export class TestScheduleComponent implements OnInit {
  public routes = routes;
  public scheduleGroup!: FormGroup;
  private _staffScheduleDto!: Istaffschedule;
  public formattedDateTime!: any;
  public scheduleList: any[] = [];
  public img = "assets/img/profiles/avatar-08.jpg";
  public loggedInUser!: Ilogin;
  public enableEdit = false;
  public blockedDates: Date[] = [];
  public leaveCheckBoxStatus = false;
  public leaveOption = [
    { key: "No", value: 1 },
    { key: "Yes", value: 2 }];
  public minDate:Date | null=null;

  constructor(private fb: FormBuilder,
    private staffScheduleService: StaffScheduleService,
    private datePipe: DatePipe,
    private toster: ToastrService,private route : Router) {

    this.loggedInUser = JSON.parse(localStorage.getItem('data') || '')
    this.showAdujestmentSchedule(this.loggedInUser.loginId);
  }



  ngOnInit() {
    this.initlizeScheduleForm();
    this.minDate=new Date();

    this.scheduleGroup.get('leaveStatus')?.valueChanges.subscribe(value => {
      this.leaveCheckBoxStatus = value === 2;
      this.setConditionalValidators(this.leaveCheckBoxStatus);
    });

    // Initialize validators based on initial leaveStatus value
    this.setConditionalValidators(this.leaveCheckBoxStatus);
  }

  initlizeScheduleForm() {
    this.scheduleGroup = this.fb.group({
      // scheduleDate: ['', Validators.required],
      // fromTime: ['', Validators.required],
      // fromPostfix: ['', Validators.required],
      // toTime: ['', Validators.required],
      // toPostfix: ['', Validators.required],
      // leaveStatus: [1, Validators.required],
      // notes: ['', Validators.required]
      leaveStatus: [1, Validators.required],
      scheduleDate: [''],
      fromTime: [''],
      fromPostfix: [''],
      toTime: [''],
      toPostfix: [''],
      notes: ['']

    })
  }


  setConditionalValidators(leaveCheckBoxStatus:boolean) {
    const fromTime = this.scheduleGroup.get('fromTime');
    const fromPostfix = this.scheduleGroup.get('fromPostfix');
    const toTime = this.scheduleGroup.get('toTime');
    const toPostfix = this.scheduleGroup.get('toPostfix');
    const scheduleDate = this.scheduleGroup.get('scheduleDate');
    const notes = this.scheduleGroup.get('notes');

    if (leaveCheckBoxStatus === false) {
      fromTime?.setValidators([Validators.required]);
      fromPostfix?.setValidators([Validators.required]);
      toTime?.setValidators([Validators.required]);
      toPostfix?.setValidators([Validators.required]);
      scheduleDate?.setValidators([Validators.required]);
      notes?.setValidators([Validators.required]);
    } else if (leaveCheckBoxStatus === true) {
      fromTime?.clearValidators();
      fromPostfix?.clearValidators();
      toTime?.clearValidators();
      toPostfix?.clearValidators();
      scheduleDate?.setValidators([Validators.required]);
      notes?.setValidators([Validators.required]);
    }

    // Recalculate validation status
    fromTime?.updateValueAndValidity();
    fromPostfix?.updateValueAndValidity();
    toTime?.updateValueAndValidity();
    toPostfix?.updateValueAndValidity();
    scheduleDate?.updateValueAndValidity();
    notes?.updateValueAndValidity();
  }






  public DayTime = ["1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00"];
  public postFix = ['AM', 'PM']



  submitschedule(scheduleData: FormGroup) {
    console.log(scheduleData.valid);
    if (scheduleData.valid) {
      //this._staffScheduleDto=scheduleData.value;  
      console.log(scheduleData.value);

      this.leaveCheckBoxStatus ? this.scheduleGroup.get('leaveStatus')?.setValue(2) : this.scheduleGroup.get('leaveStatus')?.setValue(1);
      this._staffScheduleDto = this.scheduleGroup.value;
      this._staffScheduleDto.staffId = this.loggedInUser.loginId;
      this._staffScheduleDto.departmentId = this.loggedInUser.departmentId;
      this._staffScheduleDto.status = 'pending';
      //  this._staffScheduleDto.name=`${this.loggedInUser.fname} ${this.loggedInUser.lname}`
      console.log("staffschedule", this._staffScheduleDto)
      this.staffScheduleService.addStaffSchedule(this._staffScheduleDto).subscribe(res => {
        console.log(res);
        this.showAdujestmentSchedule(this.loggedInUser.loginId);
        this._staffScheduleDto.leaveStatus == 1 ? this.toster.success("Schedule adjusted Successfully", "Success") : this.toster.success("Leave apply successfully", "Success");
        this.scheduleGroup.reset();
      })

    }else{
      this.scheduleGroup.markAllAsTouched();
    }

  }

  applyLeave() {
    this.scheduleGroup.get('leaveStatus')?.setValue(2);
    this._staffScheduleDto = this.scheduleGroup.value;
    this._staffScheduleDto.staffId = this.loggedInUser.loginId;
    this._staffScheduleDto.departmentId = this.loggedInUser.departmentId;
    this.staffScheduleService.addStaffSchedule(this._staffScheduleDto).subscribe(res => {
      console.log(res);
      this.showAdujestmentSchedule(this.loggedInUser.loginId);
      this.toster.success("Leave Apply Successfully", "Apply Leave")
    })

  }
  setLeaveValue(event: any) {
    if (event.value == 2) {
      this.leaveCheckBoxStatus = true
    }

    if (event.value == 1) {
      this.leaveCheckBoxStatus = false;
    }

  }

  onDateChange(event: any): void {
    // Extract the date part only
    // const datePipe = new DatePipe('en-US');
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    console.log('Selected Date (Date Only):', dateOnly);
    this.scheduleGroup.get('scheduleDate')?.setValue(dateOnly);
  }

  Cancel() {
    this.route.navigate([routes.schedule]);
  }

  showAdujestmentSchedule(id: number) {
    this.blockedDates = [];
    this.staffScheduleService.getStaffScheduleByStaffId(id).subscribe(res => {
      console.log(res);
      res.map(result => {

        this.blockedDates.push(new Date(result.scheduleDate));
      })
      this.scheduleList = res;
    })
  }

  modifySchedule(event: Event) {
    this.enableEdit = true;
    const scheduleId = parseInt((event.target as HTMLButtonElement).value);

    this.scheduleList.map(result => {
      if (result.scheduleId == scheduleId) {
        const lessDate = this.DateCompareFromToday(new Date(result.scheduleDate))
        if (lessDate) {
          this.staffScheduleService.getSelectedSchedule(scheduleId).subscribe(res => {
            console.log(res);
            this.staffScheduleService.scheduleId = res.scheduleId;
            if (res.leaveStatus == 2) {
              this.scheduleGroup.get('scheduleDate')?.patchValue(res.scheduleDate);
              this.scheduleGroup.get('leaveStatus')?.patchValue(res.leaveStatus);
            }
            else {
              this.scheduleGroup.patchValue(res);
            }

          })
        }
        else {
          this.toster.error("Record cann't be Modify as schedule date less then one day", "Error");
        }

      }
    })


    // this.staffScheduleService.getSelectedSchedule(scheduleId).subscribe(res=>{
    // console.log(res);
    // this.staffScheduleService.scheduleId=res.scheduleId;
    //   if(res.leaveStatus==2)
    //   {
    //     this.scheduleGroup.get('scheduleDate')?.patchValue(res.scheduleDate);
    //     this.scheduleGroup.get('leaveStatus')?.patchValue(res.leaveStatus);
    //   }
    //   else{
    //     this.scheduleGroup.patchValue(res);
    //   }

    // })

  }

  updateScheduleentry() {
    const id = this.staffScheduleService.scheduleId;
    this._staffScheduleDto = this.scheduleGroup.value;
    //const loggedInUser=JSON.parse(localStorage.getItem('data')||'')
    this._staffScheduleDto.staffId = this.loggedInUser.loginId;
    this._staffScheduleDto.scheduleId = id;

    this._staffScheduleDto.departmentId = this.loggedInUser.departmentId;
    this.staffScheduleService.updateSchedule(id, this._staffScheduleDto).subscribe(res => {
      console.log(res);
      this.showAdujestmentSchedule(this.loggedInUser.loginId);
      this.toster.success("Schedule updated successFully", "Update Schedule");
    })
  }
  dateFilter = (date: Date | null): boolean => {
    // Disable dates in the blockedDates array
    return date !== null && !this.blockedDates.some(blockedDate => this.isSameDay(date, blockedDate));
  };

  isSameDay(date1: Date, date2: Date): boolean {

    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  deleteSchedule(event: any) {
    const scheduleId = parseInt((event.target as HTMLButtonElement).value);
    console.log()
    this.scheduleList.map(result => {
      if (result.scheduleId == scheduleId) {
        const lessDate = this.DateCompareFromToday(new Date(result.scheduleDate))
        if (lessDate) {
          this.staffScheduleService.deleteScheuleById(scheduleId).subscribe(result => {
            console.log(result)
            this.toster.success("Rescore deleted successfully", "Delete schedule")
            this.showAdujestmentSchedule(this.loggedInUser.loginId);
          })
        }
        else {
          this.toster.error("Record cann't be deleted as schedule date less then one day", "Error");
        }

      }
    })

  }

  DateCompareFromToday(scheduleDaate: Date) {
    const pastDate = new Date(scheduleDaate);
    pastDate.setDate(scheduleDaate.getDate() - 1);
    const toDay = new Date();
    return toDay < scheduleDaate
  }
}
