import { Component } from '@angular/core';
import { FormGroupDirective, FormGroup, FormBuilder , Validators } from '@angular/forms';
import { IinvoiceItem } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { ActivatedRoute, Router } from '@angular/router';
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
  public invoiceItemForm!: FormGroup;
  public selectedItem!: IinvoiceItem;
  public invoicedto!: IinvoiceItem;
  invoiceitems: any[] = [];
  itemId!: number;
  public isEditMode!: boolean;

  constructor(private fb: FormBuilder,
    private InvoiceService:InvoiceService,
    private toater:ToastrService,
    private activeroute: ActivatedRoute,
    private route: Router) {
   


    // this.createPatient();
  }

  ngOnInit(): void {
    this.createItem();
    this.getAllInvoiceItem();
    // Get the ID from the route
    this.itemId = Number(this.activeroute.snapshot.paramMap.get('id'));
    console.log('idddd ', this.itemId);
    
    if (this.itemId) {
      // Fetch item details if ID is present
      this.getInvoiceItemById(this.itemId);
    }
    
  }

// Method to fetch data and patch the form
getInvoiceItemById(id: number) {
  this.InvoiceService.getInvoiceMasterById(id).subscribe(
    (res) => {
      if (res && this.invoiceItem) {
        console.log('Fetched Item:', res);
        // Patch the form with the fetched data
        this.invoiceItem.patchValue({
          itemName: res.itemName || '',
          description: res.description || '',
          discount: res.discount || 0,
          fee: res.fee || 0
        });
      } else {
        console.error('Response is undefined or form is not initialized');
      }
    },
    (error) => {
      console.error('Error fetching item details:', error);
    }
  );
}


  deleteInvoiceItem(id: number) {
    console.log('deleteId', id);
    if (id) {
      this.confirmDelete(id);
    } else {
      console.error('Invalid item ID');
    }
  }
  

  confirmDelete(id: number) {
    this.InvoiceService.deleteInvoiceItems(id).subscribe({
      next: (res) => {
        if (res == null) {
          this.toater.success("Invoice Item is deleted!");
          this.getAllInvoiceItem(); 
        }
      },
      error: (err) => {
        console.error('Error deleting item:', err);
        this.toater.error('Failed to delete item');
      }
    });
  }
  

  onEditItem(id: number) {
    this.isEditMode = true;
    console.log('Editing Item ID:', id);
    this.InvoiceService.itemId=id;
    // Fetch item details if ID is present
    this.getInvoiceItemById(id);
    // Navigate to the edit page with the item ID as a route parameter
    this.route.navigate([routes.editInvoiceItem]);
  }
  
  getAllInvoiceItem() : void {
    this.InvoiceService.getAllInvoiceMaster().subscribe((data:any) =>{
      this.invoiceitems=data;
      console.log('INVOICE ITEMS:', data);
    }
  
  )};

  createItem() {
    this.invoiceItem = this.fb.group({
      itemName: ['', [Validators.required]],
      description: ['', Validators.required],
      discount: ['', Validators.required],
      fee: ['', Validators.required],
    })
  }

  // addInvoiceItem(invoiceItem:FormGroup){
  //   if(this.invoiceItem.valid){
  //     console.log(invoiceItem.value)
  //     this.invoicedto=invoiceItem.value;
  //     //this.invoicedto.regstrationDate=parse(dd ,'yyyy-MM-dd', new Date());
  //     this.InvoiceService.postInvoiceItem(this.invoicedto).subscribe(res=>{
  //       res?this.toater.success("Invoice Item added successfully"):null;
  //       this.getAllInvoiceItem();
  //     })
  //     this.createItem()

  //   }else
  //   {
  //     this.invoiceItem.markAllAsTouched()

  //   }
   
    addInvoiceItem(invoiceItem: FormGroup) {
      this.isEditMode = false;
      if (this.invoiceItem.valid) {
        console.log(invoiceItem.value);
        this.invoicedto = invoiceItem.value;
    
        // Check if it's an edit operation or a new add operation
        if (this.InvoiceService.itemId) {
          // Update existing item
          this.invoicedto.itemId = this.InvoiceService.itemId; // Ensure the ID is set for updating
          this.InvoiceService.putInvoiceMastersItem(this.invoicedto.itemId, this.invoicedto).subscribe({
            next: (res:any) => {
              this.toater.success("Invoice Item updated successfully");
              this.getAllInvoiceItem();
              this.resetForm(); // Reset form after update
              this.InvoiceService.itemId = 0; // Clear the itemId after update
            },
            error: (err:any) => {
              console.error('Error updating item:', err);
              this.toater.error("Failed to update Invoice Item");
            }
          });
        } else {
          // Add new item
          this.InvoiceService.postInvoiceItem(this.invoicedto).subscribe({
            next: (res) => {
              res ? this.toater.success("Invoice Item added successfully") : null;
              this.getAllInvoiceItem();
              this.resetForm(); // Reset form after add
            },
            error: (err:any) => {
              console.error('Error adding item:', err);
              this.toater.error("Failed to add Invoice Item");
            }
          });
        }
      } else {
        this.invoiceItem.markAllAsTouched();
      }
    }
    
    // Helper method to reset the form
    resetForm() {
      this.invoiceItem.reset();
      this.createItem(); // Reinitialize form with empty values
    }
    

}
