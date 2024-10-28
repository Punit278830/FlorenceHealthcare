import { Component, ViewChild,OnInit } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexStroke,
  
} from 'ng-apexcharts';
import { Sort } from '@angular/material/sort';
import { DataService } from 'src/app/shared/data/data.service';
import { Iappointment, IpatientInfo, apiResultFormat, recentPatients, upcomingAppointments } from 'src/app/shared/models/models';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { InvoiceService } from 'src/app/shared/Services/invoice/invoice.service';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { forkJoin } from 'rxjs';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { Router } from '@angular/router';
export type ChartOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  series: ApexAxisChartSeries | any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chart: ApexChart | any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLabels: ApexDataLabels | any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotOptions: ApexPlotOptions | any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responsive: ApexResponsive[] | any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xaxis: ApexXAxis | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legend: ApexLegend | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fill: ApexFill | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grid: ApexGrid | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stroke: ApexStroke | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};
interface data {
  value: string ;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  public routes = routes;
  public selectedValue ! : string  ;
  public currentYear!: number;
  public recentYears: number[] = [];
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsOne: Partial<ChartOptions>;
  public chartOptionsTwo: Partial<ChartOptions>;
  public recentPatients: Array<any> = [];
  public upcomingAppointments: Array<any> = [];
  public CurrentTime=0;
  public greetingMsg='Good Morning';
  public userName='';
  public appCount=0;
  public consultatCount=0;
  public earning=0;
  public totalAmount=0;
  public combinedData:any[]  = [];
  public departments:any[]  = []
  public patientCountByGender: any[]=[];

  constructor(public data : DataService,
    private _auth:AuthService,
    private appointmentService:AppointmentService,
  private patientService:PatientService,
  private invoiceService:InvoiceService,
private staffService:StaffService,
private departmentService:DepartmentService,private route : Router) 
{
    this.chartOptionsOne = {
      chart: {
        height: 230,
        type: 'bar',
        stacked: true,
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
          columnWidth: '15%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      series: [
        {
          name: 'Male',
          color: '#2E37A4',
          data: [20, 30, 41, 67, 22, 43, 40, 10, 30, 20, 40],
        },
        {
          name: 'Female',
          color: '#00D3C7',
          data: [13, 23, 20, 8, 13, 27, 30, 25, 10, 15, 20],
        },
        {
          name: 'Transgender',
          color: '#FF0000',
          data: [10, 20, 31, 57, 62, 53, 70, 10, 30, 20, 40],
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
          axisBorder: {
            show: false, // set to false to hide the vertical gridlines
          },
        },
    };
    this.chartOptionsTwo = {
      series: [44, 55, 41, 17],
      chart: {
        type: 'donut',
        height: 200,
        width: 200,
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: false
      },
      plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '50%'
        },
    },
      dataLabels: {
        enabled: false,
      },
      responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
              show: false
            }
        }
    }],
    };
//     this.recentPatients = this.data.getPatientsList().slice(0, 5);
// this.upcomingAppointments = this.data.getAppointmentList().slice(0, 5);
    
  }
public ngOnInit(){
  this.getGreetingMsg();
  const data=JSON.parse(localStorage.getItem('data')||'')
this.userName=data.fname +" "+data.lname;
this.appointmentCount();
this.consultationCount();
//this.totalEarning();
this.totalAmounts();
this.loadRecentPatients();
    // this.loadUpcomingAppointments();
    this.fetchCombineData()
    this.currentYear = new Date().getFullYear(); // Get the current year
    this.generateRecentYears();
    this.getPatientCountByGender();
}

getPatientCountByGender(): void {
  this.patientService.getPatientCountByGender().subscribe((data: any) => {
      console.log('Fetched data:', data); // Log the response

      // Convert object to array format
      if (data && typeof data === 'object') {
          this.patientCountByGender = [
              { gender: 'male', count: data.male || 0 },
              { gender: 'female', count: data.female || 0 },
              { gender: 'transgender', count: data.transgender || 0 }
          ];
      } else {
          console.error('Unexpected data format:', data);
      }
  });
}
  
generateRecentYears() {
  const numberOfYears = 5; // Number of years to show in the dropdown
  for (let i = 0; i <= numberOfYears; i++) {
    this.recentYears.push(this.currentYear - i); // Add the current and recent years
  }
  }

loadRecentPatients(): void {
  this.patientService.getPatientList().subscribe((result) => {
    this.recentPatients = result.slice(0, 5);
  });
}

loadUpcomingAppointments(): void {
  this.appointmentService.getAppointmentList().subscribe((result) => {
    this.upcomingAppointments = result.slice(0, 5);
  });
}
movetoPatient(id: number) {
  this.patientService.patientId = id;

  this.route.navigate([routes.profile]);

}

fetchCombineData() {
  this.upcomingAppointments = [];
  

  let appointmentData$;
  appointmentData$ = this.appointmentService.getAppointmentList();
  

 
  const departmentData$ = this.departmentService.getDepartmentList();
  const staffData$ = this.staffService.getDoctorsList();
  const patientData$ = this.patientService.getPatientList();
  forkJoin([appointmentData$, departmentData$, staffData$, patientData$]).subscribe(([appointments, departments, staffs, patient]) => {
    // Combine data based on departmentId    
    this.departments=departments.slice(0,5);

    if (appointments.message === "No records found") {
      this.upcomingAppointments=[];
    }
    else {
      this.combinedData = appointments.map((appointment: any) => {
        const doctor = staffs.find((doctor: any) => doctor.staffId === appointment.doctorId)
        const patients = patient.find((patient: any) => patient.patientId === appointment.patientId)
        const department = departments.find((department: any) => department.departmentId === appointment.departmentid)


        return {
          ...appointment,
          doctorFname: doctor ? doctor.firstName : 'Unknown Doctor',
          doctorLname: doctor ? doctor.lastName : '',
          departmentName: department ? department.departmentName : 'Unknown Department',
          patientFname: patients ? patients.firstName : 'Unknon Patients',
          patientLname: patients ? patients.lastName : 'Unknon Patients',
          patientId: patients ? patients.patientId : 'Unknon Patients'
        };

      });


      this.combinedData.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= 0 && serialNumber <= 5) {
          this.upcomingAppointments.push(res);          
        }
      });

    }
  })}


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
      {this.greetingMsg='Good Night'}    
  }


  appointmentCount()
  {
    this.appointmentService.getAppointmentCount().subscribe(res=>{
      res>0?this.appCount=res:this.appCount=0;
    })
  }

  consultationCount()
  {
    this.appointmentService.getConsultationCount().subscribe(res=>{
      res>0?this.consultatCount=res:this.consultatCount=0;
    })

  }

  // totalEarning()
  // {
  //   this.appointmentService.getEarning().subscribe(res=>{
  //     res>0?this.earning=res:this.earning=0;
  //   })

  // }

  totalAmounts()
  {
    this.invoiceService.getTotalAmount().subscribe(res=>{
      res>0?this.totalAmount=res:this.totalAmount=0;
    }) }

  public sortData(sort: Sort) {
    const data = this.recentPatients.slice();
    const datas = this.upcomingAppointments.slice();

    if (!sort.active || sort.direction === '') {
      this.recentPatients = data;
      this.upcomingAppointments = datas;

    } else {
      this.recentPatients = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
      this.upcomingAppointments = datas.sort((a, b) => {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  selecedList: data[] = [
    {value:'2024'},
    {value: '2023'},
    {value: '2022'},
    {value: '2021'},
    {value: '2020'},
    {value: '2019'},
  ];
}
