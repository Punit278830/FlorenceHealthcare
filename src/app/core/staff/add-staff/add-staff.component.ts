import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { Idepartment, IstaffInfo, HospitalModel } from 'src/app/shared/models/models';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { DatePipe } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { RoleAuthorizationService } from 'src/app/shared/Services/auth/role-authorization.service';
import * as dayjs from 'dayjs';

interface data {
  value: string;
}
@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
  providers: [DatePipe],
})
export class AddStaffComponent implements OnInit {
  public routes = routes;
  //public selectedValue !: string  ;
  staffReg!: FormGroup;
  private _staffDto!: IstaffInfo;
  public passwordClass = false;
  public passwordClass1 = false;
  public _depDto: Idepartment[] = [];
  public hospitals: HospitalModel[] = [];
  public roles: any[] = [];
  public isLoadingRoles = false;
  public isLoadingHospitals = false;
  public isSubmitting = false;
  public maxDate: Date | null = null;



  constructor(private fb: FormBuilder, private staffService: StaffService,
    private datePipe: DatePipe,
    private route: Router,
    private toster: ToastrService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private roleService: RoleAuthorizationService) {
    this.createStaffRegrestrationForm();
    this.getDepartmentList();
    this.loadHospitals();
    this.loadRoles();
    this.maxDate = new Date()

  }
  ngOnInit(): void {
    // Removed the error throw
  }

  loadHospitals(): void {
    this.isLoadingHospitals = true;
    this.authService.getHospitals().subscribe(
      (hospitals: HospitalModel[]) => {
        this.hospitals = hospitals.filter(h => h.isActive !== false);
        this.isLoadingHospitals = false;
      },
      (error) => {
        console.error('Error loading hospitals:', error);
        this.isLoadingHospitals = false;
        this.toster.error('Failed to load hospitals');
      }
    );
  }

  loadRoles(): void {
    const currentHospitalId = localStorage.getItem('currentHospitalId') || '1';
    this.isLoadingRoles = true;
    
    this.authService.getHospitals().subscribe({
      next: () => {
        // Use the role service to get roles for the current hospital
        this.roleService.getAllRolesByHospital(parseInt(currentHospitalId)).subscribe({
          next: (roles) => {
            this.roles = roles;
            this.isLoadingRoles = false;
          },
          error: (error) => {
            console.error('Error loading roles:', error);
            this.isLoadingRoles = false;
            this.toster.error('Failed to load roles');
          }
        });
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.isLoadingRoles = false;
        this.toster.error('Failed to load roles');
      }
    });
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
  togglePassword1() {
    this.passwordClass1 = !this.passwordClass1;
  }

  onDobDateChange(event: any): void {
    // Extract the date part only
    // const datePipe = new DatePipe('en-US');
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    console.log('Selected Date (Date Only):', dateOnly);
    this.staffReg.get('dob')?.setValue(dateOnly);


  }

  onDOJDateChange(event: any): void {
    // Extract the date part only
    // const datePipe = new DatePipe('en-US');
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    console.log('Selected Date (Date Only):', dateOnly);
    this.staffReg.get('doj')?.setValue(dateOnly);


  }

  departmentList = [
    { key: 1, value: 'Select  Department' },
    { key: 2, value: 'Orthopedics' },
    { key: 3, value: 'Radiology' },
    { key: 4, value: 'Dentist' },
  ];

  status: data[] = [
    { value: 'Select  Status' },
    { value: 'Active' },
    { value: 'Inactive' },

  ];

  ConsultationFeeList: number[] = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
  // {value:'0'},
  // {value:'100'},
  // {value:'200'},
  // {value:'300'},
  // {value:'400'},
  // {value:'500'},
  // {value:'600'},
  // {value:'700'},
  // {value:'800'},
  // {value:'900'},
  // {value:'1000'},

  // ];

  designationList: data[] = [
    { value: 'admin' },
    { value: 'Doctor' },
    { value: 'reception' },
    { value: 'Nursing' },

  ]


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
  IdentityDocNumber = [
    { value: 'Aadhar Card' },
    { value: 'Driving Licence' },
    { value: 'voterID' },
    { value: 'ABHA ID' },
    { value: 'Passport' },

  ]

  createStaffRegrestrationForm() {
    const currentHospitalId = localStorage.getItem('currentHospitalId') || '1';
    const isSuperAdmin = this.roleService.isSuperAdmin();
    
    this.staffReg = this.fb.group({
      hospitalId: [
        isSuperAdmin ? '' : currentHospitalId, 
        isSuperAdmin ? [Validators.required] : []
      ],
      firstName: ['', [Validators.required]],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      departmentId: ['', Validators.required],
      designation: ['', Validators.required],
      consultationFee: [0, Validators.required],
      activeStatus: [null, Validators.required],
      password: ['', Validators.required],
      cpassword: ['', [Validators.required]],
      education: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', [Validators.required, this.minimumAgeValidator(21)]],
      doj: ['', Validators.required],
      IdentityNumber: ['', Validators.required],
      registrationNumber:[''],
      IdentityName: ['', Validators.required],
      PrescriptionValidity: [null, Validators.required],
      roleId: [''] // Role assignment (optional)

    });

  }

  resetStaffRegForm() {
    this.staffReg.reset();
  }
  get mobile(): AbstractControl {
    return this.staffReg.get('mobile') as AbstractControl;
  }

  onBlur() {
    if (this.staffReg.get('password')?.value != this.staffReg.get('cpassword')?.value) {
      this.toster.error("Password do not match")
      this.staffReg.get('cpassword')?.markAsTouched()
    }
  }

  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const cpassword = formGroup.get('cpassword')?.value;
    return password === cpassword ? null : { passwordMismatch: true };
  };


  addStaff(formValues: FormGroup) {
    console.log("Add Staff method called");
    console.log("Form valid:", this.staffReg.valid);
    console.log("Form values:", formValues.value);
    console.log("Form errors:", this.staffReg.errors);
    
    if (this.isSubmitting) {
      console.log("Already submitting, ignoring duplicate submission");
      return;
    }
    
    if (this.staffReg.valid) {
      console.log("Form is valid, proceeding with submission");
      
      if (formValues.value.password !== formValues.value.cpassword) {
        this.toster.error("Password do not match");
        return; // Exit the method if passwords don't match
      }
      
      this.isSubmitting = true;
      
      // Create a copy of the form values and remove cpassword
      let staffData = { ...formValues.getRawValue() };
      delete staffData.cpassword;

      staffData.activeStatus = parseInt(staffData.activeStatus);
      staffData.departmentId = parseInt(staffData.departmentId);
      staffData.hospitalId = parseInt(staffData.hospitalId);
      
      console.log("Sending staff data:", staffData);
      
      this.staffService.CreateStaff(staffData).subscribe((res:any) => {
        console.log("API Response:", res);
        this.isSubmitting = false;
        if (!res.message) {
          this.toster.success("Staff Added Successfully", 'Staff');
          this.route.navigate([routes.staffList])
        }else{
          this.toster.error(res.message,"Error")
        }
      },
      (err)=>{
        console.error("API Error:", err);
        this.isSubmitting = false;
        this.toster.error(err.message || "An error occurred","Error")
      }
    );

    } else {
      console.log("Form is invalid");
      console.log("Invalid controls:", this.getInvalidControls());
      this.staffReg.markAllAsTouched(); // Mark all controls as touched to trigger error display
      this.toster.error("Please fill all required fields correctly", "Form Validation Error");
    }
  }

  // Helper method to identify invalid form controls
  getInvalidControls() {
    const invalid = [];
    const controls = this.staffReg.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push({
          name: name,
          errors: controls[name].errors
        });
      }
    }
    return invalid;
  }


  onSelectionChange(event: MatSelectChange) {
    if ((event.value).toLowerCase() != 'doctor') {
      this.staffReg.get('consultationFee')?.patchValue(0);
      this.staffReg.get('consultationFee')?.disable();

    }
    else {
      this.staffReg.get('consultationFee')?.enable();
    }
  }

  getDepartmentList() {
    this.departmentService.getDepartmentList().subscribe(res => {
      this._depDto = res;


    })
  }
  onCancel() {
    this.route.navigate([routes.staffList]);
  }

  // Custom validator function
  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl) => {
      const dob = new Date(control.value);
      if (!control.value) return null;
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear() - (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) ? 1 : 0);
      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  get isSuperAdmin(): boolean {
    return this.roleService.isSuperAdmin();
  }

  get shouldShowHospitalDropdown(): boolean {
    return this.isSuperAdmin;
  }

}