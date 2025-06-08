using System.Linq.Expressions;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> Get(Expression<Func<T, bool>>? filter = null,
          Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
          string includeProperties = "", bool ignoreQueryFilters = false);

        Task<T?> GetByID(object id);

        Task<T?> GetByID(Expression<Func<T, bool>>? filter, bool includeNavigation = false, bool ignoreQueryFilters = false);

        Task<T> Insert(T entity);

        Task<T> UpdateAsync(T entityToUpdate);

        void Update(T entityToUpdate);

        Task<List<T>> UpdateRange(List<T> entitiesToUpdate);

        Task<List<T>> AddRange(List<T> entitiesToUpdate);

        Task<IEnumerable<T>> GetAsNoTracking(Expression<Func<T, bool>> predicate);

        IQueryable<T?> GetQuery(Expression<Func<T, bool>>? filter = null, bool includeNavigation = false, bool ignoreQueryFilters = false);
    }
} 