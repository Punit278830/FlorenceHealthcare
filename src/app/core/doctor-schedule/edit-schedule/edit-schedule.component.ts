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
    { value: 'pending', label: 'Pending' },
    { value: 'approve', label: 'Approve' },
    { value: 'cancel', label: 'Cancel' }
    // Add more options as needed
  ];

  ngOnInit(): void {

    this.setScheduleData();

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
      notes:['']    })

  }
  setScheduleData() {
    this.staffScheduleService.getSelectedSchedule(this.scheduleId).subscribe(data => {
      console.log("data", data)
      this.schedule.patchValue(data)
      this.schedule.get('status')?.setValue(data.status||'pending');
      
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
    
    this.scheduleDto = myschedule.value;
    console.log("schelduledto", this.scheduleDto)
    this.staffScheduleService.updateSchedule(this.scheduleId, this.scheduleDto).subscribe((data) => {
      console.log("update response", data)
      this.route.navigate([routes.schedule])
    })
  }


}
