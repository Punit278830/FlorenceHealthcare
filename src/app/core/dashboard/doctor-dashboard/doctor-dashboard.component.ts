import { Component, ViewChild,OnInit, OnDestroy } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexResponsive,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
} from 'ng-apexcharts';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, Subscription } from 'rxjs';
import { MedicineService } from 'src/app/shared/Services/medicine/medicine.service';
import { ReturnStatement } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { IPredefineDiagnosis, ImedicineMaster } from 'src/app/shared/models/models';
import { ConsultService } from 'src/app/shared/Services/consultation/consult.service';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { HospitalService } from 'src/app/shared/Services/hospital/hospital.service';
import { SuperAdminService } from 'src/app/shared/Services/super-admin/super-admin.service';
interface data {
  value: string ;
}
export type ChartOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  series: ApexAxisChartSeries | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chart: ApexChart | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xaxis: ApexXAxis | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLabels: ApexDataLabels | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grid: ApexGrid | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fill: ApexFill | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markers: ApexMarkers | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yaxis: ApexYAxis | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stroke: ApexStroke | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: ApexTitleSubtitle | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responsive: ApexResponsive[] | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotOptions: ApexPlotOptions | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip: ApexTooltip | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legend: ApexLegend | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent implements OnInit, OnDestroy {
  public routes = routes;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsOne: Partial<ChartOptions>;
  public chartOptionsTwo: Partial<ChartOptions>;
  public chartOptionsThree: Partial<ChartOptions>;
  public selectedValue ! : string  ;
  public CurrentTime=0;
  public greetingMsg='Good Morning';
  public userName='';
  public MedForm!:FormGroup;
  private medMasterDto!:ImedicineMaster;
  public submitMedicineDisable=false;
  public diagnosForm!:FormGroup;
  private _diafnosDto!:IPredefineDiagnosis;
  public isMedicineFormVisible=false;
  public isDiafnosFormVisible=false;
  public isDiagnosisFormVisble=false;
  public MedicineList:ImedicineMaster[]=[];
  public diagnosisTemplateList:IPredefineDiagnosis[]=[];
  private diagnosisDto!:IPredefineDiagnosis;
  public isDiagnosisEdited=false;
  private doctorId!:number;
  public appCount=0;
  public consultatCount=0;
  public earning=0;
  private hospitalSubscription: Subscription = new Subscription();
  
  // Hospital selection state
  public isSuperAdmin = false;
  public hospitalSelected = false;
  public showHospitalSelectionPrompt = false;


  constructor(private _auth:AuthService,
    private fb:FormBuilder,
    private medicineService:MedicineService,
    private toaster:ToastrService,
    private consultService:ConsultService,
    private appointmentService:AppointmentService,
    private hospitalService: HospitalService,
    private superAdminService: SuperAdminService) {
    this.chartOptionsOne = {
      chart: {
        height: 200,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true, 
        xaxis: {
          lines: {
            show: false
           }
         },  
        yaxis: {
          lines: { 
            show: true 
           }
         },   
        },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'Income',
          color: '#2E37A4',
          data: [45, 60, 75, 51, 42, 42, 30],
        },
      ],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      },
    };
    this.chartOptionsTwo = {
      chart: {
        height: 250,
        width: 330,
        type: 'donut',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
        },
      },
      dataLabels: {
        enabled: false,
      },

      series: [44, 55],
      labels: ['Male', 'Female'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };
    this.chartOptionsThree = {
      chart: {
        height: 230,
        type: 'bar',
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true, 
        xaxis: {
          lines: {
            show: false
           }
         },  
        yaxis: {
          lines: { 
            show: true 
           }
         },   
        },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 6,
        colors: ['transparent'],
      },
      series: [
        {
          name: 'Low',
          color: '#D5D7ED',
          data: [20, 30, 41, 67, 22, 43, 40, 10, 30, 20, 40],
        },
        {
          name: 'High',
          color: '#2E37A4',
          data: [13, 23, 20, 8, 13, 27, 30, 25, 10, 15, 20],
        },
      ],
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
    };
  }

  public medType=[
"Tab","Cap","Syp","Inj"
  ];
 
  public ngOnInit()
  {
    this.getGreetingMsg();
    const data=JSON.parse(localStorage.getItem('data')||'')
    this.userName=data.fname +" "+data.lname;
    this.doctorId=data.loginId;

    // Check if user is super admin
    this.checkSuperAdminStatus();

    this.initlizeMedForm();
    this.initlizeDiagnosForm();
    this.getMedicine();

    // Subscribe to hospital changes
    this.hospitalSubscription = this.hospitalService.currentHospitalId$.subscribe(hospitalId => {
      this.hospitalSelected = hospitalId !== null;
      
      if (this.isSuperAdmin && !this.hospitalSelected) {
        // Super admin without hospital selection - show prompt
        this.showHospitalSelectionPrompt = true;
      } else {
        // Hospital selected or regular user - load data
        this.showHospitalSelectionPrompt = false;
        this.loadDashboardData();
      }
    });
  }
  
  public ngOnDestroy() {
    this.hospitalSubscription.unsubscribe();
  }
  
  private checkSuperAdminStatus(): void {
    // Check from localStorage first
    const userData = JSON.parse(localStorage.getItem('data') || '{}');
    const userRole = userData.userRole?.toLowerCase();
    this.isSuperAdmin = userRole === 'globalsuperadmin' || userRole === 'superadmin';
    
    // Also check via super admin service for accuracy
    this.superAdminService.superAdminStatus$.subscribe(status => {
      if (status) {
        this.isSuperAdmin = status.isCurrentUserSuperAdmin;
      }
    });
  }
  
  private loadDashboardData() {
    // Don't make API calls if super admin hasn't selected a hospital
    if (this.isSuperAdmin && !this.hospitalSelected) {
      console.log('Skipping API calls - no hospital selected for super admin');
      return;
    }
    
    this.totalEarning();
    this.appointmentCount();
    this.consultationCount();
  }

  public status=[{key:1,value:'Active'},{key:2,value:'In active'}]

  initlizeDiagnosForm()
  {
    this.diagnosForm=this.fb.group({
  diagnosName:['',Validators.required],
  diagnosText:['',Validators.required],
  diagnosStatus:['',Validators.required]


    })
  }
  initlizeMedForm()
  {
    this.MedForm=this.fb.group({
      medName:['',Validators.required],
      genericName:['',Validators.required],
      manufactureName:['',Validators.required],
      medType:['',Validators.required],
      unit:['',Validators.required]
    })
  }

  appointmentCount()
  {
    this.appointmentService.getAppointmentCountByDoctorId(this.doctorId).subscribe(res=>{
      res>0?this.appCount=res:this.appCount=0;


    })
  }

  consultationCount()
  {
    this.appointmentService.getConsultationByDoctorId(this.doctorId).subscribe(res=>{
      res>0?this.consultatCount=res:this.consultatCount=0;


    })

  }

  totalEarning()
  {
    this.appointmentService.getEarningByDoctorId(this.doctorId).subscribe(res=>{
      res>0?this.earning=res:this.earning=0;


    })

  }

   subscribeToSearchChanges() {

    
   
    
    const medicineName=this.MedForm.get('medName')?.value
    this.medicineService.searchMedicine(medicineName).subscribe(res=>{
      if(res===true)
      {
        this.submitMedicineDisable=true;
        
      }
      if(res===false)
      {
        this.submitMedicineDisable=false;

      }
    })
        
  }

  addMedicenetoDB(medData:FormGroup)
  {
    this.medMasterDto=medData.value;
    this.medicineService.addMedicine(this.medMasterDto).subscribe(res=>{
      this.toaster.success("Medicine added to master","Add Medicine");
      this.getMedicine();
      this.MedForm.reset();
    })

  }
public getGreetingMsg()
  {
    this.CurrentTime = new Date().getHours()

    if(this.CurrentTime>0 && this.CurrentTime<12)
    {this.greetingMsg='Good Morning'}
    
      if(this.CurrentTime>=12 && this.CurrentTime<17)
      {this.greetingMsg='Good AfterNoon'}
    
      if(this.CurrentTime>=17 && this.CurrentTime<20)
      {this.greetingMsg='Good Evening'}
      if(this.CurrentTime>=20 && this.CurrentTime<24)
      {this.greetingMsg='Good Evening'}
    
  }

  selecedList: data[] = [
    {value: '2022'},
    {value: '2021'},
    {value: '2020'},
    {value: '2019'},
  ];
  selecedLists: data[] = [
    {value: 'This Week'},
    {value: 'Last Week'},
    {value: 'This Month'},
    {value: 'Last Month'},
  ];

  
  

  addNewDiagnosis(diagnosValue:FormGroup)
  {
   this._diafnosDto=diagnosValue.value;
    this.consultService.createDiagnosis(this._diafnosDto).subscribe(res=>{
      this.toaster.success("Diagnosis added to Diagnosis template","Add Diagnosis")
      this.diagnosForm.reset();
    })
    

  }

  showMedicineForm()
  {
    this.getMedicine();
   this.isMedicineFormVisible=false;
   this.isDiafnosFormVisible=true;
  }


  showAddDiagnosis()
  {
    this.getDiagnosisTemplate();
   this.isDiafnosFormVisible=false;
   this.isMedicineFormVisible=true;
  }

  cancel()
  {
    this.MedForm.reset();
    this.diagnosForm.reset();
    //this.isMedicineFormVisible=!this.isMedicineFormVisible
  }

  getMedicine()
  {
    this.medicineService.getAllMedicine().subscribe(res=>{
      this.MedicineList=res;
    })
  }

  getDiagnosisTemplate()
  {
    this.consultService.GetAllDiagnosis().subscribe(res=>{
      this.diagnosisTemplateList=res;
    })
   
  }

  deleteMedicine(id:number)
  {
    this.medicineService.deleteMedicienById(id).subscribe(res=>{
      if(res)
      {
        this.toaster.success("Medicien deleted successfully","Delete Medicien");
        this.getMedicine();
      }
    })
   
  }

  EditDiadnosisTemplate(id:number)
  {
    this.isDiagnosisEdited=true;
    this.consultService.GetDiagnosisbyId(id).subscribe(res=>{
      this.diagnosisDto=res;
      this.consultService.diagnosisId=this.diagnosisDto.diagnosId;
this.diagnosForm.get('diagnosName')?.patchValue(this.diagnosisDto.diagnosName);
this.diagnosForm.get('diagnosStatus')?.patchValue(this.diagnosisDto.diagnosStatus);
this.diagnosForm.get('diagnosText')?.patchValue(this.diagnosisDto.diagnosText);
    })
  }
  updateDiagnosisData()
  {
    const id=this.consultService.diagnosisId;
    this.diagnosisDto=this.diagnosForm.value;
    this.diagnosisDto.diagnosId=this.consultService.diagnosisId;
    this.consultService.updatediagnosisById(id,this.diagnosisDto).subscribe(res=>{
     this.toaster.success("Template Updated Successfully","Update Template")
     this.diagnosForm.reset();
     this.getDiagnosisTemplate();
  
    })
  }
}
