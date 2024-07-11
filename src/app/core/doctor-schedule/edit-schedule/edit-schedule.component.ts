import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { StaffScheduleService } from 'src/app/shared/Services/appointment/staff-schedule.service';
import { Istaffschedule } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string;
}
@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit {
  public routes = routes;
  public selectedValue !: string;
  public scheduleId!: number;
  private scheduleDto!: Istaffschedule;
  public schedule!: FormGroup;
  public leaveCheckBoxStatus: boolean = false;;
  date = new FormControl(new Date());

  constructor(private fb: FormBuilder, private staffScheduleService: StaffScheduleService, private route: Router) {
    this.scheduleId = this.staffScheduleService.scheduleId;
    this.scheduleId ? this.initializeForm() : this.route.navigate([routes.schedule]);

  }

  selectedList: data[] = [
    { value: 'Choose Department' },
    { value: 'Cardiology' },
    { value: 'Urology' },
    { value: 'Radiology' },
  ];
  public DayTime = ["1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00"];
  public postFix = ['AM', 'PM'];
  statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approve' },
    { value: 'Cancelled', label: 'Cancel' }
    // Add more options as needed
  ];

  ngOnInit(): void {

    this.setScheduleData();

    this.schedule.get('leaveStatus')?.valueChanges.subscribe(value => {
      this.leaveCheckBoxStatus = value === 2;
      this.setConditionalValidators(this.leaveCheckBoxStatus);
    });

    // Initialize validators based on initial leaveStatus value
    this.setConditionalValidators(this.leaveCheckBoxStatus);

  }
  initializeForm() {
    this.schedule = this.fb.group({
      scheduleDate: ['', Validators.required],
      fromTime: ['', Validators.required],
      fromPostfix: ['', Validators.required],
      toTime: ['', Validators.required],
      toPostfix: ['', Validators.required],
      leaveStatus: [1, Validators.required],
      scheduleId: [''] ,
      departmentId: [''] ,
      staffId: [''],
      status :[''],
      notes:['',Validators.required] 
       })

  }


  setConditionalValidators(leaveCheckBoxStatus:boolean) {
    const fromTime = this.schedule.get('fromTime');
    const fromPostfix = this.schedule.get('fromPostfix');
    const toTime = this.schedule.get('toTime');
    const toPostfix = this.schedule.get('toPostfix');
    const scheduleDate = this.schedule.get('scheduleDate');
    const notes = this.schedule.get('notes');

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





  setScheduleData() {
    this.staffScheduleService.getSelectedSchedule(this.scheduleId).subscribe(data => {
      console.log("data", data)
      this.schedule.patchValue(data)
      this.schedule.get('status')?.setValue(data.status||'Pending');
      
      if (data.leaveStatus == 2) {
        this.leaveCheckBoxStatus = true;

      }
    })

  }

  onStatusChange(event: any) {
    const newStatus = event.target.value;
    this.schedule.get('status')?.setValue(newStatus);
  }

  UpdateStaffScheduleInfo(myschedule: FormGroup) {
    if(myschedule.valid){
      this.scheduleDto = myschedule.value;
    console.log("schelduledto", this.scheduleDto)
    this.staffScheduleService.updateSchedule(this.scheduleId, this.scheduleDto).subscribe((data) => {
      console.log("update response", data)
      this.route.navigate([routes.schedule])
    })

    }
    else{
      myschedule.markAllAsTouched();
    }
    
    
  }


}
