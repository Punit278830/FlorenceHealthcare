import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AbhaDataService } from 'src/app/shared/Services/abha/abha-data.service';
import { AbhaService } from 'src/app/shared/Services/abha/abha.service';
//import { EncryptionService } from 'src/app/shared/encrypt/encryption.service';
import { EncryptionServiceForge } from 'src/app/shared/encrypt/encryption.service copy'; //todo
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-register-by-aadhar',
  templateUrl: './register-by-aadhar.component.html',
  styleUrls: ['./register-by-aadhar.component.scss']
})
export class RegisterByAadharComponent {
  routes: any;

  public abhaReg!: FormGroup;
  otpGenerationMsg!: string;
  txnId!: string;
  showConfirmOtp = false;

  constructor(private fb: FormBuilder,
    private abhaService: AbhaService,
    private encryptionService: EncryptionServiceForge,
    private router: Router,
    private abhaDataService: AbhaDataService) {
    this.routes = routes;
  }

  ngOnInit() {
    this.InitializeAbhaForm();
  }

  InitializeAbhaForm() {
    this.abhaReg = this.fb.group({
      aadharNumber: ['', [Validators.required]],
      Consent: ['', [Validators.required]],

    })
  }


  async generateOtp() {
    let data = await this.encryptionService.encrypt(this.abhaReg.value.aadharNumber);
    this.abhaService.generateOtp(data).subscribe(
      res => {
        
        this.otpGenerationMsg = res.message;
        this.txnId = res.txnId;
        //this.showConfirmOtp = true;

        this.abhaDataService.setData({ message: res.message, txnId: res.txnId});
        this.router.navigate([routes.abhaConfirmAadharOtp]);
        console.log(res);
      }
    );




  }
}
