import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from 'src/app/shared/Services/invoice/invoice.service';
import { IinvoiceItem, Ilogin, IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss']
})
export class EditInvoiceComponent implements OnInit {
  public routes = routes;
  public selectedValue !: string  ;
  date = new FormControl(new Date());
  public addItemFormGroup!:FormGroup;
  public invoiceItemForm!:FormGroup;
  public allnvoiceItems:any[]=[];
  public total=0;
  private IinvoiceDto!:IinvoiceItem;
  private loggedInUser!:Ilogin;

  constructor(private fb:FormBuilder,
    private invoiceService:InvoiceService,
    private toastr:ToastrService,
    private route:Router)
  {
    this.loggedInUser=JSON.parse(localStorage.getItem('data')||'')
    if(!this.invoiceService.invoiceId)
    {
      this.route.navigate([routes.invoices]);
    }

  }
  
    selectedList2: data[] = [
    {value: 'Select  Tax'},
    {value: 'VAT'},
    {value: 'GST'},
    {value: 'No GST'},
  ];
  selectedList3: data[] = [
    {value: 'Select Payment Method'},
    {value: 'Debit Card'},
    {value: 'Gpay'},
  ];
  selectedList4: data[] = [
    {value: 'Select  Tax'},
    {value: 'Paid'},
    {value: 'Un Paid'},
    {value: 'Partially Paid'},
  ];

  ngOnInit()
  {
    this.initlizeInvoiceMasterForm();
    this.InitlizeInvoiceItemForm();
    this.getInvoiceMaster();

  }

  getInvoiceMaster()
  {
    this.invoiceService.getAllInvoiceMaster().subscribe(res=>{
      this.allnvoiceItems=res;
    })
  }
  


  InitlizeInvoiceItemForm()
  {
    this.addItemFormGroup = this.fb.group({
      itemName: [{value: '', disabled: true}, Validators.required],
      description: [{value: '', disabled: true}, Validators.required],
      discount: [{value: '', disabled: false}, Validators.required],
      fee: [{value: '', disabled: true}, Validators.required],
      finalAmount: [{value: '', disabled: true}, Validators.required]
    });
  }

  initlizeInvoiceMasterForm()
  {
    this.invoiceItemForm=this.fb.group({
      InvoiceItem:['',Validators.required]
    })
  }


  addItemToInvoice(event:any)
  {
    const id=event.value;
    const data=this.allnvoiceItems.find(e=>e.itemId==id)
    this.addItemFormGroup.get('itemName')?.patchValue(data.itemName);
    this.addItemFormGroup.get('description')?.patchValue(data.description);
    this.addItemFormGroup.get('discount')?.patchValue(data.discount);
    this.addItemFormGroup.get('fee')?.patchValue(data.fee);
  }

  submitItemToInvoice(formData:FormGroup)
  {
    this.IinvoiceDto=formData.getRawValue();
    this.IinvoiceDto.createdBy=this.loggedInUser.loginId;
    this.IinvoiceDto.invoiceId=this.invoiceService.invoiceId;
    this.IinvoiceDto.status='un Paid';
    //delete this.IinvoiceDto.total;
    this.invoiceService.addToaddtionalItemInvoice(this.IinvoiceDto).subscribe(res=>{
      this.toastr.success("Item Added to Invoice","Invoice Item");
      this.addItemFormGroup.reset();

    })
    
    
   
  }

  updateTotal(dis:any, fee:any)
  {
    if(dis<=0)
    {
      this.total=fee;
    }
    else
    {

      this.total=fee-(fee*dis/100);
    this.total = Math.round(this.total);
    this.addItemFormGroup.get('finalAmount')?.patchValue(this.total);
    }
    
    
    
    


  }
}
