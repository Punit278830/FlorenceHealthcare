CREATE TABLE [AbhaPatientDetails] (
    [Id] int NOT NULL IDENTITY,
    [PatientId] int NOT NULL,
    [AbhaNumber] nvarchar(max) NOT NULL,
    [AbhaAddress] nvarchar(max) NOT NULL,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NULL,
    [Mobile] nvarchar(max) NULL,
    [Email] nvarchar(max) NULL,
    [Address] nvarchar(max) NULL,
    [Gender] nvarchar(max) NULL,
    [Dob] date NOT NULL,
    [PatientImage] nvarchar(max) NULL,
    [RegistrationDate] date NULL,
    [Status] nvarchar(max) NULL,
    [LinkingToken] nvarchar(max) NULL,
    [TokenDate] date NULL,
    CONSTRAINT [PK_AbhaPatientDetails] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [AdditionalInvoiceItems] (
    [id] int NOT NULL IDENTITY,
    [invoiceId] int NOT NULL,
    [ItemName] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Discount] int NOT NULL,
    [Fee] decimal(18,2) NOT NULL,
    [CreatedBy] int NOT NULL,
    [FinalAmount] int NOT NULL,
    [status] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_AdditionalInvoiceItems] PRIMARY KEY ([id])
);
GO


CREATE TABLE [appointmentInfo] (
    [id] int NOT NULL IDENTITY,
    [patientId] int NOT NULL,
    [doctorId] int NOT NULL,
    [departmentid] int NULL,
    [scheduledByid] int NULL,
    [date] datetime NOT NULL,
    [notes] varchar(500) NULL,
    [AppointmentTime] nvarchar(max) NULL,
    [appointmentStatus] varchar(20) NULL,
    [fee] int NOT NULL,
    CONSTRAINT [PK__appointm__3213E83F8234A53E] PRIMARY KEY ([id])
);
GO


CREATE TABLE [consultationData] (
    [id] int NOT NULL IDENTITY,
    [appointmentId] int NOT NULL,
    [examinationNote] varchar(255) NULL,
    [advice] varchar(255) NULL,
    [diffDiagnosis] varchar(255) NULL,
    [finalDiagnosis] varchar(255) NULL,
    [followupDate] datetime2 NULL,
    CONSTRAINT [PK__consulta__3213E83FF94E34E0] PRIMARY KEY ([id])
);
GO


CREATE TABLE [consultationFiles] (
    [fileId] int NOT NULL IDENTITY,
    [appointmentId] int NULL,
    [fileName] varchar(100) NULL,
    [fileType] varchar(50) NULL,
    [fileData] varchar(max) NULL,
    [docName] nvarchar(max) NULL,
    CONSTRAINT [PK__consulta__C2C6FFDC666D5E0B] PRIMARY KEY ([fileId])
);
GO


CREATE TABLE [departmentInfo] (
    [DepartmentId] int NOT NULL IDENTITY,
    [departmentName] varchar(100) NOT NULL,
    [departmentStatus] varchar(100) NULL,
    CONSTRAINT [PK__departme__3213E83F62AE26B1] PRIMARY KEY ([DepartmentId])
);
GO


CREATE TABLE [diagnosisTemplateMaster] (
    [diagnosId] int NOT NULL IDENTITY,
    [diagnosName] varchar(100) NOT NULL,
    [diagnosText] varchar(255) NOT NULL,
    [diagnosStatus] int NOT NULL,
    CONSTRAINT [PK__diagnosi__330F5D69B0F1B8E9] PRIMARY KEY ([diagnosId])
);
GO


CREATE TABLE [FilesUpload] (
    [FileID] int NOT NULL IDENTITY,
    [appointmentID] int NOT NULL,
    [FileName] varchar(255) NOT NULL,
    [FileType] varchar(50) NOT NULL,
    [FileData] varchar(max) NOT NULL,
    [UploadDate] datetime2 NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__Files__6F0F989FE714CBA2] PRIMARY KEY ([FileID])
);
GO


CREATE TABLE [InvoiceInfo] (
    [invoiceId] int NOT NULL IDENTITY,
    [patientId] int NOT NULL,
    [appoitmentId] int NOT NULL,
    [createdDate] datetime2 NULL,
    [amount] int NULL,
    [status] nvarchar(max) NULL,
    [IsConsultationPaid] bit NULL,
    CONSTRAINT [PK_InvoiceInfo] PRIMARY KEY ([invoiceId])
);
GO


CREATE TABLE [InvoiceItemMaster] (
    [itemId] int NOT NULL IDENTITY,
    [itemName] nvarchar(max) NULL,
    [description] nvarchar(max) NULL,
    [discount] int NULL,
    [fee] decimal(18,2) NULL,
    CONSTRAINT [PK__appointm__3213E83F8234A53E] PRIMARY KEY ([itemId])
);
GO


CREATE TABLE [MedicationGroup] (
    [Id] int NOT NULL IDENTITY,
    [GroupId] int NOT NULL,
    [MedName] varchar(100) NULL,
    [MedType] varchar(20) NULL,
    [Dose] varchar(20) NULL,
    [Frequency] varchar(50) NULL,
    [Timing] varchar(30) NULL,
    [Duration] varchar(30) NULL,
    [Instruction] varchar(200) NULL,
    CONSTRAINT [PK_MedicationGroup] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [MedicineMaster] (
    [MedId] int NOT NULL IDENTITY,
    [MedName] varchar(255) NOT NULL,
    [GenericName] varchar(255) NOT NULL,
    [ManufactureName] varchar(255) NOT NULL,
    [MedType] varchar(50) NOT NULL,
    [Unit] varchar(10) NULL,
    CONSTRAINT [PK__Medicine__EB77FC56BA45806B] PRIMARY KEY ([MedId])
);
GO


CREATE TABLE [MedicinesGroup] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Description] varchar(100) NOT NULL,
    CONSTRAINT [PK_MedicinesGroup] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [patientInfo] (
    [PatientId] int NOT NULL IDENTITY,
    [firstName] varchar(100) NOT NULL,
    [lastName] varchar(100) NULL,
    [mobile] varchar(10) NULL,
    [email] varchar(100) NULL,
    [address] varchar(200) NULL,
    [gender] varchar(15) NULL,
    [dob] datetime2 NOT NULL,
    [patientImage] varchar(max) NULL,
    [regstrationDate] datetime2 NULL,
    [IdentityName] varchar(100) NULL,
    [IdentityNumber] varchar(100) NULL,
    CONSTRAINT [PK__patientI__3213E83FF314494B] PRIMARY KEY ([PatientId])
);
GO


CREATE TABLE [PatientMedications] (
    [MedicationId] int NOT NULL IDENTITY,
    [AppointmentId] int NOT NULL,
    [MedName] varchar(100) NULL,
    [MedType] varchar(20) NULL,
    [Dose] varchar(20) NULL,
    [Frequency] varchar(50) NULL,
    [Timing] varchar(30) NULL,
    [Duration] varchar(30) NULL,
    [Instruction] varchar(200) NULL,
    CONSTRAINT [PK__PatientM__62EC1AFA5A3CD8AB] PRIMARY KEY ([MedicationId])
);
GO


CREATE TABLE [PatientVisits] (
    [Id] int NOT NULL IDENTITY,
    [PatientId] int NOT NULL,
    [ReferenceNumber] nvarchar(max) NOT NULL,
    [Display] nvarchar(max) NOT NULL,
    [HiType] nvarchar(max) NOT NULL,
    [VisitDate] datetime2 NOT NULL,
    CONSTRAINT [PK_PatientVisits] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [PaymentModeInfo] (
    [PaymentId] int NOT NULL IDENTITY,
    [InvoiceId] int NOT NULL,
    [PaymentMode] nvarchar(100) NOT NULL,
    [itemName] nvarchar(max) NOT NULL,
    [itemId] nvarchar(max) NULL,
    [TransactionId] nvarchar(100) NULL,
    [PaymentDate] datetime2 NULL DEFAULT (GETDATE()),
    [Amount] int NULL,
    CONSTRAINT [PK_PaymentModeInfo] PRIMARY KEY ([PaymentId])
);
GO


CREATE TABLE [PrescriptionTemplateMaster] (
    [id] int NOT NULL IDENTITY,
    [templateName] nvarchar(max) NOT NULL,
    [examinationNote] varchar(255) NULL,
    [advice] varchar(255) NULL,
    [diffDiagnosis] varchar(255) NULL,
    [finalDiagnosis] varchar(255) NULL,
    [diagnosisId] int NULL,
    CONSTRAINT [PK_PrescriptionTemplateMaster] PRIMARY KEY ([id])
);
GO


CREATE TABLE [Question] (
    [QuestionID] int NOT NULL IDENTITY,
    [QuestionText] varchar(255) NOT NULL,
    [QuestionType] int NOT NULL,
    [QuestionnaireID] int NOT NULL,
    CONSTRAINT [PK__Question__0DC06F8CAFDD6C54] PRIMARY KEY ([QuestionID])
);
GO


CREATE TABLE [Questionnaire] (
    [QuestionnaireID] int NOT NULL IDENTITY,
    [QuestionnaireName] varchar(100) NOT NULL,
    [QuestinaryDeptID] int NOT NULL,
    [isActive] bit NOT NULL,
    CONSTRAINT [PK__Question__A56EF40518DEEF97] PRIMARY KEY ([QuestionnaireID])
);
GO


CREATE TABLE [staffInfo] (
    [staffId] int NOT NULL IDENTITY,
    [firstName] varchar(100) NOT NULL,
    [lastName] varchar(100) NULL,
    [IdentityName] varchar(100) NULL,
    [IdentityNumber] varchar(100) NULL,
    [mobile] varchar(10) NOT NULL,
    [email] varchar(100) NOT NULL,
    [address] varchar(200) NULL,
    [departmentId] int NOT NULL,
    [designation] varchar(100) NOT NULL,
    [consultationFee] int NULL,
    [activeStatus] int NOT NULL,
    [password] varchar(20) NOT NULL,
    [Dob] datetime2 NOT NULL,
    [gender] varchar(15) NOT NULL,
    [education] varchar(200) NOT NULL,
    [DOJ] datetime2 NOT NULL,
    [regestrationNumber] varchar(100) NULL,
    CONSTRAINT [PK__staffInf__DDDFDD369429D882] PRIMARY KEY ([staffId])
);
GO


CREATE TABLE [staffSchedule] (
    [scheduleId] int NOT NULL IDENTITY,
    [staffId] int NOT NULL,
    [departmentId] int NOT NULL,
    [scheduleDate] datetime2 NOT NULL,
    [fromTime] varchar(20) NULL,
    [fromPostfix] varchar(10) NULL,
    [toTime] varchar(20) NULL,
    [toPostfix] varchar(10) NULL,
    [ApplyScheduleDate] datetime2 NULL,
    [leaveStatus] int NOT NULL,
    [status] nvarchar(max) NULL,
    [notes] nvarchar(max) NULL,
    CONSTRAINT [PK__staffSch__A532EDD49C3FEBF7] PRIMARY KEY ([scheduleId])
);
GO


CREATE TABLE [VitalInfo] (
    [vitalId] int NOT NULL IDENTITY,
    [AppointmentId] int NOT NULL,
    [BP] varchar(50) NULL,
    [Weight] varchar(50) NULL,
    [Height] varchar(50) NULL,
    [Pulse] varchar(50) NULL,
    [tempurature] varchar(50) NULL,
    [OxigenLevel] varchar(50) NULL,
    [Diabetes] bit NULL,
    [Thyroid] bit NULL,
    [Hypertension] bit NULL,
    [Alcohol] bit NULL,
    [Smoking] bit NULL,
    [Tobacco] bit NULL,
    CONSTRAINT [PK__VitalInf__9EF955AEC367167B] PRIMARY KEY ([vitalId])
);
GO


CREATE TABLE [CareContexts] (
    [Id] int NOT NULL IDENTITY,
    [PatientVisitId] int NOT NULL,
    [ReferenceNumber] nvarchar(max) NOT NULL,
    [Display] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_CareContexts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CareContexts_PatientVisits_PatientVisitId] FOREIGN KEY ([PatientVisitId]) REFERENCES [PatientVisits] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [Options] (
    [OptionID] int NOT NULL IDENTITY,
    [QuestionID] int NULL,
    [OptionText] varchar(100) NOT NULL,
    [mapQuestionId] int NOT NULL,
    CONSTRAINT [PK__Options__92C7A1DF3FC9B492] PRIMARY KEY ([OptionID]),
    CONSTRAINT [FK__Options__Questio__58D1301D] FOREIGN KEY ([QuestionID]) REFERENCES [Question] ([QuestionID])
);
GO


CREATE TABLE [Answers] (
    [AnswerID] int NOT NULL IDENTITY,
    [QuestionID] int NULL,
    [ParticipantID] int NULL,
    [AnswerText] varchar(255) NULL,
    [SelectedOptionID] int NULL,
    [appointmentId] int NOT NULL,
    CONSTRAINT [PK__Answers__D48250246664615B] PRIMARY KEY ([AnswerID]),
    CONSTRAINT [FK__Answers__Questio__5BAD9CC8] FOREIGN KEY ([QuestionID]) REFERENCES [Question] ([QuestionID]),
    CONSTRAINT [FK__Answers__Selecte__5CA1C101] FOREIGN KEY ([SelectedOptionID]) REFERENCES [Options] ([OptionID])
);
GO


CREATE INDEX [IX_Answers_QuestionID] ON [Answers] ([QuestionID]);
GO


CREATE INDEX [IX_Answers_SelectedOptionID] ON [Answers] ([SelectedOptionID]);
GO


CREATE INDEX [IX_CareContexts_PatientVisitId] ON [CareContexts] ([PatientVisitId]);
GO


CREATE INDEX [IX_Options_QuestionID] ON [Options] ([QuestionID]);
GO


CREATE UNIQUE INDEX [UQ_StaffInfo_Email] ON [staffInfo] ([email]);
GO


