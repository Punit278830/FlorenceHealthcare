import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { Idepartment, IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string;
}
@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss'],
  providers: [DatePipe],
})
export class EditStaffComponent implements OnInit {
  public routes = routes;
  public deleteIcon = true;
  public selectedValue !: string;
  private staffId!: number;
  staffReg!: FormGroup;
  private _staffDto!: IstaffInfo;
  public passtype = 'password';
  public pass = '';
  public confirmPass = '';
  public PassConfirmType = 'password';
  public passwordClass = false;
  public passwordClass1 = false;
  public _depDto: Idepartment[] = []



  constructor(private fb: FormBuilder,
    private staffService: StaffService,
    private datePipe: DatePipe,
    private route: Router,
    private toastr: ToastrService,
    private departmentService: DepartmentService) {
    this.createStaffRegrestrationForm();
    this.getDepartmentList()
    this.staffId = this.staffService.staffId;
    if (this.staffId) {
      this.getStaffInfo(this.staffId);
    }
    else {
      routes.staffList;
      this.route.navigate([routes.staffList]);
    }


  }
  IdentityDocNumber = [
    { value: 'Aadhar Card' },
    { value: 'Driving Licence' },
    { value: 'voterID' },
    { value: 'ABHA ID' },
    { value: 'Passport' },

  ]

  ngOnInit(): void {
    //this.staffReg=this._staffDto;
    console.log()
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
  togglePassword1() {
    this.passwordClass1 = !this.passwordClass1;
  }



  getStaffInfo(sid: number) {
    this.staffService.getStaff(sid).subscribe((data: IstaffInfo) => {
      console.log(data);
      console.log("data",data)

      this._staffDto = data;
      //this.fillStaffDataInForm()
      this.staffReg.patchValue(this._staffDto);
      this.staffReg.get('departmentId')?.patchValue(this._staffDto.departmentId)
      //this.staffReg.patchValue({activeStatus:this._staffDto.activeStatus})
      this.staffReg.get('activeStatus')?.patchValue(this._staffDto.activeStatus)
      console.log("staffDto",this._staffDto)
      
      


    })

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

  status = [
    { key: 1, value: 'Active' },
    { key: 2, value: 'Inactive' },

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
      cpassword: ['', Validators.required],
      education: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      doj: ['', Validators.required],
      identityNumber: ['', Validators.required],
      identityName: ['', Validators.required],

    });
  }
  cancel() {
    this.route.navigate([routes.staffList])
  }

  // fillStaffDataInForm()
  // {
  //   this.staffReg = this.fb.group({
  //     firstName: [this._staffDto.firstName, [Validators.required]],
  //     lastName: [this._staffDto.lastName],
  //     mobile: [this._staffDto.mobile, Validators.required],
  //     email: [this._staffDto.email, [Validators.required, Validators.email]],
  //     address: [this._staffDto.address],
  //     departmentId: [this._staffDto.departmentId,Validators.required],
  //     designation: [this._staffDto.designation,Validators.required],
  //     consultationFee: [this._staffDto.consultationFee,Validators.required],
  //     activeStatus: [this._staffDto.activeStatus,Validators.required],
  //     password: [this._staffDto.password,Validators.required],
  //     education:[this._staffDto.education,Validators.required],
  //     gender:[this._staffDto.gender,Validators.required],
  //     dob:[this._staffDto.dob,Validators.required],
  //     doj:[this._staffDto.doj,Validators.required],

  //   });
  // }

  getDepartmentList() {
    this.departmentService.getDepartmentList().subscribe(res => {
      this._depDto = res;


    })
  }


  resetStaffRegForm() {
    this.staffReg.reset();
  }
  get mobile(): AbstractControl {
    return this.staffReg.get('mobile') as AbstractControl;
  }

  updateStaff(formValues: FormGroup) {
    if (formValues.valid) {

      if (formValues.value.password != formValues.value.cpassword) {
        this.toastr.error("Password do not match");
        return;
      }

      let staffData = { ...formValues.getRawValue() };
      delete staffData.cpassword;

      staffData.activeStatus = parseInt(staffData.activeStatus);
      staffData.departmentId = parseInt(staffData.departmentId);
      staffData.staffId = this.staffId;
      console.log("staff data ", staffData)

      this.staffService.updateStaff(this.staffId, staffData).subscribe(res => {
        res ? this.toastr.success("Staff info updated Successfully", "Update Staff Info") : null;
        this.route.navigate([routes.staffList]);

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
}
