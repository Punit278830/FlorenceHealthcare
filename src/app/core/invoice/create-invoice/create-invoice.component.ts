import { Component, ElementRef, ViewChild } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { Iappointment, ICreateInvoiceDto, Idepartment, IinvoiceItem, Ilogin, IpatientInfo, IPaymentMode, IstaffInfo, Istaffschedule, pageSelection } from '../../../shared/models/models';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { InvoiceService } from '../../../shared/Services/invoice/invoice.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';



interface data {
  value: string;
}
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  providers: [DatePipe]
})
export class CreateInvoiceComponent {
  public routes = routes;
  public selectedValue !: string;
  public bookappointment!: FormGroup;

  private formattedDateTime: any;

  public searchResults: IpatientInfo[] = [];
  public patientInfo: IpatientInfo[] = [];
  public flag: boolean = false;
  public age!: number;
  private patientId!: number;

  public lastIndex = 0;
  public pageSize = 50;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public patientlist: Array<IpatientInfo> = [];
  public doctorList: IstaffInfo[] = [];
  public appointmentDto: Iappointment = {} as Iappointment;
  public departmentList: Idepartment[] = [];

  public totalPages = 0;

  public addItemFormGroup!: FormGroup;
  public invoiceItemForm!: FormGroup;
  public allnvoiceItems: any[] = [];
  public total = 0;
  private IinvoiceDto!: IinvoiceItem;
  public addItemflag: boolean = false;
  loggedInUser!: Ilogin;

  public additionalInvoiceItems: any[] = [];
  public selectedItem: any;

  public searchDataValue = '';
  searchSubject = new Subject<string>();

  public patientList: Array<IpatientInfo> = [];
  dataSource!: MatTableDataSource<IpatientInfo>;

  public allpatientList: Array<IpatientInfo> = [];
  public minToDate: Date | null = null;
  public dateForm!: FormGroup;
  public totalInvoiceAmount = 0;
  decimalPipe: any;
  public paymentMode: string;
  public isReferenceLabelVisible = false;
  public ReferenceTextBoxVal: string;
  public paymentModeDetails!: IPaymentMode;
  public newInvoiceDto!: ICreateInvoiceDto;

  @ViewChild('RefNoInput') RefNoInput!: ElementRef;
  alreadyAddedItems: Set<number> = new Set();

  buttonColors = {
    Cash: 'lightgray',
    Online: 'lightgray'
  };
  isTextboxVisible = false;
  changeColor(button: string) {
    // Reset all buttons to default color
    this.buttonColors.Cash = 'lightgray';
    this.buttonColors.Online = 'lightgray';

    // Change the color of the clicked button
    if (button === 'Cash') {
      this.buttonColors.Cash = 'orange';
      this.isTextboxVisible = false;
      this.paymentMode = 'Cash';
      this.isReferenceLabelVisible = false;

    } else if (button === 'Online') {

      this.buttonColors.Online = 'green';
      this.isTextboxVisible = !this.isTextboxVisible;
      this.paymentMode = 'Online';
      this.isReferenceLabelVisible = true;
    }
  }


  toggleTextbox() {
    this.isTextboxVisible = !this.isTextboxVisible;
  }


  constructor(private patientService: PatientService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
    private appointmentService: AppointmentService,
    private route: Router,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private loadingService: LoadingService
  ) {
    this.loggedInUser = JSON.parse(localStorage.getItem('data') || '')

    this.initlizeInvoiceMasterForm();
    this.InitlizeInvoiceItemForm();
    this.getInvoiceMaster();
    this.addItemFormGroup.get('discount')?.valueChanges.subscribe(() => {
      console.log("dis fee", this.addItemFormGroup.get('discount')?.value, this.addItemFormGroup.get('fee')?.value)
      this.updateTotal(this.addItemFormGroup.get('discount')?.value, this.addItemFormGroup.get('fee')?.value);
    });

    this.paymentMode = '';
    this.ReferenceTextBoxVal = '';

    this.paymentModeDetails = {
      invoiceId: 0,
      paymentMode: '',
      transactionId: '',
      amount: 0
    };

    this.newInvoiceDto = {
      additionalInvoiceItems: this.additionalInvoiceItems,
      paymentModeInfo: this.paymentModeDetails
    }
  }

  appointmentFormInitlize() {
    this.bookappointment = this.fb.group({
      date: ['', Validators.required],
      doctorId: ['', Validators.required],
      notes: ['', Validators.required],
      appointmentStatus: ['Active', Validators.required],

      departmentid: ['', Validators.required],
      appointTime: [null],

    })
  }

  onSearchInputChange(searchValue: string) {
    this.searchSubject.next(searchValue); // Pass the search term to the Subject
  }

  selectPatient(id: number) {
    this.flag = true;
    this.patientInfo = [];
    this.patientId = id;
    if (this.searchResults.length > 0) {
      this.searchResults.filter(res => {
        if (res.patientId == id) {
          this.age = this.appointmentService.calculateDateDifference(res.dob)
          res.ageinYear = this.age;
          this.patientInfo.push(res)

        }
      })
    }
    else {
      this.patientService.getPatientData(id).subscribe(res => {
        this.age = this.appointmentService.calculateDateDifference(res.dob)
        res.ageinYear = this.age;
        this.patientInfo.push(res)
      })


    }


    this.searchResults = [];
    //inputField.value=''
    console.log("appointmentData", this.patientInfo);
    //this.route.navigate([routes.addAppointment])

  }

  private getTableData(): void {

    this.patientList = [];
    this.serialNumberArray = [];
    const from = this.dateForm.get('from')?.value || null;
    const to = this.dateForm.get('to')?.value || null;

    this.loadingService.showLoader();

    if (from !== null && to !== null) {
      // this.dateForm.reset();
      this.patientService.getPatientdateange(from, to).subscribe((data: any) => {
        this.totalData = data.length;
        // this.staffList.push(data);
        this.allpatientList = data;

        console.log(data);
        this.loadingService.hideLoader();

        data.map((res: any, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.calculateDateDifference(res.dob);
            res.ageinYear = this.age;

            this.patientList.push(res);
            console.log(res.DOJ)
            this.serialNumberArray.push(serialNumber);
          }
        });
        this.dataSource = new MatTableDataSource<IpatientInfo>(this.allpatientList);
        this.calculateTotalPages(this.totalData, this.pageSize);

      })
    }
    else {
      this.patientService.getPatientList().subscribe((data: any) => {
        this.totalData = data.length;
        // this.staffList.push(data);
        this.allpatientList = data;
        console.log("allpatients", this.allpatientList)
        this.loadingService.hideLoader();

        console.log(data)
        data.map((res: any, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.calculateDateDifference(res.dob);
            res.ageinYear = this.age;
            this.patientList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
        this.dataSource = new MatTableDataSource<IpatientInfo>(this.allpatientList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      })
    }
  }

  addFee(event: any) {

    const value = this.doctorList.find(result => result.staffId == event.value)
    if (value) {
      this.appointmentDto.fee = value.consultationFee;
    }
  }


  calculateDateDifference(dob: Date) {
    const start = new Date(dob);
    const end = new Date();
    // Calculate the difference in years
    const diffInMilliseconds = Math.abs(end.getTime() - start.getTime());
    const yearsDifference = Math.floor(diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    this.age = yearsDifference;

  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      var limit = pageSize * i;
      var skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  public sortData(sort: Sort) {
    const data = this.patientlist.slice();

    if (!sort.active || sort.direction === '') {
      this.patientlist = data;
    } else {
      this.patientlist = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  OnCancel() {
    this.patientInfo = []
    this.flag = false
    this.route.navigate([routes.appointmentList])
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

  onItemSelectionChange(event: any) {
    const id = event.value;

    if (this.alreadyAddedItems.has(id)) {
      // If the item is already added, disable the Add button
      this.addItemflag = false;
    } else {
      const data = this.allnvoiceItems.find(e => e.itemId == id);
      this.addItemFormGroup.get('itemName')?.patchValue(data.itemName);
      this.addItemFormGroup.get('description')?.patchValue(data.description);
      this.addItemFormGroup.get('discount')?.patchValue(data.discount);
      this.addItemFormGroup.get('fee')?.patchValue(data.fee);
      this.updateTotal(data.discount, data.fee);
      this.addItemflag = true;

      const selectedInvoiceItem = {
        itemId: data.itemId,
        itemName: data.itemName,
        description: data.description,
        discount: data.discount,
        fee: data.fee,
        finalAmount: this.total,
        createdBy: this.loggedInUser.loginId,
        invoiceId: 0,
        status: 'Unpaid'
      };

      this.selectedItem = selectedInvoiceItem;
    }
  }


  addItem() {
    if (!this.alreadyAddedItems.has(this.selectedItem.itemId)) {
      this.additionalInvoiceItems.push(this.selectedItem);  // Add item to the collection
      this.totalInvoiceAmount += this.total;

      // Mark this item as added
      this.alreadyAddedItems.add(this.selectedItem.itemId);

      // Disable Add button until new selection
      this.addItemflag = false;
    }
  }

  removeItem(index: number): void {
    this.additionalInvoiceItems.splice(index, 1); // Removes the item at the given index
  }

  submitItemToInvoice(formData: FormGroup) {
    this.IinvoiceDto = formData.getRawValue();
    this.IinvoiceDto.createdBy = this.loggedInUser.loginId;
    this.IinvoiceDto.invoiceId = this.invoiceService.invoiceId;
    this.IinvoiceDto.status = 'Unpaid';
    //delete this.IinvoiceDto.total;
    this.invoiceService.addToaddtionalItemInvoice(this.IinvoiceDto).subscribe(res => {
      this.toaster.success("Item Added to Invoice", "Invoice Item");
      this.addItemFormGroup.reset();
      this.invoiceService.invoiceId = this.IinvoiceDto.invoiceId;
      this.route.navigate(['/accounts/invoice-view'])
    })
  }

  updateTotal(dis: any, fee: any) {
    if (dis <= 0) {
      this.addItemFormGroup.get('finalAmount')?.patchValue(fee);
    }
    else {

      this.total = fee - (fee * dis / 100);
      this.total = Math.round(this.total);
      this.addItemFormGroup.get('finalAmount')?.patchValue(this.total);
    }
  }

  movetoInvoiceView(Id: number, patienId: number) {
    this.invoiceService.invoiceId = Id;
    this.patientService.patientId = patienId
    this.route.navigate(['/accounts/invoice-view'])
  }

  createInvoice() {
    if (this.paymentMode == '') {
      alert('Please select payment mode first!');
      return;
    }

    if (this.paymentMode == 'Online') {
      if (this.RefNoInput.nativeElement.value == '') {
        alert('Please enter online payment reference number!');
        return;
      }

      this.paymentModeDetails.transactionId = this.RefNoInput.nativeElement.value;
    }
    else {
      this.paymentModeDetails.transactionId = null;
    }

    this.paymentModeDetails.paymentMode = this.paymentMode;
    this.paymentModeDetails.invoiceId = 0;
    this.paymentModeDetails.amount = this.totalInvoiceAmount;

    this.newInvoiceDto = {
      additionalInvoiceItems: this.additionalInvoiceItems,
      paymentModeInfo: this.paymentModeDetails
    }

    this.invoiceService.createInvoice(this.patientId, this.newInvoiceDto).subscribe(res => {
      if (res && !res.error) {
        this.toaster.success("Invoice Paid Successfully", "Create Invoice");
        this.movetoInvoiceView(res.invoiceId, this.patientId);
      }
    });

  }

  public searchData(value: any): void {
    if (value != '') {
      console.log("value", value)
      console.log("datasource", this.dataSource)
      this.dataSource.filter = value.trim().toLowerCase();
      this.patientList = this.dataSource.filteredData;
      console.log("value", this.patientList)
      if (this.patientList.length > 0) {
        this.patientList.map((item: any, index: number) => {
          this.serialNumberArray.push(index + 1)
        })
        this.totalData = this.patientList.length;
        this.calculateTotalPages(this.totalData, this.pageSize);

      }
      else {
        this.serialNumberArray = [];
        this.totalData = 0;
      }
    }
    else {
      this.getTableData()
    }
  }

  initlizeDateForm() {
    this.dateForm = this.fb.group({
      from: [null],
      to: [null]
    });
  }

  ngOnInit() {
    this.initlizeDateForm();
    this.getTableData();
  }

  onRefresh() {
    this.patientList = [];
    this.searchDataValue = '';
    this.dateForm.reset();
    this.getTableData()
  }

  onDobDateChange(event: any, dateType: string): void {
    // Extract the date part only
    // const datePipe = new DatePipe('en-US');
    const dateOnly = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    if (dateType == 'from') {
      this.minToDate = event.value
      this.dateForm.get('from')?.setValue(dateOnly)

    }
    if (dateType == 'to') {
      this.dateForm.get('to')?.setValue(dateOnly)
    }
    const from = this.dateForm.get('from')?.value || null;
    const to = this.dateForm.get('to')?.value || null;
    if (from !== null && to !== null) {

      this.getTableData();
    }
  }


}
