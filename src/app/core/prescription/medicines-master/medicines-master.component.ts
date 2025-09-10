import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/Services/loader/loader.service';
import { IConsultationTemplate, IMedicationGroup, ImedicineMaster, IMedicinesGroup, IPredefineDiagnosis, IprescribeMedicine } from '../../../shared/models/models';
import { ConsultService } from '../../../shared/Services/consultation/consult.service';
import { ToastrService } from 'ngx-toastr';
import { ConsultationTemplateMasterService } from '../../../shared/Services/consultation/consultationTemplateMaster.service';
import { MedicineService } from 'src/app/shared/Services/medicine/medicine.service';
import { MedicinesGroupService } from '../../../shared/Services/medicine/medicines-group.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-medicines-master',
  templateUrl: './medicines-master.component.html',
  styleUrls: ['./medicines-master.component.scss']
})
export class MedicinesMasterComponent {
  public searchMedForm!: FormGroup;
  public prescribeMedForm!: FormGroup;
  public SearchMedicineList: ImedicineMaster[] = [];
  public isMedicineSearch = false;
  public medicineDto: IprescribeMedicine[] = [];
  public latestId: number = -1;
  public medicinesGroupForm!: FormGroup;
  public groups: IMedicinesGroup[] = [];
  public isEditMode: boolean = false;
  public selectedRow: number | null = null;
  public selectedGroup!: IMedicinesGroup;
  public medicationGroup: IMedicationGroup[] = [];
  public allMedicine: ImedicineMaster[]=[];
  public isEditMedication: boolean = false;

  frequencyData = ['1-0-0', '0-1-0', '0-0-1', '1-0-1', '1-1-1'];
  timingData = ['Before Meal', 'After Meal'];

  ngOnInit() {
    this.initalizeMedicinesGroupForm();
    this.initlizeSearchMedicine();
    this.initilizemedicineForm();
    this.getAllGroups();
  }

  constructor(
    private fb: FormBuilder,
    private loaderService: LoadingService,
    private medicinesGroupService: MedicinesGroupService,
    private toaster: ToastrService,
    private medicineService: MedicineService
  ) {
  }

  initalizeMedicinesGroupForm() {
    this.medicinesGroupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  initlizeSearchMedicine() {
    this.searchMedForm = this.fb.group({
      search: ['', Validators.required]
    })
  }

  initilizemedicineForm() {
    this.prescribeMedForm = this.fb.group({
      medicine: this.fb.array([])
    })
  }

  getAllGroups(): void {
    this.medicinesGroupService.getAllMedicinesGroup().subscribe((data: any[]) => {
      this.groups = data; // Assign the groups to the local variable


      // Assign the first group to selectedGroup if data exists
      if (this.groups && this.groups.length > 0) {
        this.selectedGroup = this.groups[0];
      }

      this.getMedicationByGroup();
    });
  }

  getMedicationByGroup(): void {
    this.medicinesGroupService.getMedicationByGroupId(this.selectedGroup.id).subscribe((data: any[]) => {
      this.medicationGroup = data;
    });
  }

  createGroup(form: FormGroup) {
    if (form.valid) {
      this.medicinesGroupService.addMedicineGroup(form.value).subscribe(res => {
        if (res) {
          this.toaster.success("Medicines Group Created ", "Success")
          this.getAllGroups();
          this.medicinesGroupForm.reset();
        }
      })
    } else {
      this.medicinesGroupForm.markAllAsTouched()
    }
  }

  searchMedicine(medname: string) {
    this.SearchMedicineList = [];
    this.isMedicineSearch = true;
    if (medname.length > 3) {
      this.medicineService.SearchMatchMedicine(medname).subscribe((res) => {

        this.SearchMedicineList = res;
      })
    }
  }

  selectMedicine(id: number) {
    const selectMedicine = this.SearchMedicineList[id];
    this.addDynamicControl(selectMedicine);
    this.SearchMedicineList = [];
    this.searchMedForm.reset();
  }

  addDynamicControl(selectMedicine: ImedicineMaster) {
    const newControl = this.fb.group({
      medName: [{ value: 'Dolo 650', disabled: true }, [Validators.required]],
      medType: [{ value: 'Tab', disabled: true }, [Validators.required]],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      timing: ['', Validators.required],
      duration: ['', Validators.required],
      instruction: ['', Validators.required],
    });

    newControl.patchValue({
      medName: selectMedicine.medName,
      medType: selectMedicine.medType,
    });

    this.medicine.push(newControl);
  }

  removeDynamicControl(index: number) {
    this.medicine.removeAt(index);  // Remove the dynamic control at the specified index
  }
  get medicine() {
    return this.prescribeMedForm.get('medicine') as FormArray;
  }

  AddOrUpdateMedication(prescribeMed: FormGroup) {
    if (this.isEditMedication) {
      this.updateMedication(prescribeMed);
      return;
    }

    this.submitPrescribeMedicine(prescribeMed);
  }

  submitPrescribeMedicine(prescribeMed: FormGroup) {
    if (this.selectedGroup == undefined) {
      this.toaster.error("Select a group first!", "Error")
    }

    this.loaderService.showLoader();

    const prescribeMedicines = prescribeMed.getRawValue();
    prescribeMedicines.medicine.map((m: IMedicationGroup) => {
      m.groupId = this.selectedGroup.id || 0;
    })

    this.medicinesGroupService.submitMedicationGroup(prescribeMedicines.medicine).subscribe(res => {
      if (res) {
        this.loaderService.showLoader();
        this.toaster.success("Medication added to group", "Success")
        this.medicine.clear();
        this.SearchMedicineList = [];
        this.searchMedForm.reset();

        this.getMedicationByGroup();
        this.loaderService.hideLoader();
      }
    })

    this.loaderService.hideLoader();
  }

  updateMedication(prescribeMed: FormGroup) {
    this.loaderService.showLoader();
    const prescribeMedicines = prescribeMed.getRawValue();

    this.medicinesGroupService.updateMedicationGroup(prescribeMedicines.medicine[0].id, prescribeMedicines.medicine[0]).subscribe(res => {
      this.toaster.success("Medication updated", "Success")
      this.medicine.clear();
      this.SearchMedicineList = [];
      this.searchMedForm.reset();
      this.isEditMedication = false;
      this.getMedicationByGroup();
    })

    this.loaderService.hideLoader();
  }

  getPrescribeMedicine() {
    this.medicineService.getPrescribeMedicine(this.latestId).subscribe(res => {
      this.medicineDto = res;
    })
  }

  onEdit(id: number) {
    this.isEditMode = true;

    // Find the selected group by ID
    const selectedGroup = this.groups.find(g => g.id === id);
    if (!selectedGroup) {
      this.toaster.error('Template not found', 'Error');
      return;
    }

    // Patch the form values with the selected template
    this.medicinesGroupForm.patchValue({
      id: selectedGroup.id,
      name: selectedGroup.name,
      description: selectedGroup.description,
    });
  }

  onDelete(id: number) {

    if (id) {
      this.confirmDelete(id);
    } else {

    }
  }

  confirmDelete(id: number) {
    this.medicinesGroupService.deleteMedicinesGroup(id).subscribe({
      next: (res) => {
        if (res == null) {
          this.toaster.success("Group is deleted!");
          this.getAllGroups();
        }
      },
      error: (err) => {
        this.toaster.error('Failed to delete group');
      }
    });
  }

  selectRow(index: number): void {
    this.selectedRow = index;
  }

  OnGroupChange(data: any) {
    this.selectedGroup = data;
    this.getMedicationByGroup();
  }

  editMedication(data: any): void {
    if (!this.selectedGroup) {
      this.toaster.error("Select a group first!", "Error");
      return;
    }

    this.loaderService.showLoader();

    this.isEditMedication = true;
    this.SearchMedicineList = [];
    this.medicine.clear(); // Removes all controls from the FormArray

    // Create a reusable function to build the form group
    const createMedicationControl = (medication: any) =>
      this.fb.group({
        id: [{ value: medication.id || 0, disabled: true }],
        groupId: [{ value: medication.groupId || 0, disabled: true }],
        medName: [{ value: medication.medName || '', disabled: true }, [Validators.required]],
        medType: [{ value: medication.medType || 'Tab', disabled: true }, [Validators.required]],
        dose: [medication.dose || '', Validators.required],
        frequency: [medication.frequency || '', Validators.required],
        timing: [medication.timing || '', Validators.required],
        duration: [medication.duration || '', Validators.required],
        instruction: [medication.instruction || '', Validators.required],
      });

    // Add the new control to the medicines array
    this.medicine.push(createMedicationControl(data));

    this.loaderService.hideLoader();
  }


  deleteMedication(id: number) {
    this.medicinesGroupService.deleteMedicationGroup(id).subscribe({
      next: (res) => {
        if (res == null) {
          this.toaster.success("Selected medication is deleted!");
          this.getMedicationByGroup();
        }
      },
      error: (err) => {
        this.toaster.error('Failed to delete medication from group');
      }
    });
  }
  getAllMedicine()
  {
    this.medicinesGroupService.getAllMedicine().subscribe((data: any[]) => {
      this.allMedicine = data;
      this.exportAllMedicine();
    })
    }
    exportAllMedicine()
    {          
      
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.allMedicine);
        const workbook: XLSX.WorkBook = { Sheets: { 'Patients': worksheet }, SheetNames: ['Patients'] };
        
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
        // Call saveAsExcel
        this.saveAsExcelFile(excelBuffer, 'PatientList');
        this.allMedicine.length=0;
      }
      
      private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
      }
      
    
}
