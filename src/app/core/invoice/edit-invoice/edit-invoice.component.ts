import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from 'src/app/shared/Services/invoice/invoice.service';
import { IinvoiceItem, Ilogin, IstaffInfo } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string;
}
@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss']
})
export class EditInvoiceComponent implements OnInit {
  public routes = routes;
  public selectedValue !: string;
  date = new FormControl(new Date());
  public addItemFormGroup!: FormGroup;
  public invoiceItemForm!: FormGroup;
  public allnvoiceItems: any[] = [];
  public total = 0;
  private IinvoiceDto!: IinvoiceItem;
  private loggedInUser!: Ilogin;
  public flag: boolean = false;
  alreadyAddedItems: Set<string> = new Set();
  public selectedItem: any;

  constructor(private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private route: Router) {
    this.loggedInUser = JSON.parse(localStorage.getItem('data') || '')
    if (!this.invoiceService.invoiceId) {
      this.route.navigate([routes.invoices]);
    }

  }

  selectedList2: data[] = [
    { value: 'Select  Tax' },
    { value: 'VAT' },
    { value: 'GST' },
    { value: 'No GST' },
  ];
  selectedList3: data[] = [
    { value: 'Select Payment Method' },
    { value: 'Debit Card' },
    { value: 'Gpay' },
  ];
  selectedList4: data[] = [
    { value: 'Select  Tax' },
    { value: 'Paid' },
    { value: 'Unpaid' },
    { value: 'Partially Paid' },
  ];

  ngOnInit() {
    this.initlizeInvoiceMasterForm();
    this.InitlizeInvoiceItemForm();
    this.getInvoiceMaster();
    this.getAddtionalItemsForInvoice(this.invoiceService.invoiceId);
    this.addItemFormGroup.get('discount')?.valueChanges.subscribe(() => {
      console.log("dis fee", this.addItemFormGroup.get('discount')?.value, this.addItemFormGroup.get('fee')?.value)
      this.updateTotal(this.addItemFormGroup.get('discount')?.value, this.addItemFormGroup.get('fee')?.value);
    });

  }

  getInvoiceMaster() {
    this.invoiceService.getAllInvoiceMaster().subscribe(res => {
      this.allnvoiceItems = res;
    })
  }



  InitlizeInvoiceItemForm() {
    this.addItemFormGroup = this.fb.group({
      itemName: [{ value: '', disabled: true }, Validators.required],
      description: [{ value: '', disabled: true }, Validators.required],
      discount: [{ value: '', disabled: true }, Validators.required],
      fee: [{ value: '', disabled: true }, Validators.required],
      finalAmount: [{ value: '', disabled: true }, Validators.required]
    });
  }

  initlizeInvoiceMasterForm() {
    this.invoiceItemForm = this.fb.group({
      InvoiceItem: ['', Validators.required]
    })
  }


  addItemToInvoice(event: any) {
    const id = event.value;
    const data = this.allnvoiceItems.find(e => e.itemId == id)
    this.addItemFormGroup.get('itemName')?.patchValue(data.itemName);
    this.addItemFormGroup.get('description')?.patchValue(data.description);
    this.addItemFormGroup.get('discount')?.patchValue(data.discount);
    this.addItemFormGroup.get('fee')?.patchValue(data.fee);
    this.updateTotal(data.discount, data.fee);
    this.flag = true;

    this.selectedItem = data;
  }

  submitItemToInvoice(formData: FormGroup) {
    if (this.alreadyAddedItems.has(this.selectedItem.itemName)) {
      this.toastr.error("Additional item already exists!");
    } else {
      this.alreadyAddedItems.add(this.selectedItem.itemName);
      this.IinvoiceDto = formData.getRawValue();
      this.IinvoiceDto.createdBy = this.loggedInUser.loginId;
      this.IinvoiceDto.invoiceId = this.invoiceService.invoiceId;
      this.IinvoiceDto.status = 'Unpaid';
      //delete this.IinvoiceDto.total;
      this.invoiceService.addToaddtionalItemInvoice(this.IinvoiceDto).subscribe(res => {
        this.toastr.success("Item Added to Invoice", "Invoice Item");
        this.addItemFormGroup.reset();
        this.invoiceService.invoiceId = this.IinvoiceDto.invoiceId;
        this.route.navigate(['/accounts/invoice-view']);
      });
    }
  }

  updateTotal(dis: any, fee: any) {
    if (dis <= 0) {
      this.addItemFormGroup.get('finalAmount')?.patchValue(fee);
    }
    else {

      this.total = fee - (fee * dis / 100);
      console.log("total", this.total)
      this.total = Math.round(this.total);
      console.log("total", this.total)
      this.addItemFormGroup.get('finalAmount')?.patchValue(this.total);
    }
  }

  getAddtionalItemsForInvoice(id: number) {
    this.invoiceService.getAddtionalInvoiceItemById(id).subscribe((res: any) => {
      res.map((data: any) => {
        this.alreadyAddedItems.add(data.itemName);
      })
    })
  }
}