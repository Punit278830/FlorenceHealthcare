-- Manual SQL script to add nullable HospitalId to relevant tables for multi-tenant support
-- NOTE: Run in a maintenance window. All columns are nullable and backward compatible.

BEGIN TRY
  BEGIN TRANSACTION;

  -- appointmentInfo
  IF COL_LENGTH('appointmentInfo', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE appointmentInfo ADD HospitalId INT NULL;
    CREATE INDEX IX_appointmentInfo_HospitalId ON appointmentInfo(HospitalId);
  END

  -- InvoiceInfo
  IF COL_LENGTH('InvoiceInfo', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE InvoiceInfo ADD HospitalId INT NULL;
    CREATE INDEX IX_InvoiceInfo_HospitalId ON InvoiceInfo(HospitalId);
  END

  -- patientInfo
  IF COL_LENGTH('patientInfo', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE patientInfo ADD HospitalId INT NULL;
    CREATE INDEX IX_patientInfo_HospitalId ON patientInfo(HospitalId);
  END

  -- staffInfo
  IF COL_LENGTH('staffInfo', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE staffInfo ADD HospitalId INT NULL;
    CREATE INDEX IX_staffInfo_HospitalId ON staffInfo(HospitalId);
  END

  -- staffSchedule
  IF COL_LENGTH('staffSchedule', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE staffSchedule ADD HospitalId INT NULL;
    CREATE INDEX IX_staffSchedule_HospitalId ON staffSchedule(HospitalId);
  END

  -- departmentInfo (optional if departments are hospital-specific)
  IF COL_LENGTH('departmentInfo', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE departmentInfo ADD HospitalId INT NULL;
    CREATE INDEX IX_departmentInfo_HospitalId ON departmentInfo(HospitalId);
  END

  -- AdditionalInvoiceItems (tie via InvoiceId's hospital where possible; column optional)
  IF COL_LENGTH('AdditionalInvoiceItems', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE AdditionalInvoiceItems ADD HospitalId INT NULL;
    CREATE INDEX IX_AdditionalInvoiceItems_HospitalId ON AdditionalInvoiceItems(HospitalId);
  END

  -- PaymentModeInfo (for reports)
  IF COL_LENGTH('PaymentModeInfo', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE PaymentModeInfo ADD HospitalId INT NULL;
    CREATE INDEX IX_PaymentModeInfo_HospitalId ON PaymentModeInfo(HospitalId);
  END

  -- consultationData
  IF COL_LENGTH('consultationData', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE consultationData ADD HospitalId INT NULL;
    CREATE INDEX IX_consultationData_HospitalId ON consultationData(HospitalId);
  END

  -- consultationFiles
  IF COL_LENGTH('consultationFiles', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE consultationFiles ADD HospitalId INT NULL;
    CREATE INDEX IX_consultationFiles_HospitalId ON consultationFiles(HospitalId);
  END

  -- FilesUpload
  IF COL_LENGTH('FilesUpload', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE FilesUpload ADD HospitalId INT NULL;
    CREATE INDEX IX_FilesUpload_HospitalId ON FilesUpload(HospitalId);
  END

  -- PatientMedications
  IF COL_LENGTH('PatientMedications', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE PatientMedications ADD HospitalId INT NULL;
    CREATE INDEX IX_PatientMedications_HospitalId ON PatientMedications(HospitalId);
  END

  -- VitalInfo
  IF COL_LENGTH('VitalInfo', 'HospitalId') IS NULL
  BEGIN
    ALTER TABLE VitalInfo ADD HospitalId INT NULL;
    CREATE INDEX IX_VitalInfo_HospitalId ON VitalInfo(HospitalId);
  END

  -- Questionnaire, Question, Options, Answers (if hospital-specific)
  IF COL_LENGTH('Questionnaire', 'HospitalId') IS NULL BEGIN ALTER TABLE Questionnaire ADD HospitalId INT NULL; END
  IF COL_LENGTH('Question', 'HospitalId') IS NULL BEGIN ALTER TABLE Question ADD HospitalId INT NULL; END
  IF COL_LENGTH('Options', 'HospitalId') IS NULL BEGIN ALTER TABLE Options ADD HospitalId INT NULL; END
  IF COL_LENGTH('Answers', 'HospitalId') IS NULL BEGIN ALTER TABLE Answers ADD HospitalId INT NULL; END

  -- Lookup masters (optional): InvoiceItemMaster, MedicineMaster, DiagnosisTemplateMaster
  IF COL_LENGTH('InvoiceItemMaster', 'HospitalId') IS NULL BEGIN ALTER TABLE InvoiceItemMaster ADD HospitalId INT NULL; END
  IF COL_LENGTH('MedicineMaster', 'HospitalId') IS NULL BEGIN ALTER TABLE MedicineMaster ADD HospitalId INT NULL; END
  IF COL_LENGTH('diagnosisTemplateMaster', 'HospitalId') IS NULL BEGIN ALTER TABLE diagnosisTemplateMaster ADD HospitalId INT NULL; END

  -- New: MedicinesGroup, MedicationGroup, PrescriptionTemplateMaster
  IF COL_LENGTH('MedicinesGroup', 'HospitalId') IS NULL BEGIN ALTER TABLE MedicinesGroup ADD HospitalId INT NULL; END
  IF COL_LENGTH('MedicationGroup', 'HospitalId') IS NULL BEGIN ALTER TABLE MedicationGroup ADD HospitalId INT NULL; END
  IF COL_LENGTH('PrescriptionTemplateMaster', 'HospitalId') IS NULL BEGIN ALTER TABLE PrescriptionTemplateMaster ADD HospitalId INT NULL; END

  COMMIT TRANSACTION;
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
  THROW;
END CATCH;
