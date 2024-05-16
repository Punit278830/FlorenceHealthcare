import { Component } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AbhaService } from 'src/app/shared/Services/abha/abha.service';
import { EncryptionService } from 'src/app/shared/encrypt/encryption.service';
import { routes } from 'src/app/shared/routes/routes';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-by-aadhar-stepper',
  templateUrl: './register-by-aadhar-stepper.component.html',
  styleUrls: ['./register-by-aadhar-stepper.component.scss']
})
export class RegisterByAadharStepperComponent {
  public routes = routes;

  isLinear = true;
  messageStep1!: string;
  txnId!: string;
  messageStep2!: string;
  messageStep3!: string;
  isDifferentMobile: boolean = false;
  showOtp: boolean = false;
  isMobileVerified: boolean = false;
  abhaProfile: any;
  abhaProfileName!: string;
  xToken!: string;

  formAadharGroup!: FormGroup;
  formAadharAuthGroup!: FormGroup;
  formCommunicationDetailsGroup!: FormGroup;
  formAbhaProfileGroup!: FormGroup;
  completed: boolean = true;

  constructor(
    private fb: FormBuilder,
    private abhaService: AbhaService,
    private encryptionService: EncryptionService,
    private toster: ToastrService) {
    this.createForm();
  }

  ngOnit() { }

  createForm() {
    const aadharPattern = new RegExp(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/);
    this.formAadharGroup = this.fb.group({
      aadharNumber: ['', [Validators.required, Validators.pattern(aadharPattern)]],
      consent: [false, [Validators.requiredTrue]],
    });

    this.formAadharAuthGroup = this.fb.group({
      otp: ['', [Validators.required]],
      mobileNumber: ['', Validators.compose([Validators.required, Validators.min(10)])]
    });
    this.formCommunicationDetailsGroup = this.fb.group({
      otherMobile: ['', Validators.compose([Validators.min(10)])],
      otp: ['']
    });
    this.formAbhaProfileGroup = this.fb.group({
      mobile: ['', Validators.compose([Validators.required, Validators.min(10)])]
    });
  }

  generateOtp() {
    if (!this.formAadharGroup.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    let data = this.encryptionService.encrypt(this.formAadharGroup.value.aadharNumber);
    this.abhaService.generateOtp(data).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.txnId;
        this.messageStep1 = res.message;
        this.toster.success(res.message);
        console.log(res);
      }
    );
  }

  confirmOtp() {
    if (!this.formAadharAuthGroup.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    let data = this.encryptionService.encrypt(this.formAadharAuthGroup.value.otp);
    this.abhaService.confirmOtp(data, this.txnId, this.formAadharAuthGroup.value.mobileNumber).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.txnId;
        this.messageStep2 = res.message;
        this.abhaProfile = res.ABHAProfile;
        this.abhaProfileName = this.abhaProfile.firstName + " " + this.abhaProfile.middleName + " " + this.abhaProfile.lastName;
        this.isDifferentMobile = this.formAadharAuthGroup.value.mobileNumber != this.abhaProfile.mobile;
        this.messageStep3 = this.isDifferentMobile ?
          "The mobile provided for communication is not linked to Aadhar, Kindly verify this number!"
          : "Aadhar authentication completed successfully! You can skip to next step";
        //this.toster.success(res.message);
        this.isMobileVerified = !this.isDifferentMobile;
        this.xToken = "Bearer " + res.tokens.token;
        console.log(res);
      }
    );
  }

  confirmCommDetails() {
    if (!this.formCommunicationDetailsGroup.valid || (this.isDifferentMobile && !this.showOtp)) { //todo - validate codition
      this.toster.error("Please complete your mobile verification first!");
      return;
    }

    if (this.isDifferentMobile) {
      let data = this.encryptionService.encrypt(this.formCommunicationDetailsGroup.value.otp);
      this.abhaService.confirmOtherOtp(data, this.txnId, this.formAadharAuthGroup.value.mobileNumber).subscribe(
        res => {
          if (res && res.error) {
            this.toster.error("Some error has ocurred please try after some time!");
            return;
          }

          this.txnId = res.txnId;
          this.isMobileVerified = true;
          this.toster.success(res.message);
          console.log(res);
          return;
        }
      );
    }

    this.toster.success(this.messageStep2);
    return;
  }

  verifyMobile() {
    let data = this.encryptionService.encrypt(this.formAadharAuthGroup.value.mobileNumber);
    this.abhaService.generateOtherOtp(data, this.txnId).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        this.txnId = res.txnId;
        this.showOtp = true;
        console.log(res);
      }
    );
  }

  downloadABHACard() {
    this.abhaService.downloadCard(this.xToken).subscribe(
      res => {
        if (res && res.error) {
          this.toster.error("Some error has ocurred please try after some time!");
          return;
        }

        let file = new Blob([res], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);

        console.log(res);
      }
    );
  }
}
