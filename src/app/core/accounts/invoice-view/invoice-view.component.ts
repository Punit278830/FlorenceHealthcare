import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { InvoiceService } from 'src/app/shared/Services/invoice/invoice.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { Iappointment, Iinvoice, IpatientInfo, IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit {
  @ViewChild('printview', { static: false }) printView!: ElementRef;
  public routes = routes;
  public invoiceDetails!:Iinvoice;
  private invoiceId!:number;
  public patientDetails!:IpatientInfo;
  public appointmentDetails!:Iappointment;
  public doctorDetails!:IstaffInfo;
  public addtionalInoiveItem:any[]=[];
  public totalInvoiceAmount=0;
  public balanceAmount=0;
  public isPaidButtonVisible=true;

  constructor(private invoiceService:InvoiceService,
    private patientService:PatientService,
    private appointmentService:AppointmentService,
    private staffService:StaffService,
    private toastr:ToastrService,
    private route:Router)
  {
    if(!this.invoiceService.invoiceId)
    {
      this.route.navigate(['/accounts/invoices'])
    }
    
  }

  getInvoiceDetails()
  {
    
    this.invoiceId=this.invoiceService.invoiceId;
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe(res=>{
      if(res.status=='Paid')
      {
        this.isPaidButtonVisible=false;
      }
      else{
        this.isPaidButtonVisible=true;
      }
      this.invoiceDetails=res;
      if(res.status=='un Paid')
      {
        //this.isPaidButtonVisible=false;
        this.balanceAmount=this.balanceAmount+res.amount;
      }
      this.totalInvoiceAmount=this.totalInvoiceAmount+res.amount;
    this.getPatientDetails(res.patientId);
    this.getAppointDetails(res.appoitmentId);
    this.getAddtionalItems(this.invoiceId)
    
    })
    
   
    
  }

  ngOnInit()
  {
    this.getInvoiceDetails();

  }

  getPatientDetails(id:number)
  {
    this.patientService.getPatientData(id).subscribe(res=>{
      this.patientDetails=res;

    })
  }


  getAppointDetails(id:number)
  {
    this.appointmentService.getAppointmentById(id).subscribe(res=>{
      this.appointmentDetails=res;
      this.getDoctorDetails();
    })
  }

  getDoctorDetails()
  {
    this.staffService.getStaffByID(this.appointmentDetails.doctorId).subscribe(res=>{
      this.doctorDetails=res;
    }
      )
  }
  paidinvoice(id:number)
  {
    this.invoiceDetails.status='Paid';
    this.invoiceService.updateInvoice(id,this.invoiceDetails).subscribe(res=>{
      if(res)
      {
        this.getInvoiceDetails();
        this.balanceAmount=0;
        this.toastr.success("Invoice Paid Successfully","Update Invoice");
        
      }
    })

  }

  print()
{
  this.isPaidButtonVisible=false;
  const printContents = this.printView.nativeElement.innerHTML;
const originalContents = document.body.innerHTML;
document.body.innerHTML = printContents;
window.print();
document.body.innerHTML = originalContents; 
 }

 getAddtionalItems(id:number)
 {

  this.invoiceService.getAddtionalInvoiceItemById(id).subscribe((res:any)=>{
    
    this.addtionalInoiveItem=res;
    res.map((data:any)=>{
      if(data.status=='un Paid')
      {
        this.isPaidButtonVisible=false;
        this.balanceAmount=this.balanceAmount+data.finalAmount;
      }
      this.totalInvoiceAmount=this.totalInvoiceAmount+data.finalAmount;
    })

    
  })
 }

 paidsubInvoiceItem(id:number)
 {
  this.invoiceService.getAddtionalSubInvoiceItemById(id).subscribe((result:any)=>{
    result.status='Paid';
    this.invoiceService.updateSubInvoiceItem(id,result).subscribe(res=>{
      this.toastr.success("Invoice Paid",'Paid');
      this.balanceAmount=0;
      this.totalInvoiceAmount=0;
      this.getInvoiceDetails();
    })
  })
  
 }

}
