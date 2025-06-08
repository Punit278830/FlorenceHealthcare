using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Data;
using hospitalApiProject.Infrastructure.Repository.Interfaces;
using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository
{
    public class DbContextFactory : IDbContextFactory
    {
        private readonly DbContextOptions<FlorenceDbContext> _options;

        public DbContextFactory(DbContextOptions<FlorenceDbContext> options)
        {
            _options = options;
        }

        public DbContext CreateDbContext(DbContextName dbContextName)
        {
            return dbContextName switch
            {
                DbContextName.FlorenceDbContext => new FlorenceDbContext(_options),
                _ => throw new ArgumentException($"Invalid DbContext name: {dbContextName}")
            };
        }
    }
} 