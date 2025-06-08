using Infrastructure.Interfaces;

namespace Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        void SaveChanges();
        IGenericRepository<T> GetRepository<T>(string dbContextName) where T : class;
    }
} 