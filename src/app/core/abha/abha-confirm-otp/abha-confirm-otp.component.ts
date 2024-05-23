import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbhaDataService } from 'src/app/shared/Services/abha/abha-data.service';
import { AbhaService } from 'src/app/shared/Services/abha/abha.service';
import { EncryptionService } from 'src/app/shared/encrypt/encryption.service'; 
import { routes } from 'src/app/shared/routes/routes';


@Component({
  selector: 'app-abha-confirm-otp',
  templateUrl: './abha-confirm-otp.component.html',
  styleUrls: ['./abha-confirm-otp.component.scss']
})
export class AbhaConfirmOtpComponent {
  public routes = routes;
  message!: string;
  modalHeader!:string;
  txnId!: string;
  abhaNumber!:string;
  showModal: boolean = true;
  public enrollForm!: FormGroup;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private abhaService: AbhaService,
    private encryptionService: EncryptionService,
    private abhaDataService: AbhaDataService,
    private toster: ToastrService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.InitializeAbhaForm();

    this.abhaDataService.currentData.subscribe(data => {
      this.message = data.message;
      this.txnId = data.txnId;
    });
  }

  InitializeAbhaForm() {
    this.enrollForm = this.fb.group({
      otp: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
    })
  }

  async confirmOtp() {
    let data = await this.encryptionService.encrypt(this.enrollForm.value.otp);
    this.abhaService.confirmOtp(data, this.txnId, this.enrollForm.value.mobileNumber).subscribe(
      res => {
        //res ? this.toster.success(res.message) : null;
        //var name = "Hi " + res.FirstName + " " + res.LastName;
        this.modalHeader = res.message;

        this.abhaNumber = res?.ABHAProfile.ABHANumber;
        // var abhaNumber = res?.ABHAProfile.phrAddress[0];
        //this.abhaDataService.setData({ message: name, txnId: res.abhaNumber });
        //this.router.navigate([routes.abhaProfile]);
        console.log(res);
      }
    );
  }
}
