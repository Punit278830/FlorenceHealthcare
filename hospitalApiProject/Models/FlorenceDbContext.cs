using System;
using System.Collections.Generic;
using hospitalApiProject.Models.Abha;
using hospitalApiProject.Models.Response;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Models;

public partial class FlorenceDbContext : DbContext
{
  public FlorenceDbContext()
  {
  }

  public FlorenceDbContext(DbContextOptions<FlorenceDbContext> options)
      : base(options)
  {
  }

  public virtual DbSet<Answer> Answers { get; set; }

  public virtual DbSet<AppointmentInfo> AppointmentInfos { get; set; }

  public virtual DbSet<InvoiceInfo> InvoiceInfos { get; set; }

  public virtual DbSet<AdditionalInvoiceItem> AdditionalInvoiceItems { get; set; }

  public virtual DbSet<InvoiceItemMaster> InvoiceItemMasters { get; set; }

  public virtual DbSet<ConsultationDatum> ConsultationData { get; set; }

  public virtual DbSet<ConsultationFile> ConsultationFiles { get; set; }

  public virtual DbSet<DepartmentInfo> DepartmentInfos { get; set; }

  public virtual DbSet<DiagnosisTemplateMaster> DiagnosisTemplateMasters { get; set; }

  public virtual DbSet<FilesUpload> FilesUploads { get; set; }

  public virtual DbSet<MedicineMaster> MedicineMasters { get; set; }

  public virtual DbSet<MedicinesGroup> MedicinesGroups { get; set; }

  public virtual DbSet<MedicationGroup> MedicationGroups { get; set; }

  public virtual DbSet<Option> Options { get; set; }

  public virtual DbSet<PatientInfo> PatientInfos { get; set; }

  public virtual DbSet<PatientMedication> PatientMedications { get; set; }

  public virtual DbSet<Question> Questions { get; set; }

  public virtual DbSet<Questionnaire> Questionnaires { get; set; }

  public virtual DbSet<StaffInfo> StaffInfos { get; set; }

  public virtual DbSet<StaffSchedule> StaffSchedules { get; set; }

  public virtual DbSet<VitalInfo> VitalInfos { get; set; }
  public virtual DbSet<AbhaPatientDetails> AbhaPatientDetails { get; set; }

  public virtual DbSet<PaymentModeInfo> PaymentModeInfo { get; set; }

  public virtual DbSet<PrescriptionTemplateMaster> PrescriptionTemplateMaster { get; set; }
  public virtual DbSet<PatientVisit> PatientVisits { get; set; }

  public virtual DbSet<CareContext> CareContexts { get; set; }

  public virtual DbSet<Hospital> Hospitals { get; set; }

  public virtual DbSet<RoleMaster> RoleMasters { get; set; }

  public virtual DbSet<AppointmentFile> AppointmentFiles { get; set; }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
  //=> optionsBuilder.UseSqlServer("Server=LAPTOP-PVS2FCEU\\SQLEXPRESS;Database=florenceDb;Integrated Security=True;TrustServerCertificate=True;");
  => optionsBuilder.UseSqlServer("Server=162.222.225.88;Database=florenceDb;User Id=mohit2024;Password=Spice@1234;TrustServerCertificate=True;");
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<PatientVisit>()
            .HasMany(pv => pv.CareContexts)
            .WithOne(cc => cc.PatientVisit)
            .HasForeignKey(cc => cc.PatientVisitId);

    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<AdditionalInvoiceItem>(entity =>
    {
      entity.HasKey(e => e.Id);

      entity.ToTable("AdditionalInvoiceItems");

      entity.Property(e => e.Id).HasColumnName("id");
      entity.Property(e => e.InvoiceId).HasColumnName("invoiceId");

      entity.Property(e => e.ItemName).HasColumnName("ItemName");
      entity.Property(e => e.Description).HasColumnName("Description");
      entity.Property(e => e.Discount).HasColumnName("Discount");
      entity.Property(e => e.Fee).HasColumnName("Fee");
      entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
      entity.Property(e => e.FinalAmount).HasColumnName("FinalAmount");
      entity.Property(e => e.Status).HasColumnName("status");

    });

    modelBuilder.Entity<InvoiceItemMaster>(entity =>
    {
      entity.HasKey(e => e.ItemId).HasName("PK__appointm__3213E83F8234A53E");

      entity.ToTable("InvoiceItemMaster");

      entity.Property(e => e.ItemId).HasColumnName("itemId");

      entity.Property(e => e.ItemName).HasColumnName("itemName");
      entity.Property(e => e.Description).HasColumnName("description");
      entity.Property(e => e.Discount).HasColumnName("discount");
      entity.Property(e => e.Fee).HasColumnName("fee");

    });

    modelBuilder.Entity<InvoiceInfo>(entity =>
    {
      entity.HasKey(e => e.InvoiceId);

      entity.ToTable("InvoiceInfo");

      entity.Property(e => e.InvoiceId).HasColumnName("invoiceId");

      entity.Property(e => e.PatientId).HasColumnName("patientId");
      entity.Property(e => e.AppointmentId).HasColumnName("appoitmentId");
      entity.Property(e => e.CreatedDate).HasColumnName("createdDate");
      entity.Property(e => e.Amount).HasColumnName("amount");
      entity.Property(e => e.Status).HasColumnName("status");

    });

    modelBuilder.Entity<PaymentModeInfo>(entity =>
    {
      entity.HasKey(e => e.PaymentId);  // Define primary key
      entity.Property(e => e.PaymentMode).HasMaxLength(100);  // Define column properties
      entity.Property(e => e.ItemName).HasColumnName("itemName");  // Map to camelCase database column
      entity.Property(e => e.ItemId).HasColumnName("itemId");      // Map to camelCase database column
      entity.Property(e => e.TransactionId).HasMaxLength(100);
      entity.Property(e => e.PaymentDate).HasDefaultValueSql("GETDATE()");  // Default value for PaymentDate
      entity.Property(e => e.Amount);
    });

    modelBuilder.Entity<Answer>(entity =>
    {
      entity.HasKey(e => e.AnswerId).HasName("PK__Answers__D48250246664615B");

      entity.Property(e => e.AnswerId).HasColumnName("AnswerID");
      entity.Property(e => e.AnswerText)
          .HasMaxLength(255)
          .IsUnicode(false);
      entity.Property(e => e.AppointmentId).HasColumnName("appointmentId");
      entity.Property(e => e.ParticipantId).HasColumnName("ParticipantID");
      entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
      entity.Property(e => e.SelectedOptionId).HasColumnName("SelectedOptionID");

      entity.HasOne(d => d.Question).WithMany(p => p.Answers)
          .HasForeignKey(d => d.QuestionId)
          .HasConstraintName("FK__Answers__Questio__5BAD9CC8");

      entity.HasOne(d => d.SelectedOption).WithMany(p => p.Answers)
          .HasForeignKey(d => d.SelectedOptionId)
          .HasConstraintName("FK__Answers__Selecte__5CA1C101");
    });

    modelBuilder.Entity<AppointmentInfo>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__appointm__3213E83F8234A53E");

      entity.ToTable("appointmentInfo");

      entity.Property(e => e.Id).HasColumnName("id");
      entity.Property(e => e.AppointmentStatus)
          .HasMaxLength(20)
          .IsUnicode(false)
          .HasColumnName("appointmentStatus");
      entity.Property(e => e.Date)
          .HasColumnType("datetime")
          .HasColumnName("date");
      entity.Property(e => e.Departmentid).HasColumnName("departmentid");
      entity.Property(e => e.AppointTime).HasColumnName("AppointmentTime");
      entity.Property(e => e.DoctorId).HasColumnName("doctorId");
      entity.Property(e => e.Fee).HasColumnName("fee");

      entity.Property(e => e.Notes)
          .HasMaxLength(500)
          .IsUnicode(false)
          .HasColumnName("notes");
      entity.Property(e => e.PatientId).HasColumnName("patientId");
        entity.Property(e => e.ScheduledByid).HasColumnName("scheduledByid");
        entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
        entity.Property(e => e.DeletedDate).HasColumnName("deletedDate");
        entity.Property(e => e.DeletedBy).HasColumnName("deletedBy");
        entity.Property(e => e.HospitalId).HasColumnName("hospitalId");
        entity.Property(e => e.PrescriptionEndDate)
              .HasColumnName("PrescriptionEndDate")
              .HasColumnType("datetime2");
    });

    modelBuilder.Entity<ConsultationDatum>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__consulta__3213E83FF94E34E0");

      entity.ToTable("consultationData");

      entity.Property(e => e.Id).HasColumnName("id");
      entity.Property(e => e.Advice)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("advice");
      entity.Property(e => e.AppointmentId).HasColumnName("appointmentId");
      entity.Property(e => e.DiffDiagnosis)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("diffDiagnosis");
      entity.Property(e => e.ExaminationNote)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("examinationNote");
      entity.Property(e => e.FinalDiagnosis)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("finalDiagnosis");
      entity.Property(e => e.FollowupDate).HasColumnName("followupDate");
    });

    modelBuilder.Entity<PrescriptionTemplateMaster>(entity =>
    {
      entity.ToTable("PrescriptionTemplateMaster");

      entity.Property(e => e.Id).HasColumnName("id");
      entity.Property(e => e.TemplateName).HasColumnName("templateName");
      entity.Property(e => e.Advice)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("advice");
      entity.Property(e => e.DiffDiagnosis)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("diffDiagnosis");
      entity.Property(e => e.ExaminationNote)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("examinationNote");
      entity.Property(e => e.FinalDiagnosis)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("finalDiagnosis");
      entity.Property(e => e.DiagnosisId).HasColumnName("diagnosisId");
    });

    modelBuilder.Entity<ConsultationFile>(entity =>
    {
      entity.HasKey(e => e.FileId).HasName("PK__consulta__C2C6FFDC666D5E0B");

      entity.ToTable("consultationFiles");

      entity.Property(e => e.FileId).HasColumnName("fileId");
      entity.Property(e => e.docName).HasColumnName("docName");
      entity.Property(e => e.AppointmentId).HasColumnName("appointmentId");
      entity.Property(e => e.FileData)
          .IsUnicode(false)
          .HasColumnName("fileData");
      entity.Property(e => e.FileName)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("fileName");
      entity.Property(e => e.FileType)
          .HasMaxLength(50)
          .IsUnicode(false)
          .HasColumnName("fileType");
    });

    modelBuilder.Entity<DepartmentInfo>(entity =>
    {
      entity.HasKey(e => e.DepartmentId).HasName("PK__departme__3213E83F62AE26B1");

      entity.ToTable("departmentInfo");

      entity.Property(e => e.DepartmentName)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("departmentName");
      entity.Property(e => e.DisplayName)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("displayName");
      entity.Property(e => e.DepartmentStatus)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("departmentStatus");
    });

    modelBuilder.Entity<DiagnosisTemplateMaster>(entity =>
    {
      entity.HasKey(e => e.DiagnosId).HasName("PK__diagnosi__330F5D69B0F1B8E9");

      entity.ToTable("diagnosisTemplateMaster");

      entity.Property(e => e.DiagnosId).HasColumnName("diagnosId");
      entity.Property(e => e.DiagnosName)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("diagnosName");
      entity.Property(e => e.DiagnosStatus).HasColumnName("diagnosStatus");
      entity.Property(e => e.DiagnosText)
          .HasMaxLength(255)
          .IsUnicode(false)
          .HasColumnName("diagnosText");
    });

    modelBuilder.Entity<FilesUpload>(entity =>
    {
      entity.HasKey(e => e.FileId).HasName("PK__Files__6F0F989FE714CBA2");

      entity.ToTable("FilesUpload");

      entity.Property(e => e.FileId).HasColumnName("FileID");
      entity.Property(e => e.AppointmentId).HasColumnName("appointmentID");
      entity.Property(e => e.FileData).IsUnicode(false);
      entity.Property(e => e.FileName)
          .HasMaxLength(255)
          .IsUnicode(false);
      entity.Property(e => e.FileType)
          .HasMaxLength(50)
          .IsUnicode(false);
      entity.Property(e => e.UploadDate).HasDefaultValueSql("(getdate())");
    });

    modelBuilder.Entity<MedicineMaster>(entity =>
    {
      entity.HasKey(e => e.MedId).HasName("PK__Medicine__EB77FC56BA45806B");

      entity.ToTable("MedicineMaster");

      entity.Property(e => e.GenericName)
          .HasMaxLength(255)
          .IsUnicode(false);
      entity.Property(e => e.ManufactureName)
          .HasMaxLength(255)
          .IsUnicode(false);
      entity.Property(e => e.MedName)
          .HasMaxLength(255)
          .IsUnicode(false);
      entity.Property(e => e.MedType)
          .HasMaxLength(50)
          .IsUnicode(false);
      entity.Property(e => e.Unit)
          .HasMaxLength(10)
          .IsUnicode(false);
    });

    modelBuilder.Entity<Option>(entity =>
    {
      entity.HasKey(e => e.OptionId).HasName("PK__Options__92C7A1DF3FC9B492");

      entity.Property(e => e.OptionId).HasColumnName("OptionID");
      entity.Property(e => e.MapQuestionId).HasColumnName("mapQuestionId");
      entity.Property(e => e.OptionText)
          .HasMaxLength(100)
          .IsUnicode(false);
      entity.Property(e => e.QuestionId).HasColumnName("QuestionID");

      entity.HasOne(d => d.Question).WithMany(p => p.Options)
          .HasForeignKey(d => d.QuestionId)
          .HasConstraintName("FK__Options__Questio__58D1301D");
    });

    modelBuilder.Entity<PatientInfo>(entity =>
    {
      entity.HasKey(e => e.PatientId).HasName("PK__patientI__3213E83FF314494B");

      entity.ToTable("patientInfo");

      entity.Property(e => e.Address)
          .HasMaxLength(200)
          .IsUnicode(false)
          .HasColumnName("address");
      entity.Property(e => e.Dob).HasColumnName("dob");
      entity.Property(e => e.Email)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("email");
      entity.Property(e => e.FirstName)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("firstName");
      entity.Property(e => e.Gender)
          .HasMaxLength(15)
          .IsUnicode(false)
          .HasColumnName("gender");
      entity.Property(e => e.LastName)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("lastName");
      entity.Property(e => e.Mobile)
          .HasMaxLength(10)
          .IsUnicode(false)
          .HasColumnName("mobile");
      entity.Property(e => e.PatientImage)
          .IsUnicode(false)
          .HasColumnName("patientImage");
      entity.Property(e => e.RegstrationDate).HasColumnName("regstrationDate");
      entity.Property(e => e.IdentityName)
          .HasMaxLength(100)
          .IsUnicode(false);
      entity.Property(e => e.IdentityNumber)
          .HasMaxLength(100)
          .IsUnicode(false);
    });

    modelBuilder.Entity<PatientMedication>(entity =>
    {
      entity.HasKey(e => e.MedicationId).HasName("PK__PatientM__62EC1AFA5A3CD8AB");

      entity.Property(e => e.Dose)
          .HasMaxLength(20)
          .IsUnicode(false);
      entity.Property(e => e.Duration)
          .HasMaxLength(30)
          .IsUnicode(false);
      entity.Property(e => e.Frequency)
          .HasMaxLength(50)
          .IsUnicode(false);
      entity.Property(e => e.Instruction)
          .HasMaxLength(200)
          .IsUnicode(false);
      entity.Property(e => e.MedName)
          .HasMaxLength(100)
          .IsUnicode(false);
      entity.Property(e => e.MedType)
          .HasMaxLength(20)
          .IsUnicode(false);
      entity.Property(e => e.Timing)
          .HasMaxLength(30)
          .IsUnicode(false);
    });

    modelBuilder.Entity<Question>(entity =>
    {
      entity.HasKey(e => e.QuestionId).HasName("PK__Question__0DC06F8CAFDD6C54");

      entity.ToTable("Question");

      entity.Property(e => e.QuestionId).HasColumnName("QuestionID");
      entity.Property(e => e.QuestionText)
          .HasMaxLength(255)
          .IsUnicode(false);
      entity.Property(e => e.QuestionnaireId).HasColumnName("QuestionnaireID");
    });

    modelBuilder.Entity<Questionnaire>(entity =>
    {
      entity.HasKey(e => e.QuestionnaireId).HasName("PK__Question__A56EF40518DEEF97");

      entity.ToTable("Questionnaire");

      entity.Property(e => e.QuestionnaireId).HasColumnName("QuestionnaireID");
      entity.Property(e => e.QuestinaryDeptId).HasColumnName("QuestinaryDeptID");
      entity.Property(e => e.QuestionnaireName)
          .HasMaxLength(100)
          .IsUnicode(false);
      entity.Property(e => e.IsActive).HasColumnName("isActive");

    });

    modelBuilder.Entity<MedicinesGroup>(entity =>
    {
      entity.ToTable("MedicinesGroup");

      entity.Property(e => e.Id).HasColumnName("Id");
      entity.Property(e => e.Name).HasColumnName("Name");
      entity.Property(e => e.Description)
          .HasMaxLength(100)
          .IsUnicode(false);

    });

    modelBuilder.Entity<MedicationGroup>(entity =>
    {
      entity.ToTable("MedicationGroup");

      entity.Property(e => e.Id).HasColumnName("Id");
      entity.Property(e => e.GroupId).HasColumnName("GroupId");
      entity.Property(e => e.Dose)
          .HasMaxLength(20)
          .IsUnicode(false);
      entity.Property(e => e.Duration)
          .HasMaxLength(30)
          .IsUnicode(false);
      entity.Property(e => e.Frequency)
          .HasMaxLength(50)
          .IsUnicode(false);
      entity.Property(e => e.Instruction)
          .HasMaxLength(200)
          .IsUnicode(false);
      entity.Property(e => e.MedName)
          .HasMaxLength(100)
          .IsUnicode(false);
      entity.Property(e => e.MedType)
          .HasMaxLength(20)
          .IsUnicode(false);
      entity.Property(e => e.Timing)
          .HasMaxLength(30)
          .IsUnicode(false);

    });

    modelBuilder.Entity<StaffInfo>(entity =>
    {
      entity.HasKey(e => e.StaffId).HasName("PK__staffInf__DDDFDD369429D882");

      entity.ToTable("staffInfo");

      entity.HasIndex(e => e.Email, "UQ_StaffInfo_Email").IsUnique();

      entity.Property(e => e.StaffId).HasColumnName("staffId");
      entity.Property(e => e.ActiveStatus).HasColumnName("activeStatus");
      entity.Property(e => e.Address)
          .HasMaxLength(200)
          .IsUnicode(false)
          .HasColumnName("address");
      entity.Property(e => e.ConsultationFee).HasColumnName("consultationFee");
      entity.Property(e => e.DepartmentId).HasColumnName("departmentId");
      entity.Property(e => e.Designation)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("designation");
      entity.Property(e => e.Doj).HasColumnName("DOJ");
      entity.Property(e => e.Education)
          .HasMaxLength(200)
          .IsUnicode(false)
          .HasColumnName("education");
      entity.Property(e => e.Email)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("email");
      entity.Property(e => e.FirstName)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("firstName");
      entity.Property(e => e.Gender)
          .HasMaxLength(15)
          .IsUnicode(false)
          .HasColumnName("gender");
      entity.Property(e => e.LastName)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("lastName");
      entity.Property(e => e.Mobile)
          .HasMaxLength(10)
          .IsUnicode(false)
          .HasColumnName("mobile");
      entity.Property(e => e.Password)
          .HasMaxLength(20)
          .IsUnicode(false)
          .HasColumnName("password");
      entity.Property(e => e.RegestrationNumber)
          .HasMaxLength(100)
          .IsUnicode(false)
          .HasColumnName("regestrationNumber");
      entity.Property(e => e.IdentityName)
          .HasMaxLength(100)
          .IsUnicode(false);
      entity.Property(e => e.IdentityNumber)
          .HasMaxLength(100)
          .IsUnicode(false);
      entity.Property(e => e.RoleId)
          .HasColumnName("RoleId");

      // Configure relationship with RoleMaster
      entity.HasOne(s => s.Role)
          .WithMany()
          .HasForeignKey(s => s.RoleId)
          .HasConstraintName("FK_StaffInfo_RoleMaster")
          .OnDelete(DeleteBehavior.SetNull);
    });

    modelBuilder.Entity<StaffSchedule>(entity =>
    {
      entity.HasKey(e => e.ScheduleId).HasName("PK__staffSch__A532EDD49C3FEBF7");

      entity.ToTable("staffSchedule");

      entity.Property(e => e.ScheduleId).HasColumnName("scheduleId");
      entity.Property(e => e.DepartmentId).HasColumnName("departmentId");
      entity.Property(e => e.FromPostfix)
          .HasMaxLength(10)
          .IsUnicode(false)
          .HasColumnName("fromPostfix");
      entity.Property(e => e.FromTime)
          .HasMaxLength(20)
          .IsUnicode(false)
          .HasColumnName("fromTime");
      entity.Property(e => e.LeaveStatus).HasColumnName("leaveStatus");
      entity.Property(e => e.Status).HasColumnName("status");
      entity.Property(e => e.Notes).HasColumnName("notes");
      entity.Property(e => e.ScheduleDate).HasColumnName("scheduleDate");
      entity.Property(e => e.StaffId).HasColumnName("staffId");
      entity.Property(e => e.ToPostfix)
          .HasMaxLength(10)
          .IsUnicode(false)
          .HasColumnName("toPostfix");
      entity.Property(e => e.ToTime)
          .HasMaxLength(20)
          .IsUnicode(false)
          .HasColumnName("toTime");
    });

    modelBuilder.Entity<VitalInfo>(entity =>
    {
      entity.HasKey(e => e.VitalId).HasName("PK__VitalInf__9EF955AEC367167B");

      entity.ToTable("VitalInfo");

      entity.Property(e => e.VitalId).HasColumnName("vitalId");
      entity.Property(e => e.Bp)
          .HasMaxLength(50)
          .IsUnicode(false)
          .HasColumnName("BP");
      entity.Property(e => e.Height)
          .HasMaxLength(50)
          .IsUnicode(false);
      entity.Property(e => e.OxigenLevel)
          .HasMaxLength(50)
          .IsUnicode(false);
      entity.Property(e => e.Pulse)
          .HasMaxLength(50)
          .IsUnicode(false);
      entity.Property(e => e.Tempurature)
          .HasMaxLength(50)
          .IsUnicode(false)
          .HasColumnName("tempurature");
      entity.Property(e => e.Weight)
          .HasMaxLength(50)
          .IsUnicode(false);
      entity.Property(e => e.Diabetes).HasColumnName("Diabetes");
      entity.Property(e => e.Thyroid).HasColumnName("Thyroid");
      entity.Property(e => e.Hypertension).HasColumnName("Hypertension");
      entity.Property(e => e.Alcohol).HasColumnName("Alcohol");
      entity.Property(e => e.Smoking).HasColumnName("Smoking");
      entity.Property(e => e.Tobacco).HasColumnName("Tobacco");
    });

    modelBuilder.Entity<Hospital>(entity =>
    {
      entity.ToTable("Hospital");
      entity.HasKey(e => e.HospitalId);
      entity.Property(e => e.HospitalId).HasColumnName("HospitalId");
      entity.Property(e => e.Name).HasMaxLength(200).HasColumnName("Name");
      entity.Property(e => e.Code).HasMaxLength(50).HasColumnName("Code");
      entity.Property(e => e.ContactPerson).HasMaxLength(200).HasColumnName("ContactPerson");
      entity.Property(e => e.ContactNumber).HasMaxLength(20).HasColumnName("ContactNumber");
      entity.Property(e => e.Email).HasMaxLength(200).HasColumnName("Email");
      entity.Property(e => e.AddressLine1).HasMaxLength(400).HasColumnName("AddressLine1");
      entity.Property(e => e.AddressLine2).HasMaxLength(400).HasColumnName("AddressLine2");
      entity.Property(e => e.City).HasMaxLength(100).HasColumnName("City");
      entity.Property(e => e.State).HasMaxLength(100).HasColumnName("State");
      entity.Property(e => e.Pincode).HasMaxLength(20).HasColumnName("Pincode");
      entity.Property(e => e.Country).HasMaxLength(100).HasColumnName("Country");
      entity.Property(e => e.RegistrationNumber).HasMaxLength(100).HasColumnName("RegistrationNumber");
      entity.Property(e => e.GSTIN).HasMaxLength(30).HasColumnName("GSTIN");
      entity.Property(e => e.WebsiteUrl).HasMaxLength(400).HasColumnName("WebsiteUrl");
      entity.Property(e => e.LogoUrl).HasMaxLength(400).HasColumnName("LogoUrl");
      entity.Property(e => e.IsActive).HasColumnName("IsActive");
      entity.Property(e => e.IsDeleted).HasColumnName("IsDeleted");
      entity.Property(e => e.CreatedOn).HasColumnName("CreatedOn");
      entity.Property(e => e.ModifiedOn).HasColumnName("ModifiedOn");
      entity.Property(e => e.ModifiedBy).HasMaxLength(100).HasColumnName("ModifiedBy");
    });

    OnModelCreatingPartial(modelBuilder);
  }

  partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
