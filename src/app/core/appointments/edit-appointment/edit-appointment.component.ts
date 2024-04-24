import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { FileUploadService } from 'src/app/shared/Services/fileUpload/file-upload.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { Iappointment, Idepartment, IfileUpload, IpatientInfo, IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}

interface IdownloadFile {
  fileName: string ;
  downloadLink:string;
}
@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss'],
  providers:[DatePipe],
})
export class EditAppointmentComponent implements OnInit {
public routes = routes;
  public selectedValue! : string  ;
  public searchResults:IpatientInfo[]=[];
  public patientAppointmentData:IpatientInfo[]=[];
  public appointmentDto:Iappointment ={} as Iappointment ;
  public bookappointment!:FormGroup;
  private patientId!:number;
  private formattedDateTime: any;
  public age!:number;
  public doctorList:IstaffInfo[]=[];
  public selectedDoctor:IstaffInfo={} as IstaffInfo;
  public departmentList:Idepartment[]=[];
  public combinedData:any[]=[];
  public deleteIcon=false;
  public selectedFile!:File
  private FileUploadDto:IfileUpload={}as IfileUpload;
  public base64String!:string;
  public base64StringArray:string[]=[];
  public downloadLink:any;
  public downLoadList:IdownloadFile[]=[];
  
  public downlodedFileName!:string
  @ViewChild('searchDataValue') searchInput!: ElementRef;
    //public searchDataValue = '';
constructor(private patierntService:PatientService,private route:Router,
  private appointmentService:AppointmentService,
  private fb:FormBuilder,
  private datePipe: DatePipe,
  private staffService:StaffService,
  private departmentService:DepartmentService,
  private patientService:PatientService,
  private fileUploadService:FileUploadService,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService
  )
{
 
 if(!this.appointmentService.appointmentId)
 {
  this.navigation();
 }
  this.getDepartmentLits();
  

}


ngOnInit()
{
  this.getAppointDetail(this.appointmentService.appointmentId);
  this.appointmentFormInitlize();
  this.updateFormattedDateTime();
  this.downloadPatientFile();

  
}
  appointmentStatusData=[
    {value:'Active'},
    {value:'In Active'},
    {value:'Cancel'},
  ];

  IdentityDocNumber=[
  {value:'Aadhar Card'},
  {value:'Driving Licence'},
  {value:'voterID'},
  {value:'ABHA ID'},
  {value:'Passport'},
  ]

  getAppointDetail(id:number)
  {
    this.appointmentService.getAppointmentById(id).subscribe(res=>{
      console.log("appointmentdata"+res)
      this.appointmentDto=res;
      this.patchAppointmentForm(this.appointmentDto)
      });
    

  }

  
  patchAppointmentForm(appointmentData:Iappointment)
    {
       this.bookappointment.get('departmentId')?.patchValue(appointmentData.departmentid);
       this.bookappointment.get('notes')?.patchValue(appointmentData.notes);
      this.bookappointment.get('appointmentStatus')?.patchValue(appointmentData.appointmentStatus);
      this.bookappointment.get('IdentiyName')?.patchValue(appointmentData.identiyName);
      this.bookappointment.get('IdentiyNumber')?.patchValue(appointmentData.identiyNumber);
      this.bookappointment.get('date')?.patchValue(appointmentData.date);
      
    }


appointmentFormInitlize()
{
  this.bookappointment=this.fb.group({
  date:['',Validators.required],
  doctorId:[null,Validators.required],
  notes:[''],
  appointmentStatus:['Active',Validators.required],
  IdentiyNumber:['',Validators.required],
  IdentiyName:['',Validators.required],
  departmentId:[null,Validators.required]
  
}) 
}

  
  updateFormattedDateTime() {
  const currentDate = new Date();
  console.log("currentDate"+currentDate)
  //this.formattedDateTime = this.datePipe.transform(currentDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
  this.formattedDateTime=currentDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
  console.log(this.formattedDateTime)
}

  updateBookAppointment(appointment:any)
  {
    const userData=JSON.parse(localStorage.getItem('data')||'');
    this.appointmentDto.date=this.formattedDateTime;
    this.appointmentDto.doctorId=appointment.value.doctorId;
    this.appointmentDto.notes=appointment.value.notes;
     this.appointmentDto.identiyName=appointment.value.IdentiyName;
    this.appointmentDto.identiyNumber=appointment.value.IdentiyNumber;
    this.appointmentDto.appointmentStatus=appointment.value.appointmentStatus;
    //this.appointmentDto.patientId=this.patientId;
    this.appointmentDto.scheduledByid=userData.loginId;
    this.appointmentService.updateAppointment(this.appointmentService.appointmentId, this.appointmentDto).subscribe(result=>{
      console.log(result);
      this.toastr.success("Appointmnt Updated Successfuly","Update Appointment");
      this.route.navigate([routes.appointmentList]);
  })
  
  

  }

 
  // calculateDateDifference(dob:Date) {
  //   const start = new Date(dob);
  //   const end = new Date();
  //   // Calculate the difference in years
  //   const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
  //   const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
    
  //   this.age = yearsDifference;
    
  // }

  getDepartmentLits()
  {
   this.departmentService.getDepartmentList().subscribe((data:any)=>{
    console.log(data);
    data.map((res:any)=>{
      this.departmentList.push(res)
    })

   })
  }

  async loadDoctorData(event:any)
  {
    this.appointmentDto.departmentid=event.value;
    await this.staffService.getDoctorsListByDepartment(event.value).subscribe((data:any)=>{
        
      data.map((res:any)=>{
        this.doctorList.push(res)
      })

    })
   
  }

  addFee(event:any){

 const value=this.doctorList.find(result=>result.staffId==event.value)
 if(value)
 {
  this.appointmentDto.fee=value.consultationFee;
 }
 
  }
onUpload()
  {
    if (this.selectedFile) {
        this.spinner.show(); 
      const reader = new FileReader();
      reader.onload = () => {
      this.base64String = reader.result as string;
      this.FileUploadDto.fileName=this.selectedFile.name;
      this.FileUploadDto.FileType=this.selectedFile.type;
      this.FileUploadDto.fileData=this.base64String;
      //this.FileUploadDto.FileData= this.base64String;
      this.FileUploadDto.AppointmentId=this.appointmentService.appointmentId;
      this.fileUploadService.uploadFiletoDataBase(this.FileUploadDto).subscribe(result=>{
      console.log(result);
      this.spinner.hide();
      this.toastr.success('File uploaded Successfully', 'Success');
      
      });

     
      
     this.downloadPatientFile(); 
      
  },
   reader.readAsDataURL(this.selectedFile);
}
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.onUpload();
    
    
  }
  deleteIconFunc()
  {
    this.deleteIcon = !this.deleteIcon
    
  }

  downloadPatientFile()
  {
        this.spinner.show();
    this.base64StringArray=[];
    this.fileUploadService.getUpodedFileByAppointment(this.appointmentService.appointmentId).subscribe((data:any)=>{

      JSON.parse(data).map((res:any)=>{
      //   const x=JSON.parse(res).fileData||'';
      //    const fileName=JSON.parse(data).fileName;
      // const type=JSON.parse(data).fileType;
      const addDownloads={fileName:'',downloadLink:''};
      const x=res.fileData||'';
         this.downlodedFileName=res.fileName;
      const type=res.fileType;
      if(x)
      {
        let base64Data
        if(type=='image/jpeg')
        {
          base64Data=(x.split('jpeg;base64,'))[1]
        }
        if(type=='application/pdf')
        {
          base64Data=(x.split('pdf;base64,'))[1]
        }
        
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
   const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const objectUrl = URL.createObjectURL(blob);
    addDownloads.fileName=this.downlodedFileName;
    addDownloads.downloadLink=objectUrl;
    this.downLoadList.push(addDownloads);
    console.log("downLoadList"+this.downLoadList);
    }
    })
    this.spinner.hide();
    },
    (error) => {
        console.error('Download failed:', error);
        //this.toastr.error("No file available for this user");
    this.spinner.hide();

      })
  }

  downloadFile()
  {
    this.downloadLink.click();
  }

  navigation()
  {
    this.route.navigate([routes.appointmentList])
    
  }
}