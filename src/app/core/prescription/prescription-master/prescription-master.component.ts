import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/Services/loader/loader.service';
import { IConsultationTemplate, IPredefineDiagnosis } from '../../../shared/models/models';
import { ConsultService } from '../../../shared/Services/consultation/consult.service';
import { ToastrService } from 'ngx-toastr';
import { ConsultationTemplateMasterService } from '../../../shared/Services/consultation/consultationTemplateMaster.service';

@Component({
  selector: 'app-prescription-master',
  templateUrl: './prescription-master.component.html',
  styleUrls: ['./prescription-master.component.scss']
})
export class PrescriptionMasterComponent {
  public consultForm!: FormGroup;
  public preDiagnosis: IPredefineDiagnosis[] = [];
  public isEditMode!: boolean;
  public prescriptionTemplateDto!: IConsultationTemplate
  public selectedDiagnosisId!: number;
  public templates!: IConsultationTemplate[];

  ngOnInit() {
    this.initlizeConsultForm();
    this.getPreDiagnosisTemplate();
    this.getAllTemplates();
  }

  constructor(
    private fb: FormBuilder,
    private loaderService: LoadingService,
    private consultService: ConsultService,
    private consultTemplateService: ConsultationTemplateMasterService,
    private toaster: ToastrService
  ) { }

  initlizeConsultForm() {
    this.consultForm = this.fb.group({
      id: [''],
      templateName: ['', Validators.required],
      examinationNote: [''],
      advice: [''],
      diffDiagnosis: [''],
      finalDiagnosis: [''],
      diagnosisData: ['']
    })
  }

  getPreDiagnosisTemplate() {
    this.consultService.GetAllDiagnosis().subscribe(res => {
      this.preDiagnosis = res;
    })
  }

  getPreDiagnosisById(diagnosisId?: number): IPredefineDiagnosis | undefined {
    return this.preDiagnosis.find(diagnosis => diagnosis.diagnosId === diagnosisId);
  }

  cancelConsultation() {
    this.isEditMode = false;
    this.consultForm.reset();
  }

  submitConsultation(form: FormGroup) {
    if (!form.valid) {
      this.toaster.error('Invalid form data');
      return;
    }
  
    this.loaderService.showLoader();
  
    const operation = this.isEditMode
      ? this.consultTemplateService.updateConsultationTemplate(form.value.id, {
          ...form.value,
          diagnosisId: this.selectedDiagnosisId
        })
      : this.consultTemplateService.addConsultationTemplate({
          ...form.value,
          diagnosisId: this.selectedDiagnosisId
        });
  
    operation.subscribe({
      next: () => {
        const message = this.isEditMode
          ? "Consultation template data updated successfully!"
          : "Consultation template data saved successfully!";
        this.toaster.success(message, "Consultation Template Data");
        this.getAllTemplates();
        this.resetForm();
      },
      error: (err) => this.toaster.error(err.error.message, 'Error'),
      complete: () => this.loaderService.hideLoader()
    });
    this.loaderService.hideLoader()
  }  

  addPreDefineDiagnosis(data: any) {
    this.consultForm.get('finalDiagnosis')?.patchValue(data.value.diagnosText);
    this.selectedDiagnosisId = data.value.diagnosId;
  }

  onEdit(id: number) {
    this.isEditMode = true;

    // Find the selected template by ID
    const selectedTemplate = this.templates.find(template => template.id === id);
    if (!selectedTemplate) {
      this.toaster.error('Template not found', 'Error');
      return;
    }

    // Patch the form values with the selected template
    this.consultForm.patchValue({
      id: selectedTemplate.id,
      templateName: selectedTemplate.templateName,
      examinationNote: selectedTemplate.examinationNote,
      advice: selectedTemplate.advice,
      diffDiagnosis: selectedTemplate.diffDiagnosis,
      finalDiagnosis: selectedTemplate.finalDiagnosis,
      diagnosisData: this.getPreDiagnosisById(selectedTemplate.diagnosisId) // Map diagnosId to diagnosName
    });

    // Save the selected diagnosisId for submission
    this.selectedDiagnosisId = selectedTemplate.diagnosisId || 0;

    console.log('Editing Template:', selectedTemplate);
  }

  onDelete(id: number) {
    this.isEditMode = false;
    console.log('Delete Item ID:', id);
  }

  getAllTemplates(): void {
    this.consultTemplateService.getConsultationTemplates().subscribe((data: any) => {
      this.templates = data;
      console.log('templates:', data);
    })
  }

  resetForm() {
    this.isEditMode = false;
    this.consultForm.reset();
    this.initlizeConsultForm(); // Reinitialize form with empty values
  }

}
