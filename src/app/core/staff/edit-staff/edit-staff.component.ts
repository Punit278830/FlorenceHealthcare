import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss'],
  providers: [DatePipe],
})
export class EditStaffComponent implements OnInit {
  public routes = routes;
  public deleteIcon  = true;
  public selectedValue !: string  ;
  private staffId!:number;
   staffReg!:FormGroup;
  private _staffDto!:IstaffInfo;
  public passtype='password';
  public pass='';
  public confirmPass='';
  public PassConfirmType='password';
  public passwordClass = false;
  

     
  constructor(private fb: FormBuilder,
    private staffService:StaffService,
    private datePipe: DatePipe,
    private route:Router,
    private toastr:ToastrService) {
  this.createStaffRegrestrationForm();
 this.staffId=this.staffService.staffId;
 if(this.staffId){
 this.getStaffInfo(this.staffId);
 }
 else{
  routes.staffList;
  this.route.navigate([routes.staffList]);
 }
   
    
  }

  ngOnInit(): void {
      //this.staffReg=this._staffDto;
      console.log()
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }

   

  getStaffInfo(sid:number)
  {
    this.staffService.getStaff(sid).subscribe((data:IstaffInfo)=>{
      console.log(data);

      this._staffDto=data;
      //this.fillStaffDataInForm()
      this.staffReg.patchValue(this._staffDto);
       this.staffReg.get('departmentId')?.patchValue(this._staffDto.departmentId)
       //this.staffReg.patchValue({activeStatus:this._staffDto.activeStatus})
      this.staffReg.get('activeStatus')?.patchValue(this._staffDto.activeStatus)


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
    {key:1,value: 'Select  Department'},
    {key:2,value: 'Orthopedics'},
    {key:3,value: 'Radiology'},
    {key:4,value: 'Dentist'},
  ];

  status= [
   {key:1,value: 'Active'},
    {key:2,value: 'Inactive'},
    
  ];

  ConsultationFeeList:number[]=[0,100,200,300,400,500,600,700,800,900,1000]
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

  designationList:data[]=[
    {value:'admin'},
    {value:'Doctor'},
    {value:'reception'},
    {value:'Nursing'},

  ]


  selectedList2: data[] = [
    {value: 'Select City'},
    {value: 'Alaska'},
    {value: 'Los Angeles'},
  ];
  selectedList3: data[] = [
    {value: 'Select Country'},
    {value: 'Usa'},
    {value: 'Uk'},
    {value: 'Italy'},
  ];
  selectedList4: data[] = [
    {value: 'Select State'},
    {value: 'Alaska'},
    {value: 'California'},
  ];

  createStaffRegrestrationForm()
  {
    this.staffReg = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      departmentId: [null,Validators.required],
      designation: ['',Validators.required],
      consultationFee: [0,Validators.required],
      activeStatus: [null,Validators.required],
      password: ['',Validators.required],
      education:['',Validators.required],
      gender:['',Validators.required],
      dob:['',Validators.required],
      doj:['',Validators.required],
      
    });
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

  resetStaffRegForm()
  {
    this.staffReg.reset();
  }

  updateStaff(formValues:FormGroup)  {
    

    this._staffDto=formValues.getRawValue();
    this._staffDto.activeStatus=parseInt(formValues.value.activeStatus)
    this._staffDto.departmentId=parseInt(formValues.value.departmentId)
    //this.staffService.updateStaff(this._staffDto);
    this._staffDto.staffId=this.staffId;
    this.staffService.updateStaff(this.staffId,this._staffDto).subscribe(res=>{
      res?this.toastr.success("Staff Info Updated Successfully","Update Staff Info"):null;
      this.route.navigate([routes.staffList]);
  })
    
    
       
  }

  onSelectionChange(event:MatSelectChange)
  {
    if((event.value).toLowerCase()!='doctor')
    {
      this.staffReg.get('consultationFee')?.patchValue(0);
      this.staffReg.get('consultationFee')?.disable();
       
    }
    else{
      this.staffReg.get('consultationFee')?.enable();
    }
   
   
    
  }
}
