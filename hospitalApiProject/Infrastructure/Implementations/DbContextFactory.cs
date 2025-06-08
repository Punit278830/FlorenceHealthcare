using Microsoft.EntityFrameworkCore;
using Infrastructure.Interfaces;
using hospitalApiProject.Models;

namespace Infrastructure.Implementations
{
    public class DbContextFactory : IDbContextFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public DbContextFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public DbContext? CreateDbContext(string contextType)
        {
            switch (contextType)
            {
                case "FlorenceDbContext":
                    return _serviceProvider.GetService(typeof(FlorenceDbContext)) as FlorenceDbContext;
                default:
                    return null;
            }
        }
    }
} 