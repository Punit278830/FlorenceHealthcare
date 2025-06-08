using hospitalApiProject.Models;
using hospitalApiProject.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace hospitalApiProject.Infrastructure.Repository.Implementations
{
    public class DbContextFactory : IDbContextFactory
    {
        private readonly IConfiguration _configuration;

        public DbContextFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public FlorenceDbContext CreateDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<FlorenceDbContext>();
            optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));

            return new FlorenceDbContext(optionsBuilder.Options);
        }
    }
} 