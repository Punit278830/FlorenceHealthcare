import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbhaDataService } from 'src/app/shared/Services/abha/abha-data.service';
import { AbhaService } from 'src/app/shared/Services/abha/abha.service';
//import { EncryptionService } from 'src/app/shared/encrypt/encryption.service';
import { EncryptionServiceForge } from 'src/app/shared/encrypt/encryption.service copy'; //todo
import { routes } from 'src/app/shared/routes/routes';


@Component({
  selector: 'app-abha-profile',
  templateUrl: './abha-profile.component.html',
  styleUrls: ['./abha-profile.component.scss']
})
export class AbhaProfileComponent {
  public routes = routes;
  message!: string;
  abhaNumber: string = "TEST Number";
  abhaAddress:string = "TEST Address";
  public profileForm!: FormGroup;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private abhaService: AbhaService,
    private encryptionService: EncryptionServiceForge,
    private abhaDataService: AbhaDataService,
    private toster:ToastrService,
  ) { }

  ngOnInit() {
    // this.abhaDataService.currentData.subscribe(data => {
    //   this.message = data.message;
    //   this.abhaNumber = data.txnId;
    // });

    //this.toster.success(this.message);
  }
}
