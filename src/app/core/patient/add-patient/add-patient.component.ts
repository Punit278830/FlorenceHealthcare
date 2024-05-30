import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { subtract } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { IpatientInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';


interface data {
  value: string;
}
@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
  providers: [DatePipe],
})
export class AddPatientComponent implements OnInit {
  public routes = routes;
  public selectedValue!: string;
  public patientReg!: FormGroup;
  private _patientDto!: IpatientInfo;
  public camerastatus: any;
  public trigger: Subject<void> = new Subject();
  public previewImage!: string;
  public btnLable = 'Capture Image';
  public RegrestationDate = '';
  public maxDate;

  constructor(private fb: FormBuilder,
    private patientService: PatientService,
    private route: Router, private datePipe: DatePipe,
    private toater: ToastrService) {
      this.maxDate = new Date();


    this.createPatient();
  }
  selectGender = [
    { value: 'Male' },
    { value: 'Female' },
    { value: 'Transgender' },

  ];
  selectedList2: data[] = [
    { value: 'Select City' },
    { value: 'Alaska' },
    { value: 'Los Angeles' },
  ];
  selectedList3: data[] = [
    { value: 'Select Country' },
    { value: 'Usa' },
    { value: 'Uk' },
    { value: 'Italy' },
  ];
  selectedList4: data[] = [
    { value: 'Select State' },
    { value: 'Alaska' },
    { value: 'California' },
  ];

  ngOnInit() {
    const currentDate=this.datePipe.transform(new Date(),'yyyy-MM-dd');
    this.patientReg.get('regstrationDate')?.setValue(currentDate);

  }

  createPatient() {
    this.patientReg = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dob: [null, [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      gender: ['Male', [Validators.required]],
      regstrationDate: [null, Validators.required],


    })
  }
  get mobile(): AbstractControl {
    return this.patientReg.get('mobile') as AbstractControl;
  }

  

  addPatient(patientData: FormGroup) {
    if (patientData.valid) {
      console.log("entered")
      console.log(patientData.value)
      this._patientDto = patientData.value;
      this._patientDto.patientImage = this.previewImage
      //this._patientDto.regstrationDate=parse(dd ,'yyyy-MM-dd', new Date());
      this.patientService.CreatePatient(this._patientDto).subscribe(res => {
        res ? this.toater.success("Patient added successfully", "Add Patient") : null;
        this.resetAddPatientForm();
        this.route.navigate([routes.addAppointment]);
      })


      //this.route.navigate([routes.patientsList]);

    }
   else {
      patientData.markAllAsTouched(); // Mark all controls as touched to trigger error display
    }



  }

  resetAddPatientForm() {
    this.patientReg.reset();
  }

  onDobDateChange(event: any): void {
    // Extract the date part only
    // const datePipe = new DatePipe('en-US');
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.patientReg.get('dob')?.setValue(dateOnly);
    
    
  }
  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }
  enableCamera() {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 100,
        height: 100
      }
    }).then((res) => {
      this.camerastatus = res;
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
    //this.camerastatus=!this.camerastatus;
  }

  captureImage() {
    this.trigger.next();
    console.log()
  }
  snapshot(event: WebcamImage) {

    this.previewImage = event.imageAsDataUrl;
    this.btnLable = 'Re Capture Image';
    this.camerastatus = '';
    console.log(event)
  }
  cancel() {
    this.camerastatus = '';

  }


  changedob(year: any) {
    const currentYear = new Date().getFullYear();
    const y = currentYear - year;

    const dob = y + '/01/01'

    this.patientReg.get('dob')?.patchValue(this.datePipe.transform(dob, 'yyyy-MM-dd'));


  }
}
