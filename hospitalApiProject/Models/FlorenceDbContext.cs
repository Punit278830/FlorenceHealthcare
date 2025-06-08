using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models.Abha;
using hospitalApiProject.Models.Response;

namespace hospitalApiProject.Models
{
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
        public DbSet<Diagnosis> Diagnoses { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<PaymentInfo> PaymentInfos { get; set; }
        public DbSet<PaymentModeInfo> PaymentModeInfos { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionDetail> PrescriptionDetails { get; set; }
        public DbSet<PrescriptionTemplateDetail> PrescriptionTemplateDetails { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=162.222.225.88;Database=florenceDb;User Id=mohit2024;Password=Spice@1234;TrustServerCertificate=True;");
            }
        }

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
                entity.HasKey(e => e.PaymentId);
                entity.Property(e => e.PaymentMode).HasMaxLength(100);
                entity.Property(e => e.TransactionId).HasMaxLength(100);
                entity.Property(e => e.PaymentDate).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Amount);
            });

            modelBuilder.Entity<PrescriptionTemplateMaster>(entity =>
            {
                entity.ToTable("PrescriptionTemplateMaster");
                entity.HasKey(e => e.PrescriptionTemplateId);
                entity.Property(e => e.PrescriptionTemplateId).HasColumnName("id");
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

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
