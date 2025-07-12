import { Time } from "@angular/common";
import { DateTime } from "luxon";

export interface pageSelection {
  skip: number;
  limit: number;
}
export interface apiResultFormat {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Array<any>;
  totalData: number;
}
export interface expenses {
  item: string;
  purchaseFrom: string;
  purchaseBy: string;
  paidBy: string;
  date: number;
  amount: string;
  status: string;
  img: string;
}
export interface staffholidays {
  title: string;
  holidayDate: number;
  day: string;
  description: string;
}
export interface staffleave {
  employeeName: string;
  leaveType: string;
  from: number;
  to: number;
  noOfDays: number | string;
  reason: string;
  status: string;
  img: string;
}
export interface invoices {
  invoiceNumber: string;
  patient: string;
  createdDate: number;
  dueDate: number;
  amount: number;
  status: string;
  img: string;
}
export interface invoicereport {
  invoiceNumber: string;
  client: string;
  createdDate: number;
  dueDate: number;
  amount: string;
  status: string;
  img: string;
}
export interface invoicescancelled {
  invoiceId: string;
  category: string;
  createdOn: string | number;
  invoiceTo: string;
  amount: string;
  cancelledOn: string | number;
  status: string | number;
  img: string;
}
export interface invoicedraft {
  createdOn: string | number;
  invoiceTo: string;
  amount: string;
  img: string;
}
export interface invoiceoverdue {
  invoiceId: string;
  category: string;
  createdOn: string | number;
  invoiceTo: string;
  amount: string | number;
  lastDate: string | number;
  status: string | number;
  img: string;
}
export interface invoicespaid {
  invoiceNumber: string | number;
  category: string;
  createdOn: string | number;
  invoiceTo: string;
  amount: string;
  paidOn: string | number;
  status: string;
  img: string;
}
export interface invoicerecurring {
  invoiceNumber: string;
  category: string;
  createdOn: string | number;
  invoiceTo: string;
  amount: string;
  lastInvoice: string | number;
  nextInvoice: string | number;
  frequency: string | number;
  status: string;
  img: string;
}
export interface doctorlist {
  name: string;
  department: string;
  specialization: string;
  degree: string;
  mobile: string;
  email: string;
  joiningDate: number;
  img: string;
}
export interface schedule {
  doctorName: string;
  department: string;
  availableDays: string;
  availableTime: string | number;
  status: string;
  img: string;
}
export interface providentFund {
  name: string;
  designation: string;
  providentFundType: string;
  employeeShare: string;
  organizationShare: string;
  status: string;
  img: string;
}
export interface taxes {
  taxName: string;
  taxPercentage: string;
  status: string;
  sno: number;
}
export interface appointmentList {
  name: string;
  consultingDoctor: string;
  treatment: string;
  degree: string;
  mobile: string;
  email: string;
  date: number;
  time: number;
  img: string;
}

export interface Ilogin {
  fname: string;
  lname: string;
  userRole: string;
  loginStatus: boolean;
  loginId: number;
  departmentId: number;
}

export interface IstaffInfo {
  staffId: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  departmentId: number;
  designation: string;
  consultationFee: number;
  activeStatus: number;
  password: string;
  dob: Date;
  doj: Date;
  gender: string;
  education: string;
  IdentityName: string;
  IdentityNumber: string;
  regestrationNumber?: string;
}

export interface IpatientInfo {
  patientId: number,
  firstName: string;
  lastName: string;
  dob: Date,
  mobile: string,
  email: string,
  address: string,
  gender: string;
  ageinYear?: number;
  patientImage?: string;
  regstrationDate?: Date;
  IdentityName: string;
  IdentityNumber: string;
  SubQues: any[]
  isConsultationPaid?: boolean;
}

export interface Iappointment {
  id: number,
  patientId: number,
  doctorId: number,
  departmentid: number,
  date: Date,
  scheduledByid: number,
  notes: string,
  appointmentStatus: string,
  fee: number;

  appointTime: string;

}

export interface Idepartment {
  departmentId: number,
  departmentName: string,
  departmentStatus: string;
}

export interface IfileUpload {
  FileID: number,
  fileName?: string,
  FileType?: string,
  fileData?: string,
  UploadDate: Date,
  AppointmentId: number,
  docName?: string,

}

export interface IconsultationFiles {
  fileId: number,
  fileName?: string,
  FileType?: string,
  fileData?: string,
  appointmentId?: number,
  docName?: string,
}

export interface IdownloadFile {
  fileName: string;
  downloadLink: string;
}



export interface Istaffschedule {
  scheduleId: number,
  staffId: number,
  departmentId: number,
  scheduleDate: Date,
  fromTime: string,
  fromPostfix: string,
  toTime: string,
  toPostfix: string,
  ApplyScheduleDate: Date,
  leaveStatus: number,
  notes: string,
  status: string,
}

export interface IQuestionnaires {
  questionnaireId: number,
  questionnaireName: string,
  questinaryDeptId: number;
  isActive: boolean;
}

export interface Iquestion {
  questionId: number,
  questionText: string,
  questionType: number,
  questionnaireId: number

}

export interface Ioptions {
  optionId?: number,
  questionId: number,
  optionText: string,
  mapQuestionId: number

}

export interface Ianswers {
  answerId?: number,
  questionId: number,
  participantId: number,
  answerText?: string,
  selectedOptionId?: number,
  appointmentId?: number
}

export interface Iconsultation {
  id: number,
  appointmentId: number,
  examinationNote: string,
  advice: number,
  diffDiagnosis: string,
  finalDiagnosis: string,
  followupDate: Date
}

export interface IConsultationTemplate {
  id: number,
  templateName: string,
  examinationNote?: string,
  advice?: string,
  diffDiagnosis?: string,
  finalDiagnosis?: string,
  diagnosisId?: number;
}

export interface IPredefineDiagnosis {
  diagnosId: number;
  diagnosName: string;
  diagnosText: string;
  diagnosStatus: number;
}

export interface IinvoiceItem {
  id: number,
  invoiceId: number,
  itemName: string,
  description: string,
  discount: number,
  fee: number,
  createdBy: number,
  finalAmount: number,
  status: string,
  itemId: number,
}

export interface Iinvoice {
  invoiceId: number,
  appointmentId: number,
  patientId: number,
  createdDate: Date,
  amount: number,
  totalUnpaidAmount: number,
  status: string,
  paymentModes: string,
  paymentId: number;
  paymentMode: string;
  itemId: number | null;
  paymentDetails: PaymentModeInfo[];
  paymentDate: string; // or Date if you parse it
  isConsultationPaid: boolean,
  transactionId: string
  itemName: string;
  previousAppointmentDate?: string | number; // Add this property for discount reason
  InvoiceDate?: Date | string; // Added InvoiceDate property
}

export interface IinvoiceTemp extends Iinvoice {
  tempItemName: string
}

export interface IInvoiceSummaryResponse {
  invoices: Iinvoice[],
  totalAmount: number,
  totalCashAmount: number,
  totalOnlineAmount: number
}

export interface ITotalPaymentDetails {
  totalAmount: number,
  totalCashAmount: number,
  totalOnlineAmount: number
}
interface PaymentDetail {
  paymentId: number;
  invoiceId: number;
  paymentMode: string;
  itemName: string | null;
  itemId: number | null;
  paymentDate: string;
  transactionId: string | null;
  amount: number;
  // add other properties if needed
}



export interface InvoiceInfoResponse {
  invoiceId: number;
  patientId: number;
  appointmentId: number;
  createdDate?: string;
  amount?: number;
  totalUnpaidAmount: number;
  status?: string;
  paymentModes: string;
  paymentDetails: PaymentModeInfo[];
}
export interface PaymentModeInfo {
  paymentId?: number;
  invoiceId: number;
  paymentMode: string;
  itemName: string;
  itemId?: string;
  transactionId?: string;
  paymentDate?: string;
  amount?: number;
}

export interface IPaymentMode {
  invoiceId: number,
  paymentMode: string,
  transactionId: string | null,
  amount: number,
  itemName: string,
  itemId: string
}

export interface IInvoicePaymentDto {
  invoiceInfo: Iinvoice;
  paymentModeInfo: IPaymentMode;
}

export interface ISubItemInvoicePaymentDto {
  additionalInvoiceItem: any;
  paymentModeInfo: IPaymentMode;
}

export interface ICreateInvoiceDto {
  additionalInvoiceItems: any[];
  paymentModeInfo: IPaymentMode;
}

export interface assetsList {
  assetId: string;
  assetUser: string;
  assetName: string;
  purchaseDate: number;
  warrenty: string | number;
  warrentyEnd: number;
  amount: string;
  status: string;
  img: string;
}
export interface salary {
  employeeId: string;
  employeeName: string;
  email: string;
  joiningDate: number;
  role: string;
  salary: string;
  status: string;
  img: string;
}

export interface ImedicineMaster {

  medId: number,
  medName: string,
  genericName: string,
  manufactureName: string,
  medType: string,
  unit: string
}

export interface IprescribeMedicine {
  medicationId: number,
  appointmentId: number,
  medName: string,
  unit: string,
  medType: string,
  dose: string,
  frequency: string,
  timing: string,
  duration: string,
  instruction: string
}

export interface IMedicinesGroup {
  id: number,
  name: string,
  description: string,
}

export interface IMedicationGroup {
  id: number,
  groupId: number,
  medName: string,
  medType: string,
  dose: string,
  frequency: string,
  timing: string,
  duration: string,
  instruction: string
}

export interface Ivital {
  vitalId: number,
  appointmentId: number,
  bp: string,
  weight: string,
  height: string,
  pulse: string,
  tempurature: string,
  oxigenLevel: string,
  diabetes: boolean,
  thyroid: boolean,
  hypertension: boolean,
  alcohol: boolean,
  smoking: boolean,
  tobacco: boolean

}


export interface exponsesreport {
  item: string;
  purchaseFrom: string;
  purchaseBy: string;
  paidBy: string;
  date: number;
  amount: string;
  status: string;
  img: string;
}
export interface patientDashboard {
  doctorName: string;
  diagnosis: string;
  date: number;
  img: string;
  status: string;
}
export interface allInvoice {
  invoiceId: string;
  category: string;
  createdOn: string | number;
  invoiceTo: string;
  amount: string;
  dueDate: string | number;
  status: string;
  img: string;
  age?: number;
  paymentDate?: string | number;
  previousAppointmentDate?: string | number; // Added for backend support
}
export interface staffList {
  name: string;
  department: string;
  specialization: string;
  degree: string;
  mobile: string;
  email: string;
  joiningDate: number;
  img: string;
}
export interface patientsList {
  name: string;
  department: string;
  specialization: string;
  degree: string;
  mobile: string;
  email: string;
  joiningDate: number;
  img: string;
}
export interface datatable {
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: number;
  salary: number;
}
export interface payments {
  invoiceNumber: string;
  patient: string;
  paymentType: string;
  paidDate: number;
  paidAmount: string;
  status: string;
  img: string;
}
export interface departmentList {
  department: string;
  departmentHead: string;
  description: string;
  date: number;
  status: string;
  img: string;
}
export interface datatables {
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: number;
  salary: string;
}
export interface blogs {
  img1: string;
  img2: string;
  heading5: string;
  count1: string;
  count2: string;
  date: number | string;
  heading4: string;
  name: string;
  heading3: string;
  paragraph: string;
  msg: string;
}
export interface recentPatients {
  no: string;
  patientName: string;
  age: number | string;
  date: string | number;
  dateOfBirth: string | number;
  diagnosis: string;
  img: string;
  triage: string;
}
export interface upcomingAppointments {
  no: string;
  patientName: string;
  doctor: string;
  date: string | number;
  time: string | number;
  disease: string;
  img: string;
}
export interface socialLinks {
  icon: string;
  placeholder: string;
}
export interface patientProfile {
  date: number | string;
  doctor: string;
  treatment: string;
  charges: string;
}
export interface invoicesGrid {
  invoiceNumber: string;
  name: string;
  img: string;
  amount: string;
  amounts: string | number;
  text: string;
  dueDate: string | number;
  status: string;
}
export interface SubMenu {
  menuValue: string;
  route: string;
  base: string;

}
export interface MenuItem {
  menuValue: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  base: string;
  route?: string;
  img?: string;
  icon?: string;
  faIcon?: boolean;
  subMenus: SubMenu[];

}

export interface SideBarData {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: MenuItem[];
}

export interface IAbhaDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dayOfBirth: string,
  monthOfBirth: string,
  yearOfBirth: string,
  gender: string,
  countryCode: string,
  mobile: string,
  email: string,
  address: string,
  pinCode: string,
  stateCode: string,
  districtCode: string,
  transactionId: string,
}


export interface IAbhaProfile {
  ABHANumber: string,
  abhaStatus: string,
  abhaType: string,
  firstName: string,
  middleName: string,
  lastName: string,
  dob: string,
  dayOfBirth: string,
  monthOfBirth: string,
  yearOfBirth: string,
  gender: string,
  countryCode: string,
  mobile: string,
  email: string,
  address: string,
  pinCode: string,
  stateCode: string,
  stateName: string,
  districtCode: string,
  districtName: string,
  transactionId: string,
  photo: string,
  phrAddress: string[]
}

export interface IAbhaPatientInfo {
  patientId: number,
  firstName: string;
  lastName: string;
  dob?: string,
  mobile: string,
  email: string,
  address: string,
  gender: string;
  ageinYear?: number;
  patientImage?: string;
  regstrationDate?: string;
}

export interface IAbhaPatientDetails extends IAbhaPatientInfo {
  abhaNumber: string,
  abhaAddress: string,
  status: string,
}

export interface SearchCriteriaBase {
  sortFieldName?: string;
  sortDirection?: number; // 0 = Ascending, 1 = Descending
  pageNumber?: number;
  pageSize?: number;
}

export interface SearchResponseBase<T> {
  errorMessage?: string;
  hasError?: boolean;
  results: T[];
  totalCount: number;
  totalPages: number;
}

export enum PaymentStatus {
  All = 0,
  Paid = 1,
  Unpaid = 2,
  PartialPaid = 3
}

export enum PaymentMode {
  All = 0,
  Cash = 1,
  Online = 2
}

export interface InvoiceSearch extends SearchCriteriaBase {
  fromDate?: string;
  toDate?: string;
  paymentStatus?: PaymentStatus;
  paymentMode?: PaymentMode;
}
