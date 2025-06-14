import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';
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
  public months!:number;
  displayAge: string = '';

  constructor(private fb: FormBuilder,
    private patientService: PatientService,
    private route: Router, private datePipe: DatePipe,
    private toastr: ToastrService,
    private loadingService: LoadingService) {
    this.maxDate = new Date();


    this.createPatient();
  }
  IdentityDocNumber = [
    { value: 'Aadhar Card' },
    { value: 'Driving Licence' },
    { value: 'voterID' },
    { value: 'ABHA ID' },
    { value: 'Passport' },

  ]
  // selectGender = [
  //   { key:"M",value: 'Male' },
  //   { key:"F",value: 'Female' },
  //   { key:"T",value: 'Transgender' },

  // ];
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
    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.patientReg.get('regstrationDate')?.setValue(currentDate);

  }

  createPatient() {
    this.patientReg = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['',],
      dob: [null, [Validators.required, this.futureDateValidator()]],
      mobile: ['', [Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      gender: ['Male', [Validators.required]],
      regstrationDate: [null, Validators.required],
      age: ['', [Validators.pattern(/^\d+$/), Validators.min(0)]],
      IdentiyNumber: [''],
      IdentiyName: [''],
    })
  }




  addPatient(patientData: FormGroup) {
    if (patientData.valid) {
      this.loadingService.showLoader();

      console.log(patientData.value);
      this._patientDto = patientData.value;
      this._patientDto.IdentityName = patientData.value.IdentiyName;
      this._patientDto.IdentityNumber = patientData.value.IdentiyNumber;
      //assigning age in month to store in background
      this._patientDto.ageinYear=this.months;
      this._patientDto.patientImage = this.previewImage;

      this.patientService.CreatePatient(this._patientDto).subscribe(
        res => {
          console.log("res", res);
          if (!res.message) {
            this.toastr.success("Patient added successfully", "Add Patient");
            this.resetAddPatientForm();
            this.route.navigate([routes.addAppointment]);
          } else {
            this.toastr.error(res.message, "Error");
          }
        },
        err => {
          console.error("Error", err);
          this.toastr.error(err.message || "An error occurred", "Error");
        }
      );

      this.loadingService.hideLoader();
    }
    else {
      this.patientReg.markAllAsTouched(); // Mark all controls as touched to trigger error display
    }
  }

  resetAddPatientForm() {
    this.patientReg.reset();
  }

  onAgeChange(event: any): void {
    const age = parseInt(event.target.value);
    if (!isNaN(age) && age >= 0) {
      const today = new Date();
      let birthYear = today.getFullYear() - age;
      
      // If birthday hasn't occurred this year, subtract one year
      const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
      if (birthDate > today) {
        birthYear--;
      }
      
      // Create the birth date with current month and day
      const finalBirthDate = new Date(birthYear, today.getMonth(), today.getDate());
      
      // Format the date for the form
      const formattedDate = this.datePipe.transform(finalBirthDate, 'yyyy-MM-dd');
      this.patientReg.get('dob')?.setValue(formattedDate);
      
      // Update display age
      if (age < 12) {
        this.displayAge = 'Month';
        this.months = age;
      } else {
        this.displayAge = 'Year';
      }

      // Validate the calculated date is not in the future
      if (finalBirthDate > today) {
        this.patientReg.get('dob')?.setErrors({ 'futureDate': true });
        this.toastr.warning('Calculated birth date cannot be in the future', 'Invalid Age');
        return;
      }
    } else if (event.target.value !== '') {
      this.toastr.warning('Please enter a valid age', 'Invalid Input');
    }
  }

  onDobDateChange(event: any): void {
    if (!event.value) return;

    // Extract the date part only
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.patientReg.get('dob')?.setValue(dateOnly);

    // Calculate age from date of birth
    const dob = new Date(event.value);
    const today = new Date();

    // Validate the date is not in the future
    if (dob > today) {
      this.patientReg.get('dob')?.setErrors({ 'futureDate': true });
      this.toastr.warning('Date of birth cannot be in the future', 'Invalid Date');
      return;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const months = this.getMonthDifference(dob, today);
    this.months = months;

    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Update age display and form value
    if (age < 12 && months < 12) {
      this.patientReg.get('age')?.setValue(months);
      this.displayAge = 'Month';
    } else {
      this.patientReg.get('age')?.setValue(age);
      this.displayAge = 'Year';
    }
  }

  getMonthDifference(startDate: Date, endDate: Date): number {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    return yearDiff * 12 + monthDiff;
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
  cancel1() {
    this.route.navigate([routes.patientsList]);

  }


  changedob(year: any) {
    debugger
    const currentYear = new Date().getFullYear();
    const y = currentYear - year;

    const dob = y + '/01/01'

    this.patientReg.get('dob')?.patchValue(this.datePipe.transform(dob, 'yyyy-MM-dd'));


  }

  // Custom validator for future dates
  futureDateValidator() {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const date = new Date(control.value);
      const today = new Date();
      if (date > today) {
        return {'futureDate': true};
      }
      return null;
    };
  }
}
