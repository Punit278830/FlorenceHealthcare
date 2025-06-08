using System.Linq;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Infrastructure.Repository.Interfaces;
using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDbContextFactory _dbContextFactory;
        private DbContext _context;
        private Dictionary<DbContextName, DbContext> keyValues = new Dictionary<DbContextName, DbContext>();

        public UnitOfWork(IDbContextFactory dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }

        public async Task<int?> ExecuteStoreProcedure<I>(string query, SqlParameter[] sqlParameters)
        {
            var response = await _context.Database.ExecuteSqlRawAsync(query, sqlParameters);
            var outParameter = sqlParameters.Where(x => x.Direction == System.Data.ParameterDirection.Output).FirstOrDefault();
            if (outParameter != null)
            {
                return Convert.ToInt32(outParameter.Value);
            }
            return null;
        }

        public IGenericRepository<T> GetRepository<T>(DbContextName dbContextName) where T : class
        {
            if (keyValues.ContainsKey(dbContextName))
            {
                _context = keyValues[dbContextName];
            }
            else
            {
                _context = _dbContextFactory.CreateDbContext(dbContextName);
                keyValues.Add(dbContextName, _context);
            }

            return new GenericRepository<T>(_context);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
} 