using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<List<T>> AddRange(List<T> entitiesToUpdate);
        Task<PagingList<T>> ExecuteStoredProcedure<I>(string procedureName, I input, string output);
        Task<IEnumerable<T>> Get(Expression<Func<T, bool>>? filter = null, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null, string includeProperties = "", bool ignoreQueryFilters = false);
        Task<IEnumerable<T>> GetAsNoTracking(Expression<Func<T, bool>> predicate);
        Task<T?> GetByID(object id);
        Task<T?> GetByID(Expression<Func<T, bool>> filter);
        Task<T?> GetByID(Expression<Func<T, bool>>? filter, bool includeNavigation = false, bool ignoreQueryFilters = false);
        Task<T> Insert(T entity);
        IQueryable<T?> GetQuery(Expression<Func<T, bool>>? filter = null, bool includeNavigation = false, bool ignoreQueryFilters = false);
        Task<PagingList<T>> Search(Expression<Func<T, bool>>? filter = null, int? pageSize = null, int pageNumber = 1, SortDirection sortDirection = SortDirection.Ascending, string sortField = "", bool IsInclude = false, bool ignoreQueryFilters = false);
        Task<PagingList<T>> Search(Expression<Func<T, bool>>? filter = null, int? pageSize = null, int pageNumber = 1, List<(string sortField, SortDirection sortDirection)>? sortFields = null, bool IsInclude = false, bool ignoreQueryFilters = false);
        void Update(T entityToUpdate);
        Task<T> UpdateAsync(T entityToUpdate);
        Task<List<T>> UpdateRange(List<T> entitiesToUpdate);
    }
} 