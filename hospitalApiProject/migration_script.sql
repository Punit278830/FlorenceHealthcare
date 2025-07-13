IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [AbhaPatientDetails] (
    [Id] int NOT NULL IDENTITY,
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
    CONSTRAINT [PK_AbhaPatientDetails] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AdditionalInvoiceItems] (
    [id] int NOT NULL IDENTITY,
    [invoiceId] int NULL,
    [ItemName] nvarchar(max) NULL,
    [Description] nvarchar(max) NULL,
    [Discount] int NULL,
    [Fee] decimal(18,2) NULL,
    [CreatedBy] int NULL,
    [FinalAmount] int NULL,
    [status] nvarchar(max) NULL,
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
    [followupDate] date NULL,
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
    [createdDate] date NULL,
    [amount] int NULL,
    [status] nvarchar(max) NULL,
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

CREATE TABLE [patientInfo] (
    [PatientId] int NOT NULL IDENTITY,
    [firstName] varchar(100) NOT NULL,
    [lastName] varchar(100) NULL,
    [mobile] varchar(10) NULL,
    [email] varchar(100) NULL,
    [address] varchar(200) NULL,
    [gender] varchar(15) NULL,
    [dob] date NOT NULL,
    [patientImage] varchar(max) NULL,
    [regstrationDate] date NULL,
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

CREATE TABLE [PaymentModeInfo] (
    [PaymentId] int NOT NULL IDENTITY,
    [invoiceId] int NOT NULL,
    [paymentMode] nvarchar(max) NULL,
    [transactionId] nvarchar(max) NULL,
    [paymentDate] datetime2 NOT NULL,
    CONSTRAINT [PK_PaymentModeInfo] PRIMARY KEY ([PaymentId])
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
    [Dob] date NOT NULL,
    [gender] varchar(15) NOT NULL,
    [education] varchar(100) NOT NULL,
    [DOJ] date NOT NULL,
    CONSTRAINT [PK__staffInf__DDDFDD369429D882] PRIMARY KEY ([staffId])
);
GO

CREATE TABLE [staffSchedule] (
    [scheduleId] int NOT NULL IDENTITY,
    [staffId] int NOT NULL,
    [departmentId] int NOT NULL,
    [scheduleDate] date NOT NULL,
    [fromTime] varchar(20) NULL,
    [fromPostfix] varchar(10) NULL,
    [toTime] varchar(20) NULL,
    [toPostfix] varchar(10) NULL,
    [ApplyScheduleDate] date NULL,
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
    CONSTRAINT [PK__VitalInf__9EF955AEC367167B] PRIMARY KEY ([vitalId])
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

CREATE INDEX [IX_Options_QuestionID] ON [Options] ([QuestionID]);
GO

CREATE UNIQUE INDEX [UQ_StaffInfo_Email] ON [staffInfo] ([email]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240928094954_AddPaymentModeInfoTable', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

EXEC sp_rename N'[PaymentModeInfo].[transactionId]', N'TransactionId', N'COLUMN';
GO

EXEC sp_rename N'[PaymentModeInfo].[paymentMode]', N'PaymentMode', N'COLUMN';
GO

EXEC sp_rename N'[PaymentModeInfo].[paymentDate]', N'PaymentDate', N'COLUMN';
GO

EXEC sp_rename N'[PaymentModeInfo].[invoiceId]', N'InvoiceId', N'COLUMN';
GO

ALTER TABLE [VitalInfo] ADD [Alcohol] bit NULL;
GO

ALTER TABLE [VitalInfo] ADD [Diabetes] bit NULL;
GO

ALTER TABLE [VitalInfo] ADD [Hypertension] bit NULL;
GO

ALTER TABLE [VitalInfo] ADD [Smoking] bit NULL;
GO

ALTER TABLE [VitalInfo] ADD [Thyroid] bit NULL;
GO

ALTER TABLE [VitalInfo] ADD [Tobacco] bit NULL;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[staffSchedule]') AND [c].[name] = N'scheduleDate');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [staffSchedule] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [staffSchedule] ALTER COLUMN [scheduleDate] datetime2 NOT NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[staffSchedule]') AND [c].[name] = N'ApplyScheduleDate');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [staffSchedule] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [staffSchedule] ALTER COLUMN [ApplyScheduleDate] datetime2 NULL;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[staffInfo]') AND [c].[name] = N'education');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [staffInfo] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [staffInfo] ALTER COLUMN [education] varchar(200) NOT NULL;
GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[staffInfo]') AND [c].[name] = N'Dob');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [staffInfo] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [staffInfo] ALTER COLUMN [Dob] datetime2 NOT NULL;
GO

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[staffInfo]') AND [c].[name] = N'DOJ');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [staffInfo] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [staffInfo] ALTER COLUMN [DOJ] datetime2 NOT NULL;
GO

ALTER TABLE [staffInfo] ADD [regestrationNumber] varchar(100) NULL;
GO

DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PaymentModeInfo]') AND [c].[name] = N'TransactionId');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [PaymentModeInfo] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [PaymentModeInfo] ALTER COLUMN [TransactionId] nvarchar(100) NULL;
GO

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PaymentModeInfo]') AND [c].[name] = N'PaymentMode');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [PaymentModeInfo] DROP CONSTRAINT [' + @var6 + '];');
UPDATE [PaymentModeInfo] SET [PaymentMode] = N'' WHERE [PaymentMode] IS NULL;
ALTER TABLE [PaymentModeInfo] ALTER COLUMN [PaymentMode] nvarchar(100) NOT NULL;
ALTER TABLE [PaymentModeInfo] ADD DEFAULT N'' FOR [PaymentMode];
GO

DECLARE @var7 sysname;
SELECT @var7 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PaymentModeInfo]') AND [c].[name] = N'PaymentDate');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [PaymentModeInfo] DROP CONSTRAINT [' + @var7 + '];');
ALTER TABLE [PaymentModeInfo] ALTER COLUMN [PaymentDate] datetime2 NULL;
ALTER TABLE [PaymentModeInfo] ADD DEFAULT (GETDATE()) FOR [PaymentDate];
GO

ALTER TABLE [PaymentModeInfo] ADD [Amount] int NULL;
GO

ALTER TABLE [PaymentModeInfo] ADD [itemId] nvarchar(max) NULL;
GO

ALTER TABLE [PaymentModeInfo] ADD [itemName] nvarchar(max) NOT NULL DEFAULT N'';
GO

DECLARE @var8 sysname;
SELECT @var8 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[patientInfo]') AND [c].[name] = N'regstrationDate');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [patientInfo] DROP CONSTRAINT [' + @var8 + '];');
ALTER TABLE [patientInfo] ALTER COLUMN [regstrationDate] datetime2 NULL;
GO

DECLARE @var9 sysname;
SELECT @var9 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[patientInfo]') AND [c].[name] = N'dob');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [patientInfo] DROP CONSTRAINT [' + @var9 + '];');
ALTER TABLE [patientInfo] ALTER COLUMN [dob] datetime2 NOT NULL;
GO

DECLARE @var10 sysname;
SELECT @var10 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InvoiceInfo]') AND [c].[name] = N'createdDate');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [InvoiceInfo] DROP CONSTRAINT [' + @var10 + '];');
ALTER TABLE [InvoiceInfo] ALTER COLUMN [createdDate] datetime2 NULL;
GO

ALTER TABLE [InvoiceInfo] ADD [IsConsultationPaid] bit NULL;
GO

DECLARE @var11 sysname;
SELECT @var11 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[consultationData]') AND [c].[name] = N'followupDate');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [consultationData] DROP CONSTRAINT [' + @var11 + '];');
ALTER TABLE [consultationData] ALTER COLUMN [followupDate] datetime2 NULL;
GO

DECLARE @var12 sysname;
SELECT @var12 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AdditionalInvoiceItems]') AND [c].[name] = N'status');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [AdditionalInvoiceItems] DROP CONSTRAINT [' + @var12 + '];');
UPDATE [AdditionalInvoiceItems] SET [status] = N'' WHERE [status] IS NULL;
ALTER TABLE [AdditionalInvoiceItems] ALTER COLUMN [status] nvarchar(max) NOT NULL;
ALTER TABLE [AdditionalInvoiceItems] ADD DEFAULT N'' FOR [status];
GO

DECLARE @var13 sysname;
SELECT @var13 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AdditionalInvoiceItems]') AND [c].[name] = N'invoiceId');
IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [AdditionalInvoiceItems] DROP CONSTRAINT [' + @var13 + '];');
UPDATE [AdditionalInvoiceItems] SET [invoiceId] = 0 WHERE [invoiceId] IS NULL;
ALTER TABLE [AdditionalInvoiceItems] ALTER COLUMN [invoiceId] int NOT NULL;
ALTER TABLE [AdditionalInvoiceItems] ADD DEFAULT 0 FOR [invoiceId];
GO

DECLARE @var14 sysname;
SELECT @var14 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AdditionalInvoiceItems]') AND [c].[name] = N'ItemName');
IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [AdditionalInvoiceItems] DROP CONSTRAINT [' + @var14 + '];');
UPDATE [AdditionalInvoiceItems] SET [ItemName] = N'' WHERE [ItemName] IS NULL;
ALTER TABLE [AdditionalInvoiceItems] ALTER COLUMN [ItemName] nvarchar(max) NOT NULL;
ALTER TABLE [AdditionalInvoiceItems] ADD DEFAULT N'' FOR [ItemName];
GO

DECLARE @var15 sysname;
SELECT @var15 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AdditionalInvoiceItems]') AND [c].[name] = N'FinalAmount');
IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [AdditionalInvoiceItems] DROP CONSTRAINT [' + @var15 + '];');
UPDATE [AdditionalInvoiceItems] SET [FinalAmount] = 0 WHERE [FinalAmount] IS NULL;
ALTER TABLE [AdditionalInvoiceItems] ALTER COLUMN [FinalAmount] int NOT NULL;
ALTER TABLE [AdditionalInvoiceItems] ADD DEFAULT 0 FOR [FinalAmount];
GO

DECLARE @var16 sysname;
SELECT @var16 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AdditionalInvoiceItems]') AND [c].[name] = N'Fee');
IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [AdditionalInvoiceItems] DROP CONSTRAINT [' + @var16 + '];');
UPDATE [AdditionalInvoiceItems] SET [Fee] = 0.0 WHERE [Fee] IS NULL;
ALTER TABLE [AdditionalInvoiceItems] ALTER COLUMN [Fee] decimal(18,2) NOT NULL;
ALTER TABLE [AdditionalInvoiceItems] ADD DEFAULT 0.0 FOR [Fee];
GO

DECLARE @var17 sysname;
SELECT @var17 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AdditionalInvoiceItems]') AND [c].[name] = N'Discount');
IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [AdditionalInvoiceItems] DROP CONSTRAINT [' + @var17 + '];');
UPDATE [AdditionalInvoiceItems] SET [Discount] = 0 WHERE [Discount] IS NULL;
ALTER TABLE [AdditionalInvoiceItems] ALTER COLUMN [Discount] int NOT NULL;
ALTER TABLE [AdditionalInvoiceItems] ADD DEFAULT 0 FOR [Discount];
GO

DECLARE @var18 sysname;
SELECT @var18 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AdditionalInvoiceItems]') AND [c].[name] = N'Description');
IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [AdditionalInvoiceItems] DROP CONSTRAINT [' + @var18 + '];');
UPDATE [AdditionalInvoiceItems] SET [Description] = N'' WHERE [Description] IS NULL;
ALTER TABLE [AdditionalInvoiceItems] ALTER COLUMN [Description] nvarchar(max) NOT NULL;
ALTER TABLE [AdditionalInvoiceItems] ADD DEFAULT N'' FOR [Description];
GO

DECLARE @var19 sysname;
SELECT @var19 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AdditionalInvoiceItems]') AND [c].[name] = N'CreatedBy');
IF @var19 IS NOT NULL EXEC(N'ALTER TABLE [AdditionalInvoiceItems] DROP CONSTRAINT [' + @var19 + '];');
UPDATE [AdditionalInvoiceItems] SET [CreatedBy] = 0 WHERE [CreatedBy] IS NULL;
ALTER TABLE [AdditionalInvoiceItems] ALTER COLUMN [CreatedBy] int NOT NULL;
ALTER TABLE [AdditionalInvoiceItems] ADD DEFAULT 0 FOR [CreatedBy];
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

CREATE TABLE [MedicinesGroup] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Description] varchar(100) NOT NULL,
    CONSTRAINT [PK_MedicinesGroup] PRIMARY KEY ([Id])
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

CREATE TABLE [CareContexts] (
    [Id] int NOT NULL IDENTITY,
    [PatientVisitId] int NOT NULL,
    [ReferenceNumber] nvarchar(max) NOT NULL,
    [Display] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_CareContexts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CareContexts_PatientVisits_PatientVisitId] FOREIGN KEY ([PatientVisitId]) REFERENCES [PatientVisits] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_CareContexts_PatientVisitId] ON [CareContexts] ([PatientVisitId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250712030601_ManualDateOnlyToDateTimeMigration', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [InvoiceInfo] ADD [DeletedBy] int NULL;
GO

ALTER TABLE [InvoiceInfo] ADD [DeletedDate] datetime2 NULL;
GO

ALTER TABLE [InvoiceInfo] ADD [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [appointmentInfo] ADD [DeletedBy] int NULL;
GO

ALTER TABLE [appointmentInfo] ADD [DeletedDate] datetime2 NULL;
GO

ALTER TABLE [appointmentInfo] ADD [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

DECLARE @var20 sysname;
SELECT @var20 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AbhaPatientDetails]') AND [c].[name] = N'TokenDate');
IF @var20 IS NOT NULL EXEC(N'ALTER TABLE [AbhaPatientDetails] DROP CONSTRAINT [' + @var20 + '];');
ALTER TABLE [AbhaPatientDetails] ALTER COLUMN [TokenDate] date NULL;
GO

DECLARE @var21 sysname;
SELECT @var21 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AbhaPatientDetails]') AND [c].[name] = N'RegistrationDate');
IF @var21 IS NOT NULL EXEC(N'ALTER TABLE [AbhaPatientDetails] DROP CONSTRAINT [' + @var21 + '];');
ALTER TABLE [AbhaPatientDetails] ALTER COLUMN [RegistrationDate] date NULL;
GO

DECLARE @var22 sysname;
SELECT @var22 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AbhaPatientDetails]') AND [c].[name] = N'Dob');
IF @var22 IS NOT NULL EXEC(N'ALTER TABLE [AbhaPatientDetails] DROP CONSTRAINT [' + @var22 + '];');
ALTER TABLE [AbhaPatientDetails] ALTER COLUMN [Dob] date NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250713012542_AddSoftDeleteToAppointmentAndInvoice', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var23 sysname;
SELECT @var23 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InvoiceInfo]') AND [c].[name] = N'DeletedBy');
IF @var23 IS NOT NULL EXEC(N'ALTER TABLE [InvoiceInfo] DROP CONSTRAINT [' + @var23 + '];');
ALTER TABLE [InvoiceInfo] DROP COLUMN [DeletedBy];
GO

DECLARE @var24 sysname;
SELECT @var24 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[appointmentInfo]') AND [c].[name] = N'DeletedBy');
IF @var24 IS NOT NULL EXEC(N'ALTER TABLE [appointmentInfo] DROP CONSTRAINT [' + @var24 + '];');
ALTER TABLE [appointmentInfo] DROP COLUMN [DeletedBy];
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250713013608_RemoveDeletedByColumns', N'8.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var25 sysname;
SELECT @var25 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InvoiceInfo]') AND [c].[name] = N'IsDeleted');
IF @var25 IS NOT NULL EXEC(N'ALTER TABLE [InvoiceInfo] DROP CONSTRAINT [' + @var25 + '];');
ALTER TABLE [InvoiceInfo] ALTER COLUMN [IsDeleted] bit NULL;
GO

ALTER TABLE [InvoiceInfo] ADD [DeletedBy] int NULL;
GO

DECLARE @var26 sysname;
SELECT @var26 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[appointmentInfo]') AND [c].[name] = N'IsDeleted');
IF @var26 IS NOT NULL EXEC(N'ALTER TABLE [appointmentInfo] DROP CONSTRAINT [' + @var26 + '];');
ALTER TABLE [appointmentInfo] ALTER COLUMN [IsDeleted] bit NULL;
GO

ALTER TABLE [appointmentInfo] ADD [DeletedBy] int NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250713014308_AddNullableSoftDeleteColumns', N'8.0.3');
GO

COMMIT;
GO

