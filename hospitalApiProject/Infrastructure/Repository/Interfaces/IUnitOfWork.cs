using System;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Patient> PatientRepository { get; }
        IGenericRepository<Invoice> InvoiceRepository { get; }
        IGenericRepository<PaymentInfo> PaymentInfoRepository { get; }
        IGenericRepository<PaymentModeInfo> PaymentModeInfoRepository { get; }
        IGenericRepository<Prescription> PrescriptionRepository { get; }
        IGenericRepository<PrescriptionDetail> PrescriptionDetailRepository { get; }
        IGenericRepository<PrescriptionTemplateMaster> PrescriptionTemplateMasterRepository { get; }
        IGenericRepository<PrescriptionTemplateDetail> PrescriptionTemplateDetailRepository { get; }
        IGenericRepository<Diagnosis> DiagnosisRepository { get; }
        IGenericRepository<DiagnosisTemplateMaster> DiagnosisTemplateMasterRepository { get; }
        IGenericRepository<FilesUpload> FilesUploadRepository { get; }
        IGenericRepository<MedicineMaster> MedicineMasterRepository { get; }
        IGenericRepository<MedicinesGroup> MedicinesGroupRepository { get; }

        Task<int> SaveChangesAsync();

        Task<int?> ExecuteStoreProcedure<I>(string query, SqlParameter[] sqlParameters);
        IGenericRepository<T> GetRepository<T>(DbContextName dbContextName) where T : class;
        void SaveChanges();
    }
} 