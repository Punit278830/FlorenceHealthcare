import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';


interface Slot {
  date: string;
  from: string;
  to: string;
}

interface DepartmentOption {
  value: string;
}

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {
  public routes = routes;
  public selectedValue!: string;
  public minDate: Date = new Date();
  public form!: FormGroup;

  doctorId = 'doctor123';

  selectedList: DepartmentOption[] = [
    { value: 'Choose Department' },
    { value: 'Cardiology' },
    { value: 'Urology' },
    { value: 'Radiology' }
  ];

  notes: string = '';
  status: string = 'Active';

  availableSlots: Slot[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date: ['', Validators.required],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required]
    });
  }

  addSlot(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fill all fields before adding a slot.');
      return;
    }
    

    const { date, fromTime, toTime } = this.form.value;

    this.availableSlots.push({
      date,
      from: fromTime,
      to: toTime
    });

    // Reset time fields only
    this.form.patchValue({ fromTime: '', toTime: '' });
  }

  saveSchedule(): void {
    const payload = {
      doctorId: this.doctorId,
      department: this.selectedValue,
      slots: this.availableSlots,
      notes: this.notes,
      status: this.status
    };

    console.log('Saving schedule:', payload);
    alert('Schedule saved (mocked). Check console log for payload.');
  }

  setStatus(value: string): void {
    this.status = value;
  }
}
