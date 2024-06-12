import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { Idepartment, IstaffInfo } from 'src/app/shared/models/models';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { DatePipe } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface data {
  value: string;
}
@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
  providers: [DatePipe],
})
export class AddStaffComponent {
  public routes = routes;
  //public selectedValue !: string  ;
  staffReg!: FormGroup;
  private _staffDto!: IstaffInfo;
  public passwordClass = false;
  public passwordClass1 = false;
  public _depDto: Idepartment[] = []
  public maxDate: Date | null = null;



  constructor(private fb: FormBuilder, private staffService: StaffService,
    private datePipe: DatePipe,
    private route: Router,
    private toster: ToastrService,
    private departmentService: DepartmentService) {
    this.createStaffRegrestrationForm();
    this.getDepartmentList();
    this.maxDate = new Date()

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

  createStaffRegrestrationForm() {
    this.staffReg = this.fb.group({
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
      dob: ['', Validators.required],
      doj: ['', Validators.required],


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
    if (this.staffReg.valid) {
      console.log("values", formValues.value);
      if (formValues.value.password !== formValues.value.cpassword) {
        this.toster.error("Password do not match");
        return; // Exit the method if passwords don't match
      }
      // Create a copy of the form values and remove cpassword
      let staffData = { ...formValues.getRawValue() };
      delete staffData.cpassword;

      staffData.activeStatus = parseInt(staffData.activeStatus);
      staffData.departmentId = parseInt(staffData.departmentId);

      this.staffService.CreateStaff(staffData).subscribe(res => {
        console.log(res);
        if (res) {
          this.toster.success("Staff Added Successfully", 'Staff');
          this.route.navigate([routes.staffList])
        }
      });

    } else {
      this.staffReg.markAllAsTouched(); // Mark all controls as touched to trigger error display
    }
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
}