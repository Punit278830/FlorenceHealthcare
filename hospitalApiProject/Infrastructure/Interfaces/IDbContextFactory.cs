using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Interfaces
{
    public interface IDbContextFactory
    {
        DbContext? CreateDbContext(string contextType);
    }
} 