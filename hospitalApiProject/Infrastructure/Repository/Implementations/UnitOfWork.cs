using System;
using System.Threading.Tasks;
using hospitalApiProject.Infrastructure.Repository.Interfaces;
using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FlorenceDbContext _context;
        private bool _disposed;

        public UnitOfWork(FlorenceDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<Patient> PatientRepository => new GenericRepository<Patient>(_context);
        public IGenericRepository<Invoice> InvoiceRepository => new GenericRepository<Invoice>(_context);
        public IGenericRepository<PaymentInfo> PaymentInfoRepository => new GenericRepository<PaymentInfo>(_context);
        public IGenericRepository<PaymentModeInfo> PaymentModeInfoRepository => new GenericRepository<PaymentModeInfo>(_context);
        public IGenericRepository<Prescription> PrescriptionRepository => new GenericRepository<Prescription>(_context);
        public IGenericRepository<PrescriptionDetail> PrescriptionDetailRepository => new GenericRepository<PrescriptionDetail>(_context);
        public IGenericRepository<PrescriptionTemplateMaster> PrescriptionTemplateMasterRepository => new GenericRepository<PrescriptionTemplateMaster>(_context);
        public IGenericRepository<PrescriptionTemplateDetail> PrescriptionTemplateDetailRepository => new GenericRepository<PrescriptionTemplateDetail>(_context);
        public IGenericRepository<Diagnosis> DiagnosisRepository => new GenericRepository<Diagnosis>(_context);
        public IGenericRepository<DiagnosisTemplateMaster> DiagnosisTemplateMasterRepository => new GenericRepository<DiagnosisTemplateMaster>(_context);
        public IGenericRepository<FilesUpload> FilesUploadRepository => new GenericRepository<FilesUpload>(_context);
        public IGenericRepository<MedicineMaster> MedicineMasterRepository => new GenericRepository<MedicineMaster>(_context);
        public IGenericRepository<MedicinesGroup> MedicinesGroupRepository => new GenericRepository<MedicinesGroup>(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
} 