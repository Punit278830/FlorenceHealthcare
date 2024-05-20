import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbhaDataService } from 'src/app/shared/Services/abha/abha-data.service';
import { AbhaService } from 'src/app/shared/Services/abha/abha.service';
import { EncryptionService } from 'src/app/shared/encrypt/encryption.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-add-abha-address',
  templateUrl: './add-abha-address.component.html',
  styleUrls: ['./add-abha-address.component.scss']
})
export class AddAbhaAddressComponent {
  public routes = routes;
  message!: string;
  txnId!: string;
  abhaNumber!: string;
  showOtp: boolean = false;
  registerViaMobile: boolean | null = null;
  public abhaAddressForm!: FormGroup;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    // private abhaService: AbhaService,
    // private encryptionService: EncryptionService,
    // private abhaDataService: AbhaDataService,
    private toster: ToastrService,
    // private router: Router,
  ) { }

  ngOnInit() {
    this.InitializeForm();
  }

  InitializeForm() {
    this.abhaAddressForm = this.fb.group({
      registerVia: ['', Validators.required],
      mobileNumber: ['', Validators.compose([Validators.min(10)])],
      abhaNumber: ['', Validators.compose([Validators.min(10)])]
    })
  }

  onRegisterViaChanged(event: any) {
    this.registerViaMobile = event.target.value == 'Mobile' ? true : false;
    this.resetForm();
  }

  onRegisterBySubmit() {
    if (!this.abhaAddressForm.valid) {
      this.toster.error("Please provide the required fields!");
      return;
    }

    if (this.registerViaMobile && this.abhaAddressForm.value.mobileNumber == "") {
      this.toster.error("Please enter Mobile Number first.");
      return;
    }

    if (!this.registerViaMobile && this.abhaAddressForm.value.abhaNumber == "") {
      this.toster.error("Please enter ABHA Number first.");
      return;
    }

    this.showOtp = true;
  }

  resetForm()
  {
    this.showOtp= false;
    this.abhaAddressForm.value.mobileNumber = "";
    this.abhaAddressForm.value.abhaNumber = ""
  }
}
