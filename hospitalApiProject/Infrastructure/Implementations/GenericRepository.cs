using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Interfaces;

namespace Infrastructure.Implementations
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly DbContext context;
        internal DbSet<T> dbSet;

        public GenericRepository(DbContext dbContext)
        {
            this.context = dbContext;
            dbSet = context.Set<T>();
        }

        public async Task<List<T>> AddRange(List<T> entitiesToUpdate)
        {
            dbSet.AddRange(entitiesToUpdate);
            return await Task.FromResult(entitiesToUpdate);
        }

        public Task<IEnumerable<T>> Get(Expression<Func<T, bool>>? filter = null, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null, string includeProperties = "", bool ignoreQueryFilters = false)
        {
            IQueryable<T> query = ignoreQueryFilters ? dbSet.IgnoreQueryFilters() : dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }
            var results = query.ToList();
            return Task.FromResult<IEnumerable<T>>(results);
        }

        public async Task<IEnumerable<T>> GetAsNoTracking(Expression<Func<T, bool>> predicate)
        {
            return await Task.FromResult(context.Set<T>().AsNoTracking().Where(predicate));
        }

        public async Task<T?> GetByID(object id)
        {
            var item = await dbSet.FindAsync(id);
            return item;
        }

        public async Task<T?> GetByID(Expression<Func<T, bool>> filter)
        {
            var item = await dbSet.FirstOrDefaultAsync(filter);
            return item;
        }

        public async virtual Task<T?> GetByID(Expression<Func<T, bool>>? filter, bool includeNavigation = false, bool ignoreQueryFilters = false)
        {
            IQueryable<T> query = ignoreQueryFilters ? dbSet.IgnoreQueryFilters() : dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (includeNavigation)
            {
                var navigationProp = context.Model.FindEntityType(typeof(T))?.GetNavigations();
                if (navigationProp != null)
                {
                    foreach (var navigation in navigationProp)
                    {
                        query = query.Include(navigation.Name);
                    }
                }
            }
            var item = await query.FirstOrDefaultAsync();
            return item;
        }

        public async Task<T> Insert(T entity)
        {
            await dbSet.AddAsync(entity);
            return entity;
        }

        public IQueryable<T?> GetQuery(Expression<Func<T, bool>>? filter = null, bool includeNavigation = false, bool ignoreQueryFilters = false)
        {
            IQueryable<T> query = ignoreQueryFilters ? dbSet.IgnoreQueryFilters() : dbSet;
            if (includeNavigation)
            {
                var navigationProp = context?.Model?.FindEntityType(typeof(T))?.GetNavigations();
                if (navigationProp != null)
                {
                    foreach (var item in navigationProp)
                    {
                        query = query.Include(item.Name);
                    }
                }
            }
            if (filter != null)
            {
                query = query.Where(filter);
            }
            return query;
        }

        public virtual void Update(T entityToUpdate)
        {
            dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public async Task<T> UpdateAsync(T entityToUpdate)
        {
            await Task.Run(() =>
            {
                dbSet.Attach(entityToUpdate);
                context.Entry(entityToUpdate).State = EntityState.Modified;
            });
            return entityToUpdate;
        }

        public async Task<List<T>> UpdateRange(List<T> entitiesToUpdate)
        {
            dbSet.UpdateRange(entitiesToUpdate);
            return await Task.FromResult(entitiesToUpdate);
        }
    }
} 