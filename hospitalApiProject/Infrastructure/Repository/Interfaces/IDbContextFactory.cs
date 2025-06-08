using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository.Interfaces
{
    public interface IDbContextFactory
    {
        FlorenceDbContext CreateDbContext();
    }
} 