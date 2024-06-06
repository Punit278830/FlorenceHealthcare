import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbhaService } from 'src/app/shared/Services/abha/abha.service';
import { EncryptionService } from 'src/app/shared/encrypt/encryption.service';
import { IAbhaPatientInfo, IAbhaProfile } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-search-abha-user',
  templateUrl: './search-abha-user.component.html',
  styleUrls: ['./search-abha-user.component.scss']
})
export class SearchAbhaUserComponent {
  public routes = routes;

  searchOptionsForm!: FormGroup;
  // searchViaAbhaForm!: FormGroup;

  txnId!: string;
  searchViaMobile: boolean | null = null;

  showOtp: boolean = false;
  showSearchOptionsForm: boolean = true;

  abhaProfile!: IAbhaProfile;
  private _patientDto!: IAbhaPatientInfo;
  age!: number;
  showAddPatient: boolean = false;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private toster: ToastrService,
    private abhaService: AbhaService,
    private encryptionService: EncryptionService) { }

  ngOnInit() {
    this.InitializeForm();
  }

  InitializeForm() {
    this.searchOptionsForm = this.fb.group({
      searchVia: ['', Validators.required],
      mobileNumber: ['', Validators.compose([Validators.min(10)])],
      abhaNumber: ['', Validators.compose([Validators.min(10)])],
      otp: ['']
    });
  }

  submit() {
    // if (!this.searchOptionsForm.valid) {
    //   this.toster.error("Please provide the required fields!");
    //   return;
    // }

    if (this.showOtp) {
      this.verifyOtp();
    }
    else {
      this.searchUser();
    }
  }

  searchUser() {
    this.abhaService.searchUserByAbhaNumber(this.searchOptionsForm.value.abhaNumber).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.generateOtp();
        console.log(res);
      },
      error => {
        this.toster.error("Invalid Abha number provided!");
      });
  }

  generateOtp() {

    this.abhaService.generateOtpForAddressCreation(this.searchOptionsForm.value.abhaNumber, 'MOBILE_OTP').subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.showOtp = true;
        this.txnId = res.transactionId;

        this.toster.success("OTP sent for verification.");
        console.log(res);
      },
      error => {
        this.toster.error(error);
      });
  }

  verifyOtp() {
    // if (!this.searchOptionsForm.valid) {
    //   this.toster.error("Please provide the required fields!");
    //   return;
    // }

    let otp = this.encryptionService.encryptWithPKCS1(this.searchOptionsForm.value.otp);
    this.abhaService.verifyOtpForAddressCreation(this.txnId, otp).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.transactionId;
        //this.hideAllForms();
        this.abhaProfile = res;
        this.showAddPatient = true;
        this.toster.success("OTP verified successfully.");
        console.log(res);
      },
      error => {
        this.toster.error(error);
      });
  }

  addPatient() {
    this._patientDto = {
      patientId: 0,
      firstName: this.abhaProfile.firstName,
      lastName: this.abhaProfile.lastName,
      address: this.abhaProfile.address,
      dob: this.parseDob(this.abhaProfile.dayOfBirth, this.abhaProfile.monthOfBirth, this.abhaProfile.yearOfBirth),
      email: this.abhaProfile.email,
      gender: this.abhaProfile.gender == "M" ? "Male" : this.abhaProfile.gender == "F" ? "Female" : this.abhaProfile.gender,
      mobile: this.abhaProfile.mobile,
      ageinYear: this.age,
      patientImage: this.abhaProfile.photo,
      regstrationDate: this.getDateOnly(new Date()),
    };

    this.abhaService.addPatient(this._patientDto).subscribe(res => {
      res ? this.toster.success("Patient added successfully", "Add Patient") : null;
      //this.route.navigate([routes.addAppointment]);
    })
  }

  onSearchViaChanged(event: any) {
    this.searchViaMobile = event.target.value == 'Mobile' ? true : false;
    this.resetForm();
  }

  resetForm() {
    this.showOtp = false;
    this.searchOptionsForm.value.mobileNumber = "";
    this.searchOptionsForm.value.abhaNumber = ""
  }

  parseDob(day: string, month: string, year: string) {
    let dob = new Date(Number(year), Number(month) - 1, Number(day));
    this.calculateDateDifference(dob);

    return this.getDateOnly(dob);
  }

  getDateOnly(date: Date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }

  calculateDateDifference(dob: Date) {
    const start = new Date(dob);
    const end = new Date();
    // Calculate the difference in years
    const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
    const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    this.age = yearsDifference;
  }
}
