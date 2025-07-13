import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbhaService } from 'src/app/shared/Services/abha/abha.service';
import { EncryptionService } from 'src/app/shared/encrypt/encryption.service';
import { IAbhaDetails } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
    selector: 'app-add-abha-address',
    templateUrl: './add-abha-address.component.html',
    styleUrls: ['./add-abha-address.component.scss'],
    providers: [DatePipe],
    standalone: false
})
export class AddAbhaAddressComponent {
  public routes = routes;
  message!: string;
  txnId!: string;
  abhaNumber!: string;
  showOtp: boolean = false;
  registerViaMobile: boolean | null = null;
  validateViaAadharOtp: boolean | null = null;
  alreadyLinkedAddressesCount: number = 0;
  linkedAddresses!: string[];
  suggestionList!: string[];
  selectedAbhaAddress: string = "";
  abhaDetailsDto!: IAbhaDetails;


  registrationOptionsForm!: FormGroup;
  registerViaAbhaForm!: FormGroup;
  cofirmOTPForm!: FormGroup;
  linkedAbhaAddressessForm!: FormGroup;
  createNewAbhaAddressForm!: FormGroup;

  registerViaMobileForm!: FormGroup;
  mobileCofirmOTPForm!: FormGroup;
  mobileLinkedAbhaAddressessForm!: FormGroup;
  mobileCreateNewAbhaAddressForm!: FormGroup;
  mobileAbhaDetailsForm!: FormGroup;

  showRegistrationOptionsForm: boolean = true;
  showRegistrationViaAbhaForm: boolean = false;
  showConfirmOTPForm: boolean = false;
  showLinkedAbhaAddressessForm: boolean = false;
  showCreateNewAbhaAddressForm: boolean = false;


  showMobileCofirmOTPForm: boolean = false;
  showMobileLinkedAbhaAddressessForm: boolean = false;
  showMobileCreateNewAbhaAddressForm: boolean = false;
  showMobileAbhaDetailsForm: boolean = false;

  selectGender = [
    { value: 'Male' },
    { value: 'Female' },
    { value: 'Transgender' },
  ];

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private abhaService: AbhaService,
    private encryptionService: EncryptionService,
    private toster: ToastrService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.InitializeForm();
  }

  InitializeForm() {
    this.registrationOptionsForm = this.fb.group({
      registerVia: ['', Validators.required],
      mobileNumber: ['', Validators.compose([Validators.min(10)])],
      abhaNumber: ['', Validators.compose([Validators.min(10)])],
      otp: ['']
    });

    this.registerViaAbhaForm = this.fb.group({
      validateVia: ['', Validators.required],
      abhaNumber: ['', Validators.compose([Validators.required, Validators.min(14)])]
    });

    this.cofirmOTPForm = this.fb.group({
      otp: ['', Validators.required],
    });

    this.linkedAbhaAddressessForm = this.fb.group({
    });

    this.createNewAbhaAddressForm = this.fb.group({
      newAbhaAddress: ['', Validators.required]
    });

    this.registerViaMobileForm = this.fb.group({
      mobileNumber: ['', Validators.compose([Validators.required, Validators.min(14)])]
    });

    this.mobileCofirmOTPForm = this.fb.group({
      otp: ['', Validators.required],
    });

    this.mobileLinkedAbhaAddressessForm = this.fb.group({
    });

    this.mobileCreateNewAbhaAddressForm = this.fb.group({
      newAbhaAddress: ['', Validators.required]
    });

    this.mobileAbhaDetailsForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      dob: [null, [Validators.required]],
      gender: ['Male', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [''],
      address: [''],
      pinCode: [''],
      stateCode: [''],
      districtCode: [''],
    });
  }

  onRegisterViaChanged(event: any) {
    this.registerViaMobile = event.target.value == 'Mobile' ? true : false;
    this.resetForm();
  }

  submit() {
    if (!this.registrationOptionsForm.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    if (this.showOtp) {
      if (this.registrationOptionsForm.value.otp == "") {
        this.toster.error("Please enter the valid OTP.");
        return;
      }

      let otpdata = this.encryptionService.encryptWithPKCS1(this.registrationOptionsForm.value.otp);
      this.abhaService.confirmOtpforAbhaAddress(otpdata, this.txnId).subscribe(
        res => {
          if (res && res.error) {
            this.toster.error("Some error has ocurred please try after some time!");
            return;
          }

          this.hideAllForms();

          if (this.registerViaMobile) {
            this.txnId = res.transactionId;
            this.alreadyLinkedAddressesCount = res.mappedPhrAddress.length;
            this.linkedAddresses = res.mappedPhrAddress;

            this.showMobileLinkedAbhaAddressessForm = true;
          }
          else {
            this.showRegistrationViaAbhaForm = true;
          }

          console.log(res);
        },
        error => {
          this.toster.error(error);
        });
      return;
    }

    if (this.registerViaMobile && this.registrationOptionsForm.value.mobileNumber == "") {
      this.toster.error("Please enter Mobile Number first.");
      return;
    }

    if (!this.registerViaMobile && this.registrationOptionsForm.value.abhaNumber == "") {
      this.toster.error("Please enter ABHA Number first.");
      return;
    }

    if (this.registerViaMobile) {
      let data = this.encryptionService.encryptWithPKCS1(this.registrationOptionsForm.value.mobileNumber);
      this.abhaService.generateOtpforAbhaAddress(data).subscribe(
        res => {
          if (res && res.error) {
            this.toster.error("Some error has ocurred please try after some time!");
            return;
          }

          this.showOtp = true;
          this.txnId = res.transactionId;
        },
        error => {
          this.toster.error(error);
        });
    }
    else {
      this.hideAllForms();
      this.showRegistrationViaAbhaForm = true;
      this.registerViaAbhaForm.patchValue({ abhaNumber: this.registrationOptionsForm.value.abhaNumber });
    }
  }

  resetForm() {
    this.showOtp = false;
    this.registrationOptionsForm.value.mobileNumber = "";
    this.registrationOptionsForm.value.abhaNumber = ""
  }

  hideAllForms() {
    this.showRegistrationOptionsForm = false;
    this.showRegistrationViaAbhaForm = false;
    this.showConfirmOTPForm = false;
    this.showLinkedAbhaAddressessForm = false;
    this.showCreateNewAbhaAddressForm = false;

    this.showMobileLinkedAbhaAddressessForm = false;
    this.showMobileCreateNewAbhaAddressForm = false;
    this.showMobileAbhaDetailsForm = false;
  }

  onValidateViaChanged(event: any) {
    this.validateViaAadharOtp = event.target.value == 'AadharOtp' ? true : false;
  }

  generateOtpForAddressCreation() {
    if (!this.registerViaAbhaForm.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    const authMethod = this.validateViaAadharOtp ? 'MOBILE_OTP' : 'MOBILE_OTP'; //todo

    this.abhaService.generateOtpForAddressCreation(this.registerViaAbhaForm.value.abhaNumber, authMethod).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.transactionId;
        this.hideAllForms();
        this.showConfirmOTPForm = true;
        this.toster.success("OTP sent for verification.");
        console.log(res);
      },
      error => {
        this.toster.error(error);
      });
  }

  verifyOtpForAddressCreation() {
    if (!this.cofirmOTPForm.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    let otp = this.encryptionService.encryptWithPKCS1(this.cofirmOTPForm.value.otp);
    this.abhaService.verifyOtpForAddressCreation(this.txnId, otp).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.transactionId;
        this.alreadyLinkedAddressesCount = res.linkedPhrAddess;
        this.linkedAddresses = res.phrAddress;

        this.hideAllForms();
        this.showLinkedAbhaAddressessForm = true;

        this.toster.success("OTP verified successfully.");
        console.log(res);
      },
      error => {
        this.toster.error(error);
      });
  }

  createNewAddress() {
    this.abhaService.getAbhaAddressSuggestions(this.txnId).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.suggestionList = res;

        this.hideAllForms();
        this.showCreateNewAbhaAddressForm = true;
        console.log(res);
      },
      error => {
        this.toster.error(error);
      });
  }


  selectAbhaAddress(selectedAbhaAddress: string) {
    this.selectedAbhaAddress = selectedAbhaAddress;
    this.createNewAbhaAddressForm.patchValue({ newAbhaAddress: selectedAbhaAddress });
    this.mobileCreateNewAbhaAddressForm.patchValue({ newAbhaAddress: selectedAbhaAddress });

  }

  submitNewAddress() {
    if (!this.createNewAbhaAddressForm.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    this.abhaService.createAbhaAddress(this.txnId, this.createNewAbhaAddressForm.value.newAbhaAddress).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.transactionId;

        //this.hideAllForms();
        //this.showCreateNewAbhaAddressForm = true;
        console.log("Abha address created successfully!");
        this.toster.success("Abha address created successfully!");

      },
      error => {
        this.toster.error(error);
      });
  }

  generateOtpViaMobile() {
    if (this.registerViaMobile && this.registrationOptionsForm.value.mobileNumber == "") {
      this.toster.error("Please enter Mobile Number first.");
      return;
    }

    let data = this.encryptionService.encryptWithPKCS1(this.registrationOptionsForm.value.mobileNumber);
    this.abhaService.generateOtpforAbhaAddress(data).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.showOtp = true;
        this.txnId = res.transactionId;
      },
      error => {
        this.toster.error(error);
      });
  }

  verifyOtpViaMobile() {
    if (!this.mobileCofirmOTPForm.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    let otp = this.encryptionService.encryptWithPKCS1(this.mobileCofirmOTPForm.value.otp);
    this.abhaService.verifyOtpForAddressCreation(this.txnId, otp).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.transactionId;
        this.alreadyLinkedAddressesCount = res.linkedPhrAddess;
        this.linkedAddresses = res.phrAddress;

        this.hideAllForms();
        this.showMobileLinkedAbhaAddressessForm = true;

        this.toster.success("OTP verified successfully.");
        console.log(res);
      },
      error => {
        this.toster.error(error);
      });
  }

  createNewAddressViaMobile(mobileAbhaDetailsForm: FormGroup) {
    if (!mobileAbhaDetailsForm.valid) {
      this.toster.error("Please provide correct details!");
      return;
    }
    
    this.abhaDetailsDto= {
      firstName: mobileAbhaDetailsForm.value.firstName,
      middleName: mobileAbhaDetailsForm.value.middleName,
      lastName: mobileAbhaDetailsForm.value.lastName,
      
      dayOfBirth: "",
      monthOfBirth: "",
      yearOfBirth: "",

      gender: mobileAbhaDetailsForm.value.gender == "Male" ? "M" : 
      mobileAbhaDetailsForm.value.gender == "Female"? "F" : "T",
      countryCode: "+91",
      mobile: "",
      
      email: mobileAbhaDetailsForm.value.email,
      address: mobileAbhaDetailsForm.value.address,
      
      pinCode: mobileAbhaDetailsForm.value.pinCode,
      stateCode: mobileAbhaDetailsForm.value.stateCode,
      districtCode: mobileAbhaDetailsForm.value.districtCode,
       
      transactionId: this.txnId
    };
    
    const dateOnly = this.datePipe.transform(mobileAbhaDetailsForm.value.dob, 'yyyy-MM-dd');
    let parts = dateOnly?.split('-'); // split the date string on '-'

    if (parts != null && parts != undefined) {
      this.abhaDetailsDto.yearOfBirth = parts[0]; // the first part is the year
      this.abhaDetailsDto.monthOfBirth = parts[1]; // the second part is the month
      this.abhaDetailsDto.dayOfBirth = parts[2]; // the third part is the day
    }

    this.abhaDetailsDto.mobile = this.encryptionService.encryptWithPKCS1(this.registrationOptionsForm.value.mobileNumber);
    this.abhaService.createAbhaDetails(this.abhaDetailsDto).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.suggestionList = res;
        this.txnId = res.transactionId;
        // this.hideAllForms();
        // this.showMobileAbhaDetailsForm = true;
        //this.toster.success("Details submitted successfully!");

        this.getSuggestions();
        console.log(res);
      },
      error => {
        this.toster.error(error);
      });
  }

  getSuggestions() {
    this.abhaService.getAbhaAddressSuggestions(this.txnId).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.suggestionList = res;

        this.hideAllForms();
        this.showMobileCreateNewAbhaAddressForm = true;
        this.toster.success("Details submitted successfully!");

        console.log(res);
      },
      error => {
        this.toster.error(error);
      });
  }


  submitNewAddressViaMobile() {
    if (!this.mobileCreateNewAbhaAddressForm.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    this.abhaService.createAbhaAddressViaMobile(this.txnId, this.mobileCreateNewAbhaAddressForm.value.newAbhaAddress).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.transactionId;

        //this.hideAllForms();
        //this.showCreateNewAbhaAddressForm = true;
        console.log("Abha address created successfully!");
        this.toster.success("Abha address created successfully!");

      },
      error => {
        this.toster.error(error);
      });
  }

  addDetails(data: any) {
    this.createNewAddressViaMobile(data);
  }

  showDetailsForm() {
    this.hideAllForms();
    this.showMobileAbhaDetailsForm = true;
  }

  onDobDateChange(event: any): void {
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.mobileAbhaDetailsForm.get('dob')?.setValue(dateOnly);
  }
}
