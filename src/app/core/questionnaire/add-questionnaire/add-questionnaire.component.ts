
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { QuestionService } from 'src/app/shared/Services/question/question.service';
import { IQuestionnaires, Ianswers, Idepartment, Ilogin, Ioptions, Iquestion } from 'src/app/shared/models/models';

import { routes } from 'src/app/shared/routes/routes';
import { ModalComponent } from '../../modal/modal.component';
import { ModalServiceService } from 'src/app/shared/modalService/modal-service.service';

@Component({
  selector: 'app-add-questionnaire',
  templateUrl: './add-questionnaire.component.html',
  styleUrls: ['./add-questionnaire.component.scss'],
})
export class AddQuestionnaireComponent {
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;

  public routes = routes;
  public questForm!: FormGroup;
  public _depDto: Idepartment[] = [];
  public _questNameDto: IQuestionnaires[] = [];
  public combineData: any[] = [];
  public combindQuestionOption: any[] = [];

  public answerDto: Ianswers[] = [];

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

  selectedRow: number | null = null;
  selectedOption!: number;
  currentQuestionIndex: number = 1;
  totalQuestions: number = 1;
  selectedQuestionIdToMap: number | null = null;
  questionList!: Iquestion[];
  showQuestionList: boolean = false;
  public allOptions: Ioptions[] = [];
  textInputValue: string = '';


  constructor(private fb: FormBuilder,
    private departmentService: DepartmentService,
    private question: QuestionService,
    private toaster: ToastrService,
    private modalservice: ModalServiceService) {

    this.initlizaQuestForm();
    this.getDepartmentList();
    this.getQuestionairewithDepName();
    this.initlizeQuestionForm();
    this.answerForm = this.fb.group({});
    this.loggedInUserId = JSON.parse(localStorage.getItem('data') || '');
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.fetchAllOptions();
    //this.dispalyPatientQuiz(); // Make sure this is called to set the initial question
  }

  initlizaQuestForm() {
    this.questForm = this.fb.group({
      questionnaireName: ['', Validators.required],
      questinaryDeptId: ['', Validators.required]

    })

  }

  deleteQues(idhere: number) {
    this.questionnaireId = idhere;
    this.modalservice.openModal({
      type: 'question',
      id: idhere,
      confirmCallback: () => this.confirmDelete()
    });
  }



  getDepartmentList() {
    this.departmentService.getDepartmentList().subscribe(data => {

      data.map((res: any) => {
        if (res.departmentName != 'admin') {
          this._depDto.push(res)
        }
      })

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

      // Select the top questionnaire by default if available
      if (this.combineData.length > 0) {
        const topQuestionnaire = this.combineData[0];
        this.OnQuestionnaireChange(topQuestionnaire);
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
      optionControls: this.fb.array([

      ])
    })
  }


  addDynamicControl() {
    this.showQuestionList = true;
    this.optionControls.push(
      this.fb.group({
        option: ['', Validators.required],
        mapQuestionId: ['', Validators.required]
      })
    )

  }

  removeDynamicControl(index: number) {
    this.optionControls.removeAt(index);  // Remove the dynamic control at the specified index
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
      console.log(res);
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
        options.map(e => {
          if (e.questionId == quest.questionId) {
            const optData: any = {};
            optData.optionId = e.optionId;
            optData.optionText = e.optionText;
            optData.mapQuestionId = e.mapQuestionId;
            quest.options.push(optData);
          }
        })

        const opt = options.find(e => e.questionId == quest.questionId);

        return {
          ...quest,
          mapQuestionId: opt ? opt.mapQuestionId : 0,

        }
      })
      this.dispalyPatientQuiz();
    })

  }


  showOption(event: any) {

    event == 1 ? this.objectiveType = true : this.objectiveType = false;
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
        if (res.optionId == answer.value[answerKey]) {
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

    console.log(answer.value)
    this.nextQuestion();

  }

  EditQuestionAddOptionWithMapping(questId: number) {
    this.questionId = questId
    this.editQuestion = true;

    this.question.getQuestionById(this.questionId).subscribe(res => {
      console.log(res)
      this.questionForm.get('questionText')?.patchValue(res.questionText);
      this.questionForm.get('questionType')?.patchValue(res.questionType);
      this.showOption(res.questionType);
    })
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
    if (this.questionForm.value.questionType == 1) {
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

    })
    // }
  }

  //display question one by one on UI to select Answer
  dispalyPatientQuiz() {
    this.questionLenth = this.combindQuestionOption.length;
    this.subQuestionCounter = this.questionLenth > 0 ? 1 : 0;

    this.currentQuestionData = this.combindQuestionOption[this.questionCounter];
    this.currentQuestionIndex = this.questionCounter + 1; // Ensure this is set initially
  }

  // nextQuestion() {
  //   var subQuestionIndex = -1;
  //   if (this.nextQuestionId != 0) {
  //     // const position = this.combindQuestionOption.findIndex(
  //     //   element => element.mapQuestionId == this.nextQuestionId
  //     // );

  //     // var totalSubQuestions = 0;
  //     this.subQuestionCounter += 1;

  //     if (this.currentQuestionData && this.currentQuestionData.options) {
  //       // totalSubQuestions = this.currentQuestionData.options.length;

  //       const index = this.currentQuestionData.options.findIndex(
  //         (option: any) => option.mapQuestionId === this.nextQuestionId
  //       );
  //       subQuestionIndex = index;
  //     }
  //     // else {
  //     //   subQuestionCounter = -1; // Return -1 if currentQuestionData or options is not defined
  //     // }

  //     if (subQuestionIndex != -1) {
  //       // this.combindQuestionOption.map((data: any) => {
  //       //   if (data.mapQuestionId == this.nextQuestionId) {
  //       //     this.getNextMappedQuestion();
  //       //     //this.currentQuestionData = data;
  //       //     this.nextQuestionId = 0;
  //       //   }
  //       // });

  //       this.getNextMappedQuestion();
  //       this.nextQuestionId = 0;
  //     }
  //   } else {
  //     this.questionCounter++;
  //     if (this.questionCounter < this.questionLenth) {
  //       this.currentQuestionData = this.combindQuestionOption[this.questionCounter];
  //     }
  //   }

  //   this.currentQuestionIndex = this.questionCounter + 1;

  //   if (this.questionCounter >= this.questionLenth - 1 && this.subQuestionCounter == 0) {
  //     this.finishQuestionniary = true;
  //   }
  // }


  nextQuestion() {
    // existing logic for handling the question flow
    if (this.nextQuestionId != 0) {
      this.subQuestionCounter++;
      const subQuestionIndex = this.currentQuestionData?.options?.findIndex(
        (option: any) => option.mapQuestionId === this.nextQuestionId
      ) ?? -1;

      if (subQuestionIndex != -1) {
        this.getNextMappedQuestion();
        this.nextQuestionId = 0;
      }
    } else {
      this.questionCounter++;
      if (this.questionCounter < this.questionLenth) {
        this.currentQuestionData = this.combindQuestionOption[this.questionCounter];
        this.subQuestionCounter = this.currentQuestionData.options?.length ? 1 : -1;
      }
    }

    this.currentQuestionIndex = this.questionCounter + 1;
    const currentTotalCount = this.questionCounter + this.subQuestionCounter;
    if (currentTotalCount >= this.totalQuestions) {
      this.finishQuestionniary = true;
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
  //     console.log(res);

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
    console.log('Selected Option ID:', this.selectedOption);
  }

  populateQuestionId(questionId: number): void {
    this.selectedQuestionIdToMap = questionId;
  }
}


