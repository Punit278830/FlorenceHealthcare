import { Component } from '@angular/core';
import { FormGroupDirective, FormGroup, FormBuilder , Validators } from '@angular/forms';
import { IinvoiceItem } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from 'src/app/shared/Services/invoice/invoice.service';

@Component({
  selector: 'app-add-invoice-item',
  templateUrl: './add-invoice-item.component.html',
  styleUrls: ['./add-invoice-item.component.scss']
})
export class AddInvoiceItemComponent {

  public routes = routes;
  public invoiceItem!: FormGroup;
  public invoicedto!: IinvoiceItem;

  constructor(private fb: FormBuilder,
    private InvoiceService:InvoiceService,
    private toater:ToastrService,

    private route: Router) {
    this.createItem()


    // this.createPatient();
  }

  createItem() {
    this.invoiceItem = this.fb.group({
      itemName: ['', [Validators.required]],
      description: ['', Validators.required],
      discount: ['', Validators.required],
      fee: ['', Validators.required],
    })
  }

  addInvoiceItem(invoiceItem:FormGroup){
    if(this.invoiceItem.valid){
      console.log(invoiceItem.value)
      this.invoicedto=invoiceItem.value;
      //this.invoicedto.regstrationDate=parse(dd ,'yyyy-MM-dd', new Date());
      this.InvoiceService.postInvoiceItem(this.invoicedto).subscribe(res=>{
        res?this.toater.success("Invoice Item added successfully"):null;
        
      })
      this.createItem()

    }else
    {
      this.invoiceItem.markAllAsTouched()

    }
   

  }
}
