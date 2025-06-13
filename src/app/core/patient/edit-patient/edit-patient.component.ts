import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss'],
  providers: [DatePipe],
})
export class EditPatientComponent implements OnInit {
  public routes = routes;
  public deleteIcon = true;
  public selectedValue!: string;
  public patientReg!: FormGroup;
  private _patientDto!: IpatientInfo;
  private patientId!: number;
  public camerastatus: any;
  public trigger: Subject<void> = new Subject();
  public previewImage!: string;
  public btnLable = 'Capture Image';

  deleteIconFunc() {
    this.deleteIcon = !this.deleteIcon
  }
  constructor(private fb: FormBuilder,
    private patientService: PatientService,
    private route: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService) {

    this.patientId = patientService.patientId;
    this.patientId ? this.createPatient() : this.route.navigate([routes.patientsList]);


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
  IdentityDocNumber = [
    { value: 'Aadhar Card' },
    { value: 'Driving Licence' },
    { value: 'voterID' },
    { value: 'ABHA ID' },
    { value: 'Passport' },

  ]

  ngOnInit() {

    this.getPatientData(this.patientId);
  }

  createPatient() {
    this.patientReg = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      dob: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.email]],
      address: ['', Validators.required],
      gender: ['Male', Validators.required],
      regstrationDate: [null, Validators.required],
      age: [{ value: '', disabled: true }, Validators.required],
      identityNumber: ['', Validators.required],
      identityName: ['', Validators.required],


    })
  }

  getPatientData(id: number) {
    this.patientService.getPatientData(id).subscribe(data => {
      this._patientDto = data;
      this.previewImage = data.patientImage;
      console.log("patientdata",this._patientDto)
    //   this.patientReg.get('IdentiyName')?.patchValue(this._patientDto.IdentityName);
    // this.patientReg.get('IdentiyNumber')?.patchValue(this._patientDto.IdentityNumber);
      this.patientReg.patchValue(this._patientDto);

      if (this._patientDto.dob) {
        this.calculateAndSetAge(this._patientDto.dob);
      }



    })
  }
  private calculateAndSetAge(dob: Date): void {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.patientReg.get('age')?.setValue(age);
  }

  UpdatePatientInfo() {
    if (this.patientReg.valid) {
      console.log(this.patientReg.value)
      this._patientDto = this.patientReg.value;
      this._patientDto.patientId = this.patientId;
      this._patientDto.IdentityName = this.patientReg.value.IdentityName;
      this._patientDto.IdentityNumber = this.patientReg.value.IdentityNumber;
      this._patientDto.patientImage = this.previewImage;
      this.patientService.updatePatientData(this.patientId, this._patientDto).subscribe(res => {
        res ? this.toastr.success("Patien info updated Successfully", "Update Patient Info") : null;
        this.route.navigate([routes.patientsList]);
      })
    } else {
      this.patientReg.markAllAsTouched();
    }
  }

  resetAddPatientForm() {
    this.patientReg.reset();
  }
  onDobDateChange(event: any): void {
    // Extract the date part only
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.patientReg.get('dob')?.setValue(dateOnly);

    // Calculate age from date of birth
    const dob = new Date(event.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Set age value in the form
    this.patientReg.get('age')?.setValue(age);
    this.patientReg.get('age')?.disable(); // Enable the age field if it was disabled
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
  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
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
  cancelEdit() {
    this.route.navigate([routes.patientsList])
  }
}
