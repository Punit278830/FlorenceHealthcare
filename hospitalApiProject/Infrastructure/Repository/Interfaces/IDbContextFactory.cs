using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository.Interfaces
{
    public interface IDbContextFactory
    {
        DbContext CreateDbContext(DbContextName dbContextName);
    }
} 