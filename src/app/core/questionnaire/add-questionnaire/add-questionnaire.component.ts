import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { HospitalService } from 'src/app/shared/Services/hospital/hospital.service';
import { QuestionService } from 'src/app/shared/Services/question/question.service';
import { IQuestionnaires, Ianswers, Idepartment, Ilogin, Ioptions, Iquestion } from 'src/app/shared/models/models';

import { routes } from 'src/app/shared/routes/routes';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';
import { LoadingService } from 'src/app/shared/Services/loader/loader.service';

@Component({
  selector: 'app-add-questionnaire',
  templateUrl: './add-questionnaire.component.html',
  styleUrls: ['./add-questionnaire.component.scss'],
})
export class AddQuestionnaireComponent implements OnInit, OnDestroy {
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;

  public routes = routes;
  public questForm!: FormGroup;
  public _depDto: Idepartment[] = [];
  public _questNameDto: IQuestionnaires[] = [];
  public combineData: any[] = [];
  public combindQuestionOption: any[] = [];

  public answerDto: Ianswers[] = [];
  private hospitalSubscription!: Subscription;

  public img = "assets/img/profiles/avatar-08.jpg";

  questionnaireStatuses: string[] = ['All', 'Active', 'Inactive'];
  selectedStatus: string = 'All';


  //*******varible for question Section *** */
  public showAddQuestion = false;
  public questionForm!: FormGroup;
  private questionnaireId!: number;
  public selectedQuestionnaire!: string;
  public _questionDto!: Iquestion;
  public questiontoDisplay: any[] = [];
  public objectiveType = false;
  private optionArray: Ioptions[] = [];
  public optionObject!: Ioptions;
  public answerForm!: FormGroup;
  private loggedInUserId!: Ilogin;
  private questionId!: number;
  public editQuestion = false;
  public currentQuestion = 0;
  public nextQuestionId = 0;
  public previousQuestion!: number;
  public questionLenth = 0;
  public currentQuestionData: any;
  public finishQuestionniary = false;
  private questionCounter = 0;
  public subQuestionCounter = 0;
  public optionsNotAvailable=true;
  public textMappingCounter=0;

  selectedRow: number | null = null;
  selectedOption!: number;
  currentQuestionIndex: number = 1;
  totalQuestions: number = 1;
  selectedQuestionIdToMap: number | null = null;
  questionList!: Iquestion[];
  showQuestionList: boolean = false;
  public allOptions: Ioptions[] = [];
  textInputValue: string = '';

  // --- Select All/Checkbox logic ---
  public selectedQuestions: number[] = [];
  public selectAllChecked: boolean = false;
  public displayedQuestions: any[] = [];
  public displayedQuestionIndex: number = 0;


  constructor(private fb: FormBuilder,
    private departmentService: DepartmentService,
    private question: QuestionService,
    private toaster: ToastrService,
    private modalservice: ModalServiceService,
    private loadingService: LoadingService,
    private hospitalService: HospitalService) {

    this.initlizaQuestForm();
    this.initlizeQuestionForm();
    this.answerForm = this.fb.group({});
    this.loggedInUserId = JSON.parse(localStorage.getItem('data') || '');
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.fetchAllOptions();
    
    // Subscribe to hospital changes
    this.hospitalSubscription = this.hospitalService.currentHospitalId$.subscribe(hospitalId => {
      if (hospitalId) {
        this.reloadDataForHospital();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.hospitalSubscription) {
      this.hospitalSubscription.unsubscribe();
    }
  }

  private reloadDataForHospital(): void {
    this.getDepartmentList();
    this.getQuestionairewithDepName();
  }

  initlizaQuestForm() {
    this.questForm = this.fb.group({
      questionnaireName: ['', Validators.required],
      questinaryDeptId: ['', Validators.required]

    })

  }

  //Delete Questionnaire
  deleteQues(idhere: number) {
    this.questionnaireId = idhere;
    this.modalservice.openModal({
      type: 'question',
      id: idhere,
      confirmCallback: () => this.confirmDelete()
    });
  }

  //Delete Question
  deleteQuestion(id: number) {
    this.questionId = id;
    this.modalservice.openModal({
      type: 'question',
      id: id,
      confirmCallback: () => this.confirmQuestionDelete()
    });
  }


  getDepartmentList() {
    this.departmentService.getDepartmentList().subscribe(data => {
      // Replace the department list rather than pushing repeatedly
      this._depDto = data.filter((res: any) => res.departmentName !== 'admin');
    })
  }


  addQustionnaireName(questValue: FormGroup) {
    if (questValue.valid) {
      this.question.CreateQuestionaireName(questValue.value).subscribe(res => {
        if (res) {
          this.toaster.success("Questionaire created ", "Questionaire Name")
          this.getQuestionairewithDepName();
          this.questForm.reset();
        }
      })

    } else {
      questValue.markAllAsTouched()
    }



  }

  // getQuestionaireName()
  // {
  //   this.question.getAllQuestionaireName().subscribe(res=>{
  //     this._questNameDto=res;
  //   })
  // }

  getQuestionairewithDepName() {
    this.combineData = [];
    this.loadingService.showLoader();

    const depName$ = this.departmentService.getDepartmentList();
    const questionaire$ = this.question.getAllQuestionaireName();
    forkJoin([depName$, questionaire$]).subscribe(([depName, questionaire]) => {

      // Define a lookup object for filter functions
      const filterFunctions: { [key: string]: (quest: any) => boolean } = {
        'Active': (quest: any) => quest.isActive,
        'Inactive': (quest: any) => !quest.isActive,
        'All': (quest: any) => true  // Assuming 'All' is the value of this.selectedStatus when no filter is applied
      };

      // Get the appropriate filter function based on this.selectedOption
      const filterFunction = filterFunctions[this.selectedStatus] || filterFunctions['All'];

      // Filter questionaire using the selected filter function
      const filteredQuestionaire = questionaire.filter(filterFunction);

      this.combineData = filteredQuestionaire.map((questName: any) => {
        const departmentName = depName.find((dep: any) => questName.questinaryDeptId === dep.departmentId);
        return {
          ...questName,
          deptName: departmentName ? departmentName.departmentName : 'Unknown Name',
        };
      });

      // Hide loader once after processing
      this.loadingService.hideLoader();

      // Select the top questionnaire by default — only if it's different from currently loaded
      if (this.combineData.length > 0) {
        const topQuestionnaire = this.combineData[0];
        if (!this.questionnaireId || topQuestionnaire.questionnaireId !== this.questionnaireId) {
          this.OnQuestionnaireChange(topQuestionnaire);
        }
      }
    });
  }


  onEditQuestionaire(data: any) {
    this.question.toggleQuestionaireStatus(data).subscribe(res => {
      if (res == null) {
        this.toaster.success("Questionaire status is updated!")
        this.getQuestionairewithDepName();
      }
    })
  }


  //********************* */
  questionType = [
    { key: "Optional", value: 1 },
    { key: "Text", value: 2 }
  ]

  initlizeQuestionForm() {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['', Validators.required],
      questionMapping: [''],
      optionControls: this.fb.array([

      ])
    })
  }


  addDynamicControl() {
    this.showQuestionList = true;
    if(this.objectiveType==false && this.textMappingCounter==0||this.objectiveType==true)
    {
      this.textMappingCounter++;
    this.optionControls.push(
      this.fb.group({
        option: ['', Validators.required],
        mapQuestionId: ['', Validators.required]
      })
    )
    }
    

  }

  removeDynamicControl(index: number) {
    this.optionControls.removeAt(index);  // Remove the dynamic control at the specified index
    this.textMappingCounter=0;
  }

  get optionControls() {
    return this.questionForm.get('optionControls') as FormArray;
  }

  resetForm(): void {
    this.editQuestion = false;
    this.currentQuestionIndex = 1;

    this.resetAddQuestion();
  }

  resetAddQuestion() {
    //this.editQuestion = false;
    this.questionForm.reset();
    this.optionControls.clear();
  }

  OnQuestionnaireChange(data: any) {
    this.resetForm();

    this.selectedQuestionnaire = data.questionnaireName;
    this.showaddQuestion(data.questionnaireId);
    //this.showAddQuestion = this.currentQuestionData == null || this.currentQuestionData.length == 0 ? false : true;
  }

  showAddQuestionSection() {
    this.showAddQuestion = true;
  }

  showaddQuestion(id: number) {
    this.showAddQuestion = true;
    this.questionnaireId = id;
    this.questionCounter = 0;
    this.subQuestionCounter = 0;
    this.finishQuestionniary = false;
    this.getQuestionByQuestionniareId(this.questionnaireId)
    this.mapQuestionAndOptions(this.questionnaireId);
    //this.dispalyPatientQuiz();
    const len = this.combindQuestionOption.length;
    // Reset answer form before adding controls to avoid duplicate controls on repeated calls
    this.answerForm = this.fb.group({});
    for (let i = 1; i <= len; i++) {
      const str = String(i)
      this.addFormControlNametoFormGroup(str)
    }
  }

  addFormControlNametoFormGroup(questionName: string): void {
    this.answerForm.addControl(questionName, this.fb.control('', Validators.required));
  }

  addQustion(data: FormGroup) {
    if (!data.valid) {
      data.markAllAsTouched();
      return;
    }

    this.optionArray = [];
    this._questionDto = data.value;
    this._questionDto.questionnaireId = this.questionnaireId;

    this.question.createQuestion(this._questionDto).subscribe(res => {
      const id: number = res.questionId
      this.toaster.success("Question added Successfully", "Add Question");
      this.showaddQuestion(this.questionnaireId);
    })
  }

  getQuestionByQuestionniareId(questId: number) {
    this.question.getQuestionByQuestionaireId(questId).subscribe(res => {

      this.questiontoDisplay = res;

      if (this.questiontoDisplay != null && this.questiontoDisplay.length > 0) {
        this.showAddQuestionSection();
      }
    })
  }

  mapQuestionAndOptions(questId: number) {
    const question$ = this.question.getQuestionByQuestionaireId(questId)
    const options$ = this.question.getAllOptions();

    forkJoin([question$, options$]).subscribe(([question, options]) => {

      this.combindQuestionOption = question.map((quest: any) => {
        // Ensure an options array exists so we can push into it safely
        quest.options = quest.options || [];
        options.forEach(e => {
          if (e.questionId == quest.questionId) {
            const optData: any = {
              optionId: e.optionId,
              optionText: e.optionText,
              mapQuestionId: e.mapQuestionId
            };
            quest.options.push(optData);
          }
        });

        const opt = options.find(e => e.questionId == quest.questionId);

        return {
          ...quest,
          mapQuestionId: opt ? opt.mapQuestionId : 0,
        };
      });

      // If the user already selected questions, refresh the displayed set so options appear
      this.updateDisplayedQuestions();
      this.dispalyPatientQuiz();
    })

  }


  showOption(event: any) {

    if(event == 1)
    {
      this.objectiveType = true
    }  
    else
    {
      this.objectiveType = false;
     // this.textMappingCounter++;

    } 

  }


  addOptions(option: any[]) {
    this.question.createOption(option).subscribe(res => {
      this.toaster.success("Options added Successfully", "Add Options")
      this.resetAddQuestion();
      this.objectiveType = false;
    })
  }

  //*************display questions ************** */

  saveAnswer(answer: NgForm) {
    const answerKey = Object.keys(answer.value)[0];
    if (this.currentQuestionData.options.length > 0) {
      this.currentQuestionData.options.map((res: Ioptions) => {
        if (res.optionId == answer.value[answerKey] || this.currentQuestionData.options.length==1) {
          res.mapQuestionId ? this.nextQuestionId = res.mapQuestionId : this.nextQuestionId = 0;
        }
      })
    }

    const answerObject: Ianswers = {
      questionId: this.currentQuestionData.questionId,
      participantId: this.loggedInUserId.loginId,
      answerText: typeof answer.value[answerKey] === 'string' ? answer.value[answerKey] : '',
      selectedOptionId: typeof answer.value[answerKey] !== 'string' ? answer.value[answerKey] : null
    }
    this.answerDto.push(answerObject);


    this.nextQuestion();

  }

  EditQuestionAddOptionWithMapping(questId: number) {
    this.textMappingCounter=0;
    this.questionId = questId
    this.editQuestion = true;

    this.question.getQuestionById(this.questionId).subscribe(res => {

      this.questionForm.get('questionText')?.patchValue(res.questionText);
      this.questionForm.get('questionType')?.patchValue(res.questionType);
      this.questionForm.get("questionMapping")?.patchValue(270);
      this.showOption(res.questionType);

      // If editing an objective/optional question, load its existing options
      if (res.questionType === 1) {
        // ensure form array empty before populating
        this.optionControls.clear();
        this.question.getAllOptions().subscribe(opts => {
          const qopts = opts.filter((o: any) => o.questionId === this.questionId);
          qopts.forEach((o: any) => {
            this.optionControls.push(
              this.fb.group({
                option: [o.optionText || '', Validators.required],
                mapQuestionId: [o.mapQuestionId || '', Validators.required]
              })
            );
          });
        });
      } else {
        // clear any leftover option controls for non-objective types
        this.optionControls.clear();
      }
    })
  }

  loadQuestions(): void {
    this.question.getAllQuestions().subscribe(
      (res) => {
        this.questionList = res;
      },
      (error) => {

      }
    );
  }


  // add Options in question with mapping of next question based on response 
  updateQuestionOptions() {

    let temp: any[] = [];
    this.optionArray = [];
    const x = { ...this.questionForm.value };
    delete x.optionControls
    this._questionDto = x;

    // this._questionDto.questionText=this.questionForm.get('questionText')?.value;
    // this._questionDto.questionType=this.questionForm.get('questionType')?.value;
    //this._questionDto.questionnaireId=this.questionForm.get('questionnaireId')?.value;
    this._questionDto.questionId = this.questionId;
    this._questionDto.questionnaireId = this.questionnaireId;
    if (this.questionForm.value.questionType == 1 || this.questionForm.value.questionType == 2) {
      if (this.questionForm.value.optionControls.length > 0) {
        temp = this.questionForm.value.optionControls;
      }

      temp.map(data => {
        const optionObject =
        {

          questionId: this.questionId,
          optionText: data.option,
          mapQuestionId: data.mapQuestionId

        }
        this.optionArray.push(optionObject)
      })
      if (this.optionArray.length > 0) {
        this.addOptions(this.optionArray)
      }

      this.showaddQuestion(this.questionnaireId)
      this.editQuestion = false;
    }
    //********************question update testing code */

    //   this.question.updateQuestion(this.questionId,this._questionDto).subscribe(res=>{
    //   const id:number=res.questionId
    //    
    //  })

    //else{
    this.question.updateQuestion(this.questionId, this._questionDto).subscribe(res => {

      this.toaster.success("Question Updated Successfully", "Update Question")
      this.showaddQuestion(this.questionnaireId)
      //this.textMappingCounter=0;

    })
    // }
  }

  //display question one by one on UI to select Answer
  dispalyPatientQuiz() {
    this.questionLenth = this.displayedQuestions.length;
    this.subQuestionCounter = 0;
    this.displayedQuestionIndex = 0;
    if (this.displayedQuestions.length > 0) {
      this.currentQuestionData = this.displayedQuestions[0];
      this.currentQuestionIndex = 1;
    } else {
      this.currentQuestionData = null;
      this.currentQuestionIndex = 0;
    }
  }

  nextQuestion() {
    var subQuestionIndex = -1;
    // Only navigate through displayedQuestions
    if (this.displayedQuestions.length === 0) return;

    // If there's a next question id, it means we need to navigate to a sub-question
    if (this.nextQuestionId != 0 && this.nextQuestionId != this.currentQuestionData.questionId) {
      this.subQuestionCounter = 1;
      //this.subQuestionCounter=this.currentQuestionData.mapQuestionId

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
    else if(this.nextQuestionId == this.currentQuestionData.questionId){
      subQuestionIndex = -1;
      
      this.displayedQuestionIndex = this.questionLenth;
    } else {
      // Go to next checked question
      this.displayedQuestionIndex++;
      if (this.displayedQuestionIndex < this.questionLenth) {
        this.currentQuestionData = this.displayedQuestions[this.displayedQuestionIndex];
        subQuestionIndex = this.currentQuestionData.options.length > 0 ? 0 : -1;
        this.subQuestionCounter = this.currentQuestionData.options.length > 0 ? 1 : -1;
      }
    }
    this.currentQuestionIndex = this.displayedQuestionIndex + 1;
    if (this.displayedQuestionIndex >= this.questionLenth && subQuestionIndex == -1) {
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

    }
  }

  getOptionsForQuestion(questId: number): Ioptions[] {
    return this.allOptions.filter(option => option.questionId === questId)
  }

  fetchAllOptions() {
    this.question.getAllOptions().subscribe(res => {
      if (res) {
        this.allOptions = res;
      }
    });
  }

  checkquestionFlow() {
    this.combindQuestionOption = [];
    this.finishQuestionniary = false;
  }


  // submitAnswers()
  // {
  //   this.question.postQuestionniareAnswers(this.answerDto).subscribe(res=>{


  //     this.toaster.success("Questionniare submitted successfully","Questionniare")
  //   })
  //   this.answerDto=[];
  // }
  onStatusChange(event: any) {
    this.selectedStatus = event.value;
    this.getQuestionairewithDepName();
  }

  openModal(questionnaireId: number) {
    this.questionnaireId = questionnaireId;
  }
  
  confirmDelete() {
    this.question.deleteQuestionaire(this.questionnaireId).subscribe(res => {
      if (res == null) {
        this.toaster.success("Questionaire is deleted!")
        this.getQuestionairewithDepName();
      }
    })
  }

  confirmQuestionDelete() {
    this.question.deleteQuestion(this.questionId).subscribe(res => {
      if (res == null) {
        this.toaster.success("Question is deleted!")
        this.showaddQuestion(this.questionnaireId);
      }
    })
  }

  // onClear(){

  // }

  selectRow(index: number): void {
    this.selectedRow = index;
  }

  deleteOption() {
    this.question.deleteOption(this.selectedOption).subscribe(res => {
      if (res == null) {
        this.toaster.success("Option is deleted!")
        this.mapQuestionAndOptions(this.questionnaireId);
      }
    })
  }

  onOptionChange(index: number) {
    this.selectedOption = index;

  }

  populateQuestionId(questionId: number): void {
    this.selectedQuestionIdToMap = questionId;
  }

  // --- Select All/Checkbox logic ---
  toggleSelectAll() {
    this.selectAllChecked = !this.selectAllChecked;
    if (this.selectAllChecked) {
      this.selectedQuestions = this.questiontoDisplay.map(q => q.questionId);
    } else {
      this.selectedQuestions = [];
    }
    this.updateDisplayedQuestions();
  }

  isQuestionSelected(questionId: number): boolean {
    return this.selectedQuestions.includes(questionId);
  }

  toggleQuestionSelection(questionId: number) {
    if (this.selectedQuestions.includes(questionId)) {
      this.selectedQuestions = this.selectedQuestions.filter(id => id !== questionId);
    } else {
      this.selectedQuestions.push(questionId);
    }
    this.selectAllChecked = this.selectedQuestions.length === this.questiontoDisplay.length && this.questiontoDisplay.length > 0;
    this.updateDisplayedQuestions();
  }

  // When questionnaire is selected or questions are loaded, filter combindQuestionOption to only include checked questions
  updateDisplayedQuestions() {
    this.displayedQuestions = this.combindQuestionOption.filter(q => this.selectedQuestions.includes(q.questionId));
    this.displayedQuestionIndex = 0;
    this.currentQuestionIndex = 1;
    this.subQuestionCounter = 0;
    this.finishQuestionniary = false;
    if (this.displayedQuestions.length > 0) {
      this.currentQuestionData = this.displayedQuestions[0];
      this.questionLenth = this.displayedQuestions.length;
    } else {
      this.currentQuestionData = null;
      this.questionLenth = 0;
    }
  }
}


