namespace Hospital.Infrastructure
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly DbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(DbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<IEnumerable<T>> GetAsNoTracking(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AsNoTracking().Where(predicate).ToListAsync();
        }

        public IQueryable<T> GetQuery(Expression<Func<T, bool>> predicate = null, bool includeProperties = false, bool ignoreQueryFilters = false)
        {
            IQueryable<T> query = _dbSet;

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (includeProperties)
            {
                var navigationProperties = _context.Model.FindEntityType(typeof(T)).GetNavigations();
                foreach (var property in navigationProperties)
                {
                    query = query.Include(property.Name);
                }
            }

            if (ignoreQueryFilters)
            {
                query = query.IgnoreQueryFilters();
            }

            return query;
        }

        public async Task<PagingList<T>> Search(
            Expression<Func<T, bool>> predicate = null,
            int pageIndex = 0,
            int pageSize = 10,
            bool includeProperties = false,
            bool ignoreQueryFilters = false)
        {
            var query = GetQuery(predicate, includeProperties, ignoreQueryFilters);
            var totalCount = await query.CountAsync();
            var items = await query.Skip(pageIndex * pageSize).Take(pageSize).ToListAsync();

            return new PagingList<T>(items)
            {
                TotalCount = totalCount
            };
        }
    }
}
