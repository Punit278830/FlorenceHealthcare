import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { api_Url } from 'src/environment/environment';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-hospital-onboarding',
  templateUrl: './hospital-onboarding.component.html',
  styleUrls: ['./hospital-onboarding.component.scss']
})
export class HospitalOnboardingComponent implements OnInit {
  form!: FormGroup;
  hospitals: any[] = [];
  apiBase = api_Url;
  loading = false;
  error?: string;
  success?: string;
  public routes = routes;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      code: ['', [Validators.maxLength(50)]],
      contactPerson: ['', [Validators.maxLength(200)]],
      contactNumber: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(200)]],
      addressLine1: ['', [Validators.maxLength(400)]],
      addressLine2: ['', [Validators.maxLength(400)]],
      city: ['', [Validators.maxLength(100)]],
      state: ['', [Validators.maxLength(100)]],
      pincode: ['', [Validators.maxLength(20)]],
      country: ['', [Validators.maxLength(100)]],
      registrationNumber: ['', [Validators.maxLength(100)]],
      licenseNumber: ['', [Validators.maxLength(100)]],
      gstin: ['', [Validators.maxLength(30)]],
      websiteUrl: ['', [Validators.maxLength(400)]],
      logoUrl: ['', [Validators.maxLength(400)]],
      isActive: [true]
    });

    this.loadHospitals();
  }

  loadHospitals(): void {
    this.loading = true;
    this.http.get(this.apiBase + 'Hospitals').subscribe({
      next: (data: any) => {
        this.hospitals = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error || 'Failed to fetch hospitals';
        this.loading = false;
      }
    })
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = undefined;
    this.success = undefined;
    this.http.post(this.apiBase + 'Hospitals', this.form.value).subscribe({
      next: () => {
        this.success = 'Hospital created';
        this.form.reset({ isActive: true });
        this.loadHospitals();
      },
      error: (err) => {
        this.error = err?.error || 'Failed to create hospital';
        this.loading = false;
      }
    });
  }

  selectHospital(h: any): void {
    // Store the selected hospital id globally for API header propagation
    localStorage.setItem('currentHospitalId', String(h.hospitalId));
    this.success = `Selected hospital: ${h.name}`;
  }
}
