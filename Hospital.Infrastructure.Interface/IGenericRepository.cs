namespace Hospital.Infrastructure.Interface
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<IEnumerable<T>> GetAsNoTracking(Expression<Func<T, bool>> predicate);

        IQueryable<T> GetQuery(Expression<Func<T, bool>> predicate = null, bool includeProperties = false, bool ignoreQueryFilters = false);

        Task<PagingList<T>> Search(
            Expression<Func<T, bool>> predicate = null,
            int pageIndex = 0,
            int pageSize = 10,
            bool includeProperties = false,
            bool ignoreQueryFilters = false);
    }
}
