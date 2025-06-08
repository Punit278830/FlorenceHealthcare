using Microsoft.EntityFrameworkCore;
using Infrastructure.Interfaces;
using Infrastructure.Implementations;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDbContextFactory _dbContextFactory;
        private DbContext? _context;
        private readonly Dictionary<string, DbContext> _contexts = new();
        private IPatientRepository? _patientRepository;

        public UnitOfWork(IDbContextFactory dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }

        public IPatientRepository PatientRepository
        {
            get
            {
                if (_patientRepository == null)
                {
                    _context = _dbContextFactory.CreateDbContext("FlorenceDbContext");
                    if (_context != null)
                    {
                        _patientRepository = new PatientRepository(_context);
                    }
                }
                return _patientRepository!;
            }
        }

        public IGenericRepository<T> GetRepository<T>(string dbContextName) where T : class
        {
            if (_contexts.ContainsKey(dbContextName))
            {
                _context = _contexts[dbContextName];
            }
            else
            {
                _context = _dbContextFactory.CreateDbContext(dbContextName);
                if (_context != null)
                {
                    _contexts.Add(dbContextName, _context);
                }
            }
            return new GenericRepository<T>(_context!);
        }

        public void SaveChanges()
        {
            _context?.SaveChanges();
        }
    }
} 