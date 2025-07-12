import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hospital-onboarding',
  templateUrl: './hospital-onboarding.component.html',
  styleUrls: ['./hospital-onboarding.component.scss']
})
export class HospitalOnboardingComponent {
  hospitalForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.hospitalForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      contactNumber: ['']
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.hospitalForm.valid) {
      // TODO: Call backend API to save hospital
      console.log('Hospital Data:', this.hospitalForm.value);
      // Reset form or navigate as needed
    }
  }
}
