import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { AppointmentService } from 'src/app/shared/Services/appointment/appointment.service';
import { ConsultService } from 'src/app/shared/Services/consultation/consult.service';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { FileUploadService } from 'src/app/shared/Services/fileUpload/file-upload.service';
import { MedicineService } from 'src/app/shared/Services/medicine/medicine.service';
import { PatientService } from 'src/app/shared/Services/patient/patient.service';
import { QuestionService } from 'src/app/shared/Services/question/question.service';
import { IPredefineDiagnosis, Iquestion, IQuestionnaires, Ianswers, Iappointment, Iconsultation, IconsultationFiles, IdownloadFile, IfileUpload, Ilogin, ImedicineMaster, Ioptions, IpatientInfo, IprescribeMedicine, IstaffInfo, Ivital } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import jsPDF, * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { StaffService } from 'src/app/shared/Services/staff/staff.service';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoadingService } from '../../shared/Services/loader/loader.service';
import { ConsultationTemplateMasterService } from '../../shared/Services/consultation/consultationTemplateMaster.service';
import { IConsultationTemplate, IMedicationGroup, IMedicinesGroup } from '../../shared/models/models';
import { MedicinesGroupService } from '../../shared/Services/medicine/medicines-group.service';
// import { AbhaService } from 'src/app/shared/Services/abha/abha.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})

export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('printview', { static: false }) pdfview!: ElementRef;
  public routes = routes;
  public appointmentYears: number[] = [];
  public selectedYear: number;
  public patientId!: number;
  public profileForm!: FormGroup;
  public appointmentList: Iappointment[] = [];
  public selectedRowIndex = -1;
  public downLoadList: IdownloadFile[] = [];
  public downlodedFileName!: string;
  public patientInfo!: IpatientInfo;
  public pdfUrl = '';
  public patientAge!: number
  public showNext: boolean = false;
  @ViewChild('stepper') stepper!: MatStepper;
  public copyId: number = -1;
  public latestId: number = -1;
  public departmentId: number = -1;
  public selectedQueslist: any[] = [];
  public selectedques!: number
  //*********8 Questionnaire related Variables decletation start */
  public questionnaireDto: IQuestionnaires[] = [];
  public finishQuestionniary = false;
  public currentQuestionData: any;
  public loggedInUserId!: Ilogin;
  public nextQuestionId = 0;
  public previousQuestionId!: number;
  public answerDto: Ianswers[] = [];
  public combindQuestionOption: any[] = [];
  public questionCounter = 0;
  public questionLenth = 0;
  private appointmentId!: number;
  public vitalForm!: FormGroup;
  public vitalDto!: Ivital;
  public vitalSubmitted = false;
  public displayVitalCard = true;
  public isMedicineSearch = false;

  public prescribeMedForm!: FormGroup;
  public searchMedForm!: FormGroup;
  public SearchMedicineList: ImedicineMaster[] = [];
  private prescribeMedicines: IprescribeMedicine[] = [];
  public consultForm!: FormGroup;
  public preDiagnosis: IPredefineDiagnosis[] = [];
  public _consultationDto!: Iconsultation;
  public followupDate!: Date;
  public appointmentStatus = true;
  public questionData: any[] = [];
  groupedQuestionData: any[] = [];
  public toggalUi = true;
  public selectedFile: File | null = null;
  public VselectedFile: File | null = null;
  private spinner!: NgxSpinnerService;
  private FileUploadDto: IconsultationFiles = {} as IconsultationFiles;
  private VFileUploadDto: IconsultationFiles = {} as IconsultationFiles;
  public base64String!: string;
  public base64StringArray: string[] = [];
  public medicineDto: IprescribeMedicine[] = [];
  private doctorId!: number;
  public _doctorDto!: IstaffInfo;
  public _appointmentDto!: Iappointment;
  //public displayImage:any[]=[];
  public displayImage: IconsultationFiles[] = [];
  public images: any;
  public presDocuments: IconsultationFiles[] = [];
  public vitalDocuments: IconsultationFiles[] = [];
  public previewFile: IconsultationFiles[] = [];

  public documentUrl: SafeResourceUrl | null = null;
  public currentFileName: string | null = null;
  public seletedAppointmentDate!: Date;
  public submittedQues: any[] = [];
  dtFollowUp: string = '';

  public allOptions: Ioptions[] = [];
  textInputValue: string = '';
  currentQuestionIndex: number = 1;
  public subQuestionCounter = 0;
  questionList!: Iquestion[];
  prescriptionService: any;
  prescriptionImage: string | null = null;
  public templates: any[] = [];
  public selectedTemplate!: any;
  public medicineGroups: IMedicinesGroup[] = [];
  public selectedMedicineGroup!: IMedicinesGroup;
  public selectedMedication: IMedicationGroup[] = [];
  public hasPenPrescription: boolean = false;

  public selectedDiagnosis: number = 0;
  isButtonEnabled: boolean = false;
  newTemplate!: IConsultationTemplate;
  isMedicinesFormDirty = false;
  public medicinesGroupForm!: FormGroup;
  newGroupId: number = 0;

  frequencyData = ['1-0-0', '0-1-0', '0-0-1', '1-0-1', '1-1-1'];
  timingData = ['Before Meal', 'After Meal'];

  constructor(private appointmentService: AppointmentService,
    // private abhaService: AbhaService,
    private patientService: PatientService,
    private question: QuestionService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private fileUpladServie: FileUploadService,
    private http: HttpClient,
    private route: Router,
    private toaster: ToastrService,
    private medicineService: MedicineService,
    private datePipe: DatePipe,
    private consultService: ConsultService,
    private toastr: ToastrService,
    private doctorService: StaffService,
    private sanitizer: DomSanitizer,
    private loaderService: LoadingService,
    private consultTemplateService: ConsultationTemplateMasterService,
    private medicinesGroupService: MedicinesGroupService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    //this.appointmentStatus = this.appointmentService.appoinmentStatus;

    this.appointmentId = this.appointmentService.appointmentId;
    this.doctorId = this.doctorService.staffId;

    this.loggedInUserId = JSON.parse(localStorage.getItem('data') || '');
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.appointmentYears.push(year);
    }
    this.selectedYear = currentYear;

    // Retrieve patientId from the route parameter
    this.activeRoute.queryParams.subscribe(params => {
      const patientId = params['patientId'];

      if (patientId) {
        // If patientId is present in route params, set it
        this.patientId = patientId;
        this.patientService.patientId = patientId; // Optionally store in service for later use
      } else if (this.patientService.patientId) {
        // If not in route params, check if it's available in patientService
        this.patientId = this.patientService.patientId;
      } else {
        // If neither is available, navigate to the patient list
        this.route.navigate([routes.patientsList]);
      }
    });

    // this.patientService.patientId ? this.patientId = this.patientService.patientId : this.route.navigate([routes.patientsList]);
    this.initlizeProfileForm();

    //department id Required here
    this.getQuestionnaireByDepartmentId(this.departmentId);
  }

  initlizeProfileForm() {
    this.profileForm = this.fb.group({
      appointYear: [this.selectedYear],
    })
  }

  ngOnInit() {

    this.initlizeVitalForm();
    this.loadPatientAppointments();
    this.loadPatientInfo();
    this.initilizemedicineForm();
    this.initlizeSearchMedicine();
    this.initlizeConsultForm();
    this.getCurrentAppointmentDetils();
    this.getPreDiagnosisTemplate();
    this.checkPenPrescription();

    this.loadQuestions();
    this.fetchAllOptions();
    this.getAllTemplates();
    this.getAllMedicationGroups();
    this.initalizeMedicinesGroupForm();

    // Subscribe to form value changes
    this.consultForm.valueChanges.subscribe(() => {
      this.enableAddToTemplateButton();
    });

    // Optionally subscribe to status changes to ensure fields are touched or dirty
    this.consultForm.statusChanges.subscribe(() => {
      this.enableAddToTemplateButton();
    });

    this.prescriptionService.prescriptionData$.subscribe((data: string | null) => {
      this.prescriptionImage = data;  // Assign the image data to the local variable
    });
  }

  checkPenPrescription() {
    this.hasPenPrescription = this.presDocuments.some(item => item.docName === 'pen-prescription');
}

  initalizeMedicinesGroupForm() {
    this.medicinesGroupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  openInNewTab(path: string, title: string, fileId?: number): void {
    const queryParams = fileId ? { fileId } : {}; // Include fileId in queryParams if provided
    const urlTree = this.route.createUrlTree([path, this.latestId, title], { queryParams });
    this.route.navigateByUrl(urlTree); // Navigate to the constructed URL
    
  }

  viewDocument(item: any) {
    this.currentFileName = item.fileName;
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.fileData);
  }

  closeDocument() {
    this.documentUrl = null;
    this.currentFileName = null;
  }
  goToStep(index: number): void {
    this.getUploadedFiles(this.latestId);
    this.stepper.selectedIndex = index;
  }

  allowOnlyNumbers(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const containsAlphabet = /[a-zA-Z]/.test(inputValue);
    if (containsAlphabet) {
      alert('Cannot enter alphabet in followup after!');
    }
  }

  downloadPreviewAsPdf() {
    this.loaderService.showLoader();
    const data = document.getElementById('convertToPdf');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(`${this.patientInfo.patientId}-${this.patientInfo.firstName}${this.patientInfo.lastName}.pdf`);
      })
    }

    this.loaderService.hideLoader();
  }

  saveAsPDF(): void {
    this.loaderService.showLoader();
    const data = document.getElementById('convertToPdf');
    if (data) {

      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

        // Convert the PDF to a Blob
        const pdfBlob = pdf.output('blob');

        // Convert Blob to base64 string
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const fileName = `${this.patientInfo.patientId}-${this.patientInfo.firstName}${this.patientInfo.lastName}.pdf`;
          const fileType = 'application/pdf';

          this.FileUploadDto.fileName = fileName;
          this.FileUploadDto.FileType = fileType;
          this.FileUploadDto.fileData = base64String;
          this.FileUploadDto.docName = 'previewFile';
          this.FileUploadDto.appointmentId = this.latestId;

          this.fileUpladServie.uploadConsultationFile(this.FileUploadDto).subscribe(
            result => {
              this.getUploadedFiles(this.latestId);
              this.loaderService.hideLoader();
              this.toastr.success('File uploaded Successfully', 'Success');
            },
            error => {
              this.loaderService.hideLoader();
              console.error('Error uploading file:', error);
              this.toastr.error('File upload failed', 'Error');
            }
          );
        };
      }).catch(error => {
        this.loaderService.hideLoader();
        console.error('Error generating PDF:', error);
        this.toastr.error('Error generating PDF', 'Error');
      });
    } else {
      this.loaderService.hideLoader();
      this.toastr.error('No content to convert', 'Error');
    }
  }

  loadSavedAnswers(appointmentId: number) {
    this.question.getQuestionwithAnswerByAppointmentId(appointmentId).subscribe((res: any[]) => {
      this.questionData = res;
      console.log("question answer res", res)

      // Push unique submitted questionnaireIds to submittedQues
      const uniqueQuestionnaireIds = Array.from(new Set(res.map((item: { questionnaireId: number }) => item.questionnaireId)));
      this.submittedQues.push(...uniqueQuestionnaireIds);

      res.forEach(answer => {
        const questionIndex = this.combindQuestionOption.findIndex(q => q.questionId === answer.questionId);
        if (questionIndex !== -1) {
          const question = this.combindQuestionOption[questionIndex];

          if (question.questionType === 2) {
            question.savedAnswerText = answer.answerText;
          } else if (question.questionType === 1) {
            question.savedSelectedOptionId = answer.selectedOptionId;
          }
          console.log("saved question", question);
          console.log("saved answer", answer);
        }
      });

      this.dispalyPatientQuiz();
    });
  }

  copyClick(id: number, depId: number) {
    this.copyId = id;
    this.showNext = true;
    this.getVitalByAppointment(this.copyId);
    this.getQuestionnaireByDepartmentId(depId)
    const questionaryTab = document.getElementById('questab');
    if (questionaryTab) {
      questionaryTab.click();
    }
    this.stepper.next();
  }


  loadPatientAppointments() {
    this.appointmentList = [];
    this.selectedYear = this.profileForm.get('appointYear')?.value
    this.appointmentService.getAppointmentListByPatientId(this.patientId, this.selectedYear).subscribe(res => {
      // Assuming the date field is named 'date' and is in a format that can be compared directly (e.g., ISO string).

      this.appointmentList = res.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      this.latestId = this.appointmentList[0]?.id;
      this.departmentId = this.appointmentList[0]?.departmentid;
      this.getVitalByAppointment(this.latestId);
      this.getQuestionnaireByDepartmentId(this.departmentId);
      this.ApiCallsForPreview();
      this.getConsultationOnAppointmentId(this.latestId)
      this.getPrescribeMedicine();
      this.getDoctorDetails();
      this.getUploadedFiles(this.latestId);
    });
  }

  loadPatientInfo() {
    this.patientService.getPatientData(this.patientId).subscribe(
      (data) => {
        if (data) {
          this.patientInfo = data;
          this.patientInfo.IdentityName = data.identityName;
          this.patientInfo.IdentityNumber = data.identityNumber;
          this.patientAge = this.appointmentService.calculateDateDifference(data.dob);
        } else {
          // If data is null or undefined, navigate to patient list
          this.route.navigate([routes.patientsList]);
        }
      },
      (error) => {
        console.error("Error fetching patient data:", error);
        // Navigate to patient list in case of an error
        this.route.navigate([routes.patientsList]);
      }
    );
  }


  callloadAppointment(event: any) {
    this.selectedYear = event.value;
    this.loadPatientAppointments();
  }

  showAppointmentData(id: number) {
    this.downLoadList = [];
    this.fileUpladServie.getUpodedFileByAppointment(id).subscribe((data: any) => {
      JSON.parse(data).map((res: any) => {
        const addDownloads = { fileName: '', downloadLink: '' };
        const x = res.fileData || '';
        this.downlodedFileName = res.fileName;
        const type = res.fileType;
        if (x) {
          let base64Data
          if (type == 'image/jpeg') {
            base64Data = (x.split('jpeg;base64,'))[1]
          }
          if (type == 'application/pdf') {
            base64Data = (x.split('pdf;base64,'))[1]
          }

          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/octet-stream' });
          const objectUrl = URL.createObjectURL(blob);
          addDownloads.fileName = this.downlodedFileName;
          addDownloads.downloadLink = objectUrl;
          this.downLoadList.push(addDownloads);
          this.pdfUrl = objectUrl;

        }
      })

    },
      (error) => {
        console.error('Download failed:', error);
        //this.toastr.error("No file available for this user");
      })

  }

  loadPdf(downloadLink: string) {
    // Fetch PDF data dynamically based on downloadLink
    // You might use HttpClient here to fetch the data
    this.http.get(downloadLink, { responseType: 'arraybuffer' }).subscribe(
      (pdfData: ArrayBuffer) => {
        const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
        this.pdfUrl = URL.createObjectURL(pdfBlob);
      },
      (error) => {
        console.error('Error loading PDF:', error);
      }
    );
  }


  // save question answers on next click untill finish questions

  saveAnswer(answer: NgForm) {
    const answerKey = Object.keys(answer.value)[0];
    if (this.currentQuestionData.options.length > 0) {


      this.currentQuestionData.options.map((res: Ioptions) => {

        if (res.optionId == answer.value[answerKey]) {
          console.log("res.mapQuestionId", res.mapQuestionId)
          this.nextQuestionId = res.mapQuestionId;
        }
      })
    }
    const answerObject: Ianswers = {
      questionId: this.currentQuestionData.questionId,
      participantId: this.loggedInUserId.loginId,
      answerText: typeof answer.value[answerKey] === 'string' ? answer.value[answerKey] : '',
      selectedOptionId: typeof answer.value[answerKey] !== 'string' ? answer.value[answerKey] : null,
      appointmentId: this.latestId
    }

    this.answerDto.push(answerObject);
    this.nextQuestion();
  }

  nextQuestion() {
    var subQuestionIndex = -1;

    // If there's a next question id, it means we need to navigate to a sub-question
    if (this.nextQuestionId != 0 && this.nextQuestionId != this.currentQuestionData.questionId
      && this.currentQuestionData.questionType != 2
    ) {
      this.subQuestionCounter += 1;

      if (this.currentQuestionData && this.currentQuestionData.options) {
        // Find the index of the sub-question in the current question's options
        const index = this.currentQuestionData.options.findIndex(
          (option: any) => option.mapQuestionId === this.nextQuestionId
        );
        subQuestionIndex = index;
      }

      if (subQuestionIndex != -1) {
        // Navigate to the next mapped question (sub-question)
        this.getNextMappedQuestion();
        this.nextQuestionId = 0;
      }
    }
    else if (this.nextQuestionId == this.currentQuestionData.questionId) {
      subQuestionIndex = -1;
      this.questionCounter = this.questionLenth;
    } else {
      // Navigate to the next main question
      this.questionCounter++;
      if (this.questionCounter < this.questionLenth) {
        this.currentQuestionData = this.combindQuestionOption[this.questionCounter];

        subQuestionIndex = this.currentQuestionData.options.length > 0 ? 0 : -1;
        this.subQuestionCounter = this.currentQuestionData.options.length > 0 ? 1 : -1;

        // Reset sub-question counter for the new main question
        //this.subQuestionCounter = 0;
      }
    }

    // Update the current question index
    this.currentQuestionIndex = this.questionCounter + 1;

    // Check if we have reached the end of the main questions and there are no more sub-questions
    if (this.questionCounter >= this.questionLenth && subQuestionIndex == -1) {
      this.finishQuestionniary = true;
      this.currentQuestionIndex = this.questionLenth;
    }

    this.textInputValue = '';
  }

  getNextMappedQuestion() {
    const nextQuestion = this.questionList.find(
      question => question.questionId === this.nextQuestionId
    );

    if (nextQuestion) {
      this.currentQuestionData = nextQuestion;
      // this.mapQuestionAndOptions(this.currentQuestionData.questionnaireId);
      //this.fetchAllOptions();
      this.currentQuestionData.options = this.getOptionsForQuestion(this.nextQuestionId);


    } else {
      console.log('Question not found');
    }
  }

  getOptionsForQuestion(questId: number): Ioptions[] {
    return this.allOptions.filter(option => option.questionId === questId)
  }

  isCompleted(data: IQuestionnaires): boolean {
    return this.selectedQueslist.some(q => q.questionnaireId === data.questionnaireId);
  }

  isUntouched(data: IQuestionnaires): boolean {
    return !this.isCompleted(data) && data.questionnaireId !== this.selectedques;
  }

  isActive(data: IQuestionnaires): boolean {
    return data.questionnaireId === this.selectedques;
  }

  isSubmitted(questionnaireId: number): boolean {
    return this.submittedQues.includes(questionnaireId);
  }

  mapQuestionAndOptions(questId: number) {
    this.selectedques = questId;
    this.combindQuestionOption = [];
    this.displayVitalCard = false;
    const question$ = this.question.getQuestionByQuestionaireId(questId)
    const options$ = this.question.getAllOptions();

    forkJoin([question$, options$]).subscribe(([question, options]) => {

      this.combindQuestionOption = question.map((quest: any) => {
        options.map(e => {
          if (e.questionId == quest.questionId) {
            const optData: any = {};
            optData.optionId = e.optionId,
              optData.optionText = e.optionText
            optData.mapQuestionId = e.mapQuestionId
            quest.options.push(optData);
          }
        })

        const opt = options.find(e => e.questionId == quest.questionId);

        return {
          ...quest,
          mapQuestionId: opt ? opt.mapQuestionId : 0,
          savedAnswerText: '',  // Add default value for saved answer text
          savedSelectedOptionId: null

        }
      })

      this.loadSavedAnswers(this.latestId);
    })

  }

  getAllTemplates(): void {
    this.consultTemplateService.getConsultationTemplates().subscribe((data: any) => {
      this.templates = data;
    })
  }

  getAllMedicationGroups(): void {
    this.medicinesGroupService.getAllMedicinesGroup().subscribe((data: any) => {
      this.medicineGroups = data;
    })
  }

  getMedicationByGroup(id: number) {
    this.loaderService.showLoader();

    this.medicinesGroupService.getMedicationByGroupId(id).subscribe((data: any) => {
      this.selectedMedication = data;
      this.SearchMedicineList = [];
      this.medicine.clear(); // Clear existing controls before adding new ones

      const createMedicationControl = (medication: any) =>
        this.fb.group({
          id: [{ value: medication.id || 0, disabled: true }],
          groupId: [{ value: medication.groupId || 0, disabled: true }],
          medName: [{ value: medication.medName || '', disabled: true }, [Validators.required]],
          medType: [{ value: medication.medType || 'Tab', disabled: true }, [Validators.required]],
          unit:[{ value: medication.unit || 'mg', disabled: true }, [Validators.required]],
          dose: [medication.dose || '', Validators.required],
          frequency: [medication.frequency || '', Validators.required],
          timing: [medication.timing || '', Validators.required],
          duration: [medication.duration || '', Validators.required],
          instruction: [medication.instruction || '', Validators.required],
        });

      if (Array.isArray(data)) {
        data.forEach((medication: any) => {
          const medicationControl = createMedicationControl(medication);
          this.medicine.push(medicationControl);
        });
      } else {
        console.error("Expected an array of medications, but received:", data);
      }

      this.subscribeToFormChanges(); // Call after populating the form

      this.loaderService.hideLoader();
    }, error => {
      this.loaderService.hideLoader();
      console.error("Error fetching medications:", error);
    });
  }


  // Subscribe to valueChanges
  subscribeToFormChanges() {
    this.medicine.controls.forEach((control) => {
      control.valueChanges.subscribe(() => {
        this.isMedicinesFormDirty = true;
      });
    });
  }

  populateTemplateData(id: number) {
    // Find the selected template by ID
    this.selectedTemplate = this.templates.find(template => template.id === id);
    if (!this.selectedTemplate) {
      this.toaster.error('Template not found', 'Error');
      return;
    }

    // Patch the form values with the selected template
    this.consultForm.patchValue({
      templateName: this.selectedTemplate.templateName,
      examinationNote: this.selectedTemplate.examinationNote,
      advice: this.selectedTemplate.advice,
      diffDiagnosis: this.selectedTemplate.diffDiagnosis,
      finalDiagnosis: this.selectedTemplate.finalDiagnosis,
      diagnosisId: this.selectedTemplate.diagnosisId // Map diagnosId to diagnosName
    });

    // Save the selected diagnosisId for submission
    this.selectedDiagnosis = this.selectedTemplate.diagnosisId;

    // Mark the form as touched after patching values, so the button can be enabled
    this.consultForm.markAllAsTouched();
  }

  // Enable the button if any field is touched or changed
  enableAddToTemplateButton(): void {
    // Check if any form control is touched or dirty (changed)
    this.isButtonEnabled = this.consultForm.dirty || this.consultForm.touched;
  }

  getPreDiagnosisById(diagnosisId?: number): IPredefineDiagnosis | undefined {
    return this.preDiagnosis.find(diagnosis => diagnosis.diagnosId === diagnosisId);
  }

  onTemplateNameChange(event: any) {
    this.isButtonEnabled = false;
    this.populateTemplateData(event.value);
  }

  onMediniesGroupChange(event: any) {
    this.selectedMedicineGroup = this.medicineGroups.find(group => group.id === event.value) || {} as IMedicinesGroup;
    this.isMedicinesFormDirty = false;
    this.getMedicationByGroup(event.value);
  }

  SaveNewTemplate() {
    if (this.consultForm.value.newTemplateName == '') {
      this.toaster.error('Provide New Template Name');
    }
    else {
      this.loaderService.showLoader();

      this.newTemplate = {
        id: 0,
        templateName: this.consultForm.value.newTemplateName,
        examinationNote: this.consultForm.value.examinationNote,
        advice: this.consultForm.value.advice,
        diffDiagnosis: this.consultForm.value.diffDiagnosis,
        finalDiagnosis: this.consultForm.value.finalDiagnosis,
        diagnosisId: this.consultForm.value.diagnosisId
      };

      this.consultTemplateService.addConsultationTemplate(this.newTemplate).subscribe(
        (res) => {
          this.toaster.success("Consultation template data saved successfully!", "Success");
          this.consultForm.value.newTemplateName = '';
          this.isButtonEnabled = false;
          this.getAllTemplates();
        },
        (err) => {
          this.toaster.error(err.error.message, 'Error')
        }
      );

      this.loaderService.hideLoader()
    }
  }

  UpdateExitingTemplate() {
    if (!this.selectedTemplate) {
      this.toaster.error('select the template to update', 'Error');
      return;
    }
    else {
      this.loaderService.showLoader();

      const template = {
        id: this.selectedTemplate.id,
        templateName: this.selectedTemplate.templateName,
        examinationNote: this.consultForm.value.examinationNote,
        advice: this.consultForm.value.advice,
        diffDiagnosis: this.consultForm.value.diffDiagnosis,
        finalDiagnosis: this.consultForm.value.finalDiagnosis,
        diagnosisId: this.consultForm.value.diagnosisId
      };

      this.consultTemplateService.updateConsultationTemplate(template.id, template).subscribe(
        (res) => {
          this.toaster.success("The existing consultation template is updated successfully!", "Success");
          this.consultForm.value.newTemplateName = '';
          this.isButtonEnabled = false;
          this.getAllTemplates();
        },
        (err) => {
          this.toaster.error(err.error.message, 'Error')
        }
      );

      this.loaderService.hideLoader()
    }
  }

  loadQuestions(): void {
    this.question.getAllQuestions().subscribe(
      (res) => {
        this.questionList = res;
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }


  fetchAllOptions() {
    this.question.getAllOptions().subscribe(res => {
      if (res) {
        this.allOptions = res;
      }
    });
  }

  dispalyPatientQuiz() {
    this.questionLenth = this.combindQuestionOption.length;
    this.currentQuestionData = this.combindQuestionOption[this.questionCounter];
    if (this.currentQuestionData != undefined) {
      if (this.currentQuestionData.questionType === 2 && this.currentQuestionData.savedAnswerText) {
        this.currentQuestionData.savedAnswerText = this.currentQuestionData.savedAnswerText;
      } else if (this.currentQuestionData.questionType === 1 && this.currentQuestionData.savedSelectedOptionId) {
        this.currentQuestionData.savedSelectedOptionId = this.currentQuestionData.savedSelectedOptionId;
      }
    }

    console.log("current", this.currentQuestionData);

  }

  submitAnswers() {
    this.loaderService.showLoader();
    var temp = this.questionnaireDto.filter(item => item.questionnaireId == this.selectedques);
    console.log("submQues", this.submittedQues, this.selectedques);

    // if(!this.submittedQues.includes(this.selectedques)){
    //   
    // }
    if (this.submittedQues.includes(this.selectedques)) {

      console.log("answer dto in update", this.answerDto)

      this.question.updateQuestionniareAnswers(this.answerDto, this.latestId, this.selectedques).subscribe(res => {
        console.log(res);
        this.ApiCallsForPreview();
        this.toaster.success("Questionniare updated successfully", "Questionniare")
      })



    } else {
      console.log("answer dto in add", this.answerDto)
      this.submittedQues.push(this.selectedques);
      this.question.postQuestionniareAnswers(this.answerDto).subscribe(res => {
        this.ApiCallsForPreview();
        this.toaster.success("Questionniare submitted successfully", "Questionniare")
      })


    }

    this.selectedQueslist.push(temp[0])
    this.selectedques = 0;
    this.questionCounter = 0;
    this.finishQuestionniary = false;


    console.log("submQues", this.submittedQues, this.selectedques);
    this.patientInfo.SubQues = this.submittedQues;
    this.patientService.updatePatientData(this.patientId, this.patientInfo).subscribe(res => {
      console.log("patientInfo updated")
      this.loadPatientInfo();
    })
    this.answerDto = [];
    this.combindQuestionOption = [];
    this.loaderService.hideLoader();
    this.loadPatientAppointments();
  }

  groupQuestionsByQuestionnaire() {
    // Step 1: Create a map to group questions by questionnaireId
    const groupedMap = this.questionData.reduce((map, item) => {
      const { questionnaireId, questionnaireName } = item;
      if (!map.has(questionnaireId)) {
        map.set(questionnaireId, {
          questionnaireName,
          questions: []
        });
      }
      map.get(questionnaireId).questions.push(item);
      return map;
    }, new Map<number, { questionnaireName: string; questions: any[] }>());

    // Step 2: Convert the map to an array for use in the template
    this.groupedQuestionData = Array.from(groupedMap.values());
  }

  getAppointmentFiles(fileid: number) {
    console.log();
  }

  closePdfView() {
    this.pdfUrl = '';
  }

  ngOnDestroy() {
    // Clean up the Blob URL
    URL.revokeObjectURL(this.pdfUrl);
  }

  initlizeVitalForm() {
    this.vitalForm = this.fb.group({

      bp: [''],
      height: [''],
      weight: [''],
      pulse: [''],
      tempurature: [''],
      oxigenLevel: [''],
    })

  }
  cancelVitals() {
    this.vitalForm.reset();
  }

  saveVItals(vital: FormGroup) {
    this.loaderService.showLoader();
    this.vitalDto = vital.value;

    if (this.copyId != -1 && this.latestId != -1) {
      this.vitalDto.appointmentId = this.latestId;
    }
    else {
      this.vitalDto.appointmentId = this.latestId;
    }
    this.question.postVitalInformation(this.vitalDto).subscribe(res => {
      this.vitalSubmitted = true;
      this.displayVitalCard = false;
      this.vitalDto.vitalId = res.vitalId;
      this.toaster.success("Vital detail saved", "Vital data");
      this.getQuestionnaireByDepartmentId(this.departmentId)
      this.stepper.next();
    })

    this.loaderService.hideLoader();
  }


  getVitalByAppointment(appointmentId: number) {
    this.question.getVitalInfoByAppointmentId(appointmentId).subscribe(res => {
      res ? this.vitalSubmitted = true : this.vitalSubmitted = false;
      this.vitalDto = res;
      this.patchVitalFormValueForEdit();
    })
  }

  updateVitals() {
    const vitalId = this.vitalDto.vitalId;
    this.vitalDto = this.vitalForm.value;

    // Ensure appointmentId is set correctly based on copyId and latestId
    this.vitalDto.appointmentId = (this.copyId != -1 && this.latestId != -1) ? this.latestId : this.latestId;
    this.vitalDto.vitalId = vitalId;

    // Show loader while updating
    this.loaderService.showLoader();

    this.question.updateVitalInfo(vitalId, this.vitalDto).subscribe(
      (res) => {
        this.toaster.success("Vital Info Successfully Updated", "Vital update");

        // Call getQuestionnaireByDepartmentId and proceed to next step after completion
        this.getQuestionnaireByDepartmentId(this.departmentId).then(() => {
          this.stepper.next();
          this.loaderService.hideLoader();
        }).catch((error) => {
          console.error("Error getting questionnaire:", error);
          this.loaderService.hideLoader();
          // Handle error scenario (e.g., show an error message)
        });
      },
      (error) => {
        console.error("Error updating vital info:", error);
        this.loaderService.hideLoader();
        // Handle error scenario (e.g., show an error message)
      }
    );
  }

  getQuestionnaireByDepartmentId(depId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.question.getQuestionnaireByDepId(depId).subscribe(
        (res) => {
          this.questionnaireDto = res;
          this.loadSavedAnswers(this.latestId);
          resolve();
        },
        (error) => {
          console.error("Error fetching questionnaire:", error);
          reject(error);
        }
      );
    });
  }


  patchVitalFormValueForEdit() {

    this.vitalForm.get('bp')?.patchValue(this.vitalDto.bp)
    this.vitalForm.get('height')?.patchValue(this.vitalDto.height)
    this.vitalForm.get('oxigenLevel')?.patchValue(this.vitalDto.oxigenLevel)
    this.vitalForm.get('tempurature')?.patchValue(this.vitalDto.tempurature)
    this.vitalForm.get('weight')?.patchValue(this.vitalDto.weight)
    this.vitalForm.get('pulse')?.patchValue(this.vitalDto.pulse)
  }


  // prescribe medicine
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

  addDynamicControl(selectMedicine: ImedicineMaster) {
    const newControl = this.fb.group({
      medName: [{ value: 'Dolo 650', disabled: true }, [Validators.required]],
      medType: [{ value: 'Tab', disabled: true }, [Validators.required]],
      unit: [{ value: 'mg', disabled: true }, [Validators.required]],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      timing: ['', Validators.required],
      duration: ['', Validators.required],
      instruction: ['', Validators.required],
    });

    newControl.patchValue({
      medName: selectMedicine.medName,
      medType: selectMedicine.medType,
      unit:selectMedicine.unit,
    });

    this.medicine.push(newControl);
  }

  removeDynamicControl(index: number) {
    this.medicine.removeAt(index);
    this.isMedicinesFormDirty = true;
  }
  get medicine() {
    return this.prescribeMedForm.get('medicine') as FormArray;
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

  submitPrescribeMedicine(prescribeMed: FormGroup) {
    this.loaderService.showLoader();
    const prescribeMedicines = prescribeMed.getRawValue();
    prescribeMedicines.medicine.map((m: IprescribeMedicine) => {
      m.appointmentId = this.latestId;
    })

    this.medicineService.submitPrescribeMedicine(prescribeMedicines.medicine).subscribe(res => {
      if (res) {
        this.loaderService.showLoader();
        this.toaster.success("Medicine add to Prescription", "Add Medicine")
        this.medicine.clear();
        this.searchMedForm.reset();
        this.getPrescribeMedicine();
        this.isMedicinesFormDirty = false;
        this.loaderService.hideLoader();
      }
    })

    this.loaderService.hideLoader();
  }

  createMedicationGroup(): Observable<number> {
    if (this.medicinesGroupForm.valid) {
      return this.medicinesGroupService.addMedicineGroup(this.medicinesGroupForm.value).pipe(
        tap(res => {
          if (res) {
            this.toaster.success("Medicines Group Created", "Success");
            this.getAllMedicationGroups();
            this.medicinesGroupForm.reset();
          }
        }),
        map(res => res.id) // Extract the newly created group ID
      );
    } else {
      this.medicinesGroupForm.markAllAsTouched();
      this.toaster.error("Provide Medicines Group name and description to save as new", "Error");
      return throwError(() => new Error("Form is invalid")); // Return an error Observable if form is invalid
    }
  }

  addNewMedication() {
    this.loaderService.showLoader();

    const prescribeMedicines = this.prescribeMedForm.getRawValue();

    // ✅ Check if there is at least one medicine before proceeding
    if (!prescribeMedicines.medicine || prescribeMedicines.medicine.length === 0) {
      this.toaster.error("Please add at least one medicine before saving.", "Error");
      this.loaderService.hideLoader();
      return;
    }

    this.createMedicationGroup().pipe(
      switchMap(newGroupId => {
        // Assign groupId to all medicines
        prescribeMedicines.medicine.forEach((m: IMedicationGroup) => {
          m.groupId = newGroupId;
          m.id = 0;
        });

        // Submit the medicines to the new group
        return this.medicinesGroupService.submitMedicationGroup(prescribeMedicines.medicine);
      })
    ).subscribe({
      next: res => {
        if (res) {
          this.toaster.success("Medication added to new group", "Success");
          this.SearchMedicineList = [];
          this.searchMedForm.reset();
          this.getAllMedicationGroups();
          this.isMedicinesFormDirty = false;
        }
        this.loaderService.hideLoader();
      },
      error: err => {
        console.error("Error in addNewMedication:", err);
        this.loaderService.hideLoader();
      }
    });
  }


  updateMedication() {
    this.loaderService.showLoader();

    const prescribeMedicines = this.prescribeMedForm.getRawValue();

    if (!prescribeMedicines.medicine || prescribeMedicines.medicine.length === 0) {
      this.toaster.error("Please add at least one medicine before saving.", "Error");
      this.loaderService.hideLoader();
      return;
    }

    this.medicinesGroupService.replaceMedicationGroup(prescribeMedicines.medicine).subscribe(res => {
      this.toaster.success("Medication updated", "Success");
      this.SearchMedicineList = [];
      this.searchMedForm.reset();
      this.isMedicinesFormDirty = false;
    });

    this.loaderService.hideLoader();
  }

  selectMedicine(id: number) {
    
    const selectMedicine = this.SearchMedicineList[id];
    this.addDynamicControl(selectMedicine);
    this.SearchMedicineList = [];
    this.searchMedForm.reset();
    this.subscribeToFormChanges(); // Call after populating the form
  }

  initlizeConsultForm() {
    this.consultForm = this.fb.group({
      examinationNote: [''],
      advice: [''],
      diffDiagnosis: [''],
      finalDiagnosis: [''],
      followupDate: [''],
      diagnosisId: [''],
      newTemplateName: ['']
    })
  }
  cancelConsultation() {
    this.consultForm.reset()
  }
  getConsultationOnAppointmentId(id: number) {
    this.consultService.getConsultData(id).subscribe(res => {
      res ? this.showNext = true : this.showNext = false;
      this.consultForm.patchValue(res[res.length - 1]);
      this._consultationDto = res[res.length - 1];
    })
  }

  getUploadedFiles(id: number) {
    this.presDocuments = [];
    this.vitalDocuments = [];
    this.previewFile = [];
    this.fileUpladServie.getUpodedFileByAppointment(id).subscribe(res => {
      res.forEach(item => {
        if (item.docName == "prescription" || item.docName == "pen-prescription" || item.docName=='drawing') {
          this.presDocuments.push(item);
          this.checkPenPrescription();
          console.log(this.presDocuments)
        }
        if (item.docName == "vital") {
          this.vitalDocuments.push(item);
        }
        if (item.docName == "previewFile") {
          this.previewFile.push(item);
        }
      })
    },
    error => {
      console.error('Error adding consultation data:', error);
      this.hasPenPrescription=false;
      // Handle the error as needed
    },)
  }

  submitConsultation(consultData: FormGroup) {
    this.loaderService.showLoader();
    const days = parseInt(consultData.value.followupDate)
    if (days.toString() == "NaN") {
      const currentDate = new Date();
      const formatDate = (this.addDays(currentDate, 0))
      const x = this.datePipe.transform(formatDate, 'yyyy-MM-dd')
      if (x) {

        this.consultForm.get('followupDate')?.patchValue(x);
      }

      this._consultationDto = consultData.value;
      if (this.copyId != -1 && this.latestId != -1) {
        this._consultationDto.appointmentId = this.latestId;
      }
      else {
        this._consultationDto.appointmentId = this.latestId;
      }
      this.consultService.addConsultationData(this._consultationDto).subscribe(res => {
        this.toaster.success("Consultation Data Saved", "Consultation Data")
        //to set pad-prescription false
        this.hasPenPrescription=false;
        this.toggalUi = false;
        this.ApiCallsForPreview();
        this.stepper.next();
      },
        error => {
          console.error('Error adding consultation data:', error);
          // Handle the error as needed
        },
        () => {
          console.log('Consultation data observable completed');
        })
      this.loaderService.hideLoader();

    }
    else {
      this.loaderService.showLoader();
      const currentDate = new Date();
      const formatDate = (this.addDays(currentDate, days))
      const x = this.datePipe.transform(formatDate, 'yyyy-MM-dd')
      if (x) {

        this.consultForm.get('followupDate')?.patchValue(x);
      }

      this._consultationDto = consultData.value;
      if (this.copyId != -1 && this.latestId != -1) {
        this._consultationDto.appointmentId = this.latestId;
      }
      else {
        this._consultationDto.appointmentId = this.latestId;
      }
      this.consultService.addConsultationData(this._consultationDto).subscribe(res => {
        this.toaster.success("Consultation Data Saved", "Consultation Data")
        this.toggalUi = false;
        this.ApiCallsForPreview();
        this.stepper.next();
      },
        error => {
          console.error('Error adding consultation data:', error);
          // Handle the error as needed
        },
        () => {
          console.log('Consultation data observable completed');
        })

      this.loaderService.hideLoader();



    }

  }
  updateConsultation() {

    this.loaderService.showLoader();
    const consultId = this._consultationDto.id;

    this._consultationDto = this.consultForm.value;
    if (this.copyId != -1 && this.latestId != -1) {
      this._consultationDto.appointmentId = this.latestId;
    }
    else {
      this._consultationDto.appointmentId = this.latestId;
    }
    this._consultationDto.id = consultId;
    this.consultService.updateConsultData(consultId, this._consultationDto).subscribe(res => {
      this.loaderService.hideLoader();
      this.toaster.success("Consultation Info Successfully Updated", "Consultation update");
      // this.abhaService.confirmOtp().subscribe(
      //   res => {
      //     console.log(res);
      //   }
      // );      
      this.ApiCallsForPreview();
      this.stepper.next();
    },
      error => {
        this.loaderService.hideLoader();
        console.error('Error in updating consultation:', error);
        this.toastr.error('Consultation update failed!', 'Error');
      });
  }


  addPreDefineDiagnosis(diagnosis: any) {
    const data = this.getPreDiagnosisById(diagnosis.value);
    this.consultForm.get('finalDiagnosis')?.patchValue(data?.diagnosText)
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  ApiCallsForPreview() {
    this.appointmentId = this.appointmentService.appointmentId
    this.question.getQuestionwithAnswerByAppointmentId(this.latestId).subscribe(res => {
      this.questionData = res;
      this.groupQuestionsByQuestionnaire();
      // Push unique submitted questionnaireIds to submittedQues
      const uniqueQuestionnaireIds = Array.from(new Set(res.map((item: { questionnaireId: number }) => item.questionnaireId)));

      this.submittedQues.push(...uniqueQuestionnaireIds);
    })

    this.consultService.getConsultData(this.latestId).subscribe(res => {
      this._consultationDto = res[0];

    })
    this.medicineService.getPrescribeMedicine(this.latestId).subscribe(res => {
      console.log("medicine", res)
      this.medicineDto = res;
    })

  }

  exportConsultationToPdf() {
    const pdf = new jspdf.jsPDF();
    const content: HTMLElement | null = document.getElementById('pdfview');
    if (content === null) {
      console.error('Element with ID "contentToExport" not found');
      return;

    }
    else {


      html2canvas(content).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        const imgWidth = 210; // mm
        const imgHeight = canvas.height * imgWidth / canvas.width;

        pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`consultation Paper.pdf`);
      });
    }
  }
  //consutation fine upload code
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onVfileSelected(event: any) {
    this.VselectedFile = event.target.files[0];
  }

  deleteFile(id: number) {
    this.fileUpladServie.deleteConsultationFile(id).subscribe(result => {
      //this.spinner.hide();
      this.getUploadedFiles(this.latestId)
      this.toastr.success('File deleted Successfully', 'Success');
    });
  }

  onFileUpload(docName: string) {
    if (this.selectedFile) {
      // Show spinner or loading indicator if needed

      this.loaderService.showLoader();

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;

        this.FileUploadDto.fileName = this.selectedFile?.name;
        this.FileUploadDto.FileType = this.selectedFile?.type;
        this.FileUploadDto.fileData = base64String;
        this.FileUploadDto.docName = docName;
        this.FileUploadDto.appointmentId = this.latestId;

        // Check for supported file types (for example, PDFs, Word documents, etc.)
        //const supportedFileTypes: string[] = ["application/pdf", "application/msword", "application/jpeg", "application/png", "application/txt", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]; 
        //if (this.selectedFile?.type != null && supportedFileTypes.includes(this.selectedFile.type))
        if ((docName == 'prescription' && this.selectedFile?.type.startsWith('image/'))
          || (docName == 'previewFile' && (this.selectedFile?.type.startsWith('application/pdf') || this.selectedFile?.type.startsWith('application/msword')))) {
          this.fileUpladServie.uploadConsultationFile(this.FileUploadDto).subscribe(
            result => {
              // Hide spinner if needed
              this.getUploadedFiles(this.latestId);
              this.selectedFile = null;
              this.loaderService.hideLoader();
              this.toastr.success('File uploaded Successfully', 'Success');
            },
            error => {
              this.loaderService.hideLoader();
              console.error('Error uploading file:', error);
              this.toastr.error('File upload failed', 'Error');
            }
          );
        } else {
          this.loaderService.hideLoader();
          this.toastr.error("Unsupported file type", "File Type");
        }
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.loaderService.hideLoader();
      this.toastr.error("No file selected", "Select a file");
    }
  }

  onVFileUpload() {
    if (this.VselectedFile) {
      this.loaderService.showLoader();
      const reader1 = new FileReader();
      reader1.onload = () => {
        this.base64String = reader1.result as string;
        this.VFileUploadDto.fileName = this.VselectedFile?.name;
        this.VFileUploadDto.FileType = this.VselectedFile?.type;
        this.VFileUploadDto.fileData = this.base64String;
        this.VFileUploadDto.docName = "vital";
        this.VFileUploadDto.appointmentId = this.latestId;
        const supportedFileTypes: string[] = ["application/pdf", "application/msword", "image/jpeg", "image/jpeg", "application/txt", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (this.VselectedFile?.type != null && supportedFileTypes.includes(this.VselectedFile.type)) {
          this.fileUpladServie.uploadConsultationFile(this.VFileUploadDto).subscribe(result => {
            this.getUploadedFiles(this.latestId);
            this.VselectedFile = null;
            this.loaderService.hideLoader();
            this.toastr.success('File uploaded Successfully', 'Success');
          });
        }
        else {
          this.loaderService.hideLoader();
          this.toaster.error("File type not correct", "File Type")
        }
      }
      reader1.readAsDataURL(this.VselectedFile);
    }
    else {
      this.loaderService.hideLoader();
      this.toaster.error("No file selected", "Select a file")
    }

  }
  editDetails(id: number, dateHere: Date) {
    this.latestId = id;
    this.seletedAppointmentDate = dateHere;
    this.getUploadedFiles(id);
    this.getVitalByAppointment(this.latestId);
    this.stepper.next();
  }
  movetopres() {
    if (this.copyId != -1) {
      this.getConsultationOnAppointmentId(this.copyId)
      this.getUploadedFiles(this.copyId);
    }
    else {
      this.getConsultationOnAppointmentId(this.latestId)
      this.getUploadedFiles(this.latestId);
    }
    this.getPrescribeMedicine();
    this.toggalUi = true;
    this.stepper.next();

  }



  getPrescribeMedicine() {
    this.medicineService.getPrescribeMedicine(this.latestId).subscribe(res => {
      this.medicineDto = res;
    })
  }

  getDoctorDetails() {
    this.doctorService.getStaffByID(this.doctorId).subscribe(res => {
      this._doctorDto = res;
    })
  }
  getCurrentAppointmentDetils() {
    this.appointmentService.getAppointmentById(this.latestId).subscribe(res => {
      this._appointmentDto = res;
    })
  }
  getConsultationFiles() {
    this.fileUpladServie.getConsultationFileByAppointment(this.latestId).subscribe(res => {
      //const data:IconsultationFiles[]=res;
      // const fileData=res.map(data=>data.fileData)
      // this.displayImage.push(...fileData);
      this.displayImage = res;
    })
    //this.images=this.displayImage[0];    

  }
  gotodocuments() {
    this.getUploadedFiles(this.latestId);
    this.stepper.next();
  }

  getPreDiagnosisTemplate() {
    this.consultService.GetAllDiagnosis().subscribe(res => {
      this.preDiagnosis = res;
    })
  }
  getFileNameWithoutExtension(fileName: string): string {
    // Split the file name by the dot (.)
    const parts = fileName.split('.');
    // Take the first part which represents the file name without the extension
    return parts[0];
  }

  print() {


    const printContents = this.pdfview.nativeElement.innerHTML;

    //const printContents = this.printSection.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }

  updateAppointmentId(appointmentId: number) {

    this.appointmentService.appointmentId = appointmentId;
    const currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    })

  }

  getIcon(documentName: string): string {
    const extension = documentName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf'; // Material icon for PDFs
      case 'doc':
      case 'docx':
        return 'description'; // Generic document icon
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'image'; // Icon for images
      case 'txt':
        return 'text_snippet'; // Icon for text files
      default:
        return 'insert_drive_file'; // Generic file icon
    }
  }
}
