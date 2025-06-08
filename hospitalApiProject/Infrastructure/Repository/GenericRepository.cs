using System.Data;
using System.Linq.Expressions;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using hospitalApiProject.Data;
using hospitalApiProject.Infrastructure.Repository.Interfaces;
using hospitalApiProject.Models;

namespace hospitalApiProject.Infrastructure.Repository
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

        public async Task<PagingList<T>> ExecuteStoredProcedure<I>(string procedureName, I input, string output)
        {
            var toReturn = new PagingList<T>();
            var parameters = Parameters.Transform(input, output);

            var sqlParameters = new List<SqlParameter>();

            foreach (var parameter in parameters.Where(x => x.Direction != ParameterDirection.Output))
            {
                sqlParameters.Add(new SqlParameter(parameter.ParameterName, parameter.Value));
            }

            SqlParameter? outputParam = null;
            if (!string.IsNullOrEmpty(output))
            {
                outputParam = new SqlParameter
                {
                    ParameterName = "@" + output,
                    Direction = ParameterDirection.Output,
                    SqlDbType = SqlDbType.Int
                };
                sqlParameters.Add(outputParam);
            }

            var rawSqlString = string.Format("EXEC {0}", procedureName);
            var query = await dbSet.FromSqlRaw($"{rawSqlString} {string.Join(", ", sqlParameters.Select(p => p.ParameterName))}", sqlParameters.ToArray()).ToListAsync<T>();
            toReturn.AddRange(query);

            if (outputParam != null)
            {
                toReturn.TotalCount = (int)outputParam.Value;
            }

            return toReturn;
        }

        public Task<IEnumerable<T>> Get(Expression<Func<T, bool>>? filter = null, Func<IQueryable<T>,
                                        IOrderedQueryable<T>>? orderBy = null,
                                        string includeProperties = "",
                                        bool ignoreQueryFilters = false)
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
            try
            {
                await dbSet.AddAsync(entity);
                return entity;
            }
            catch (Exception ex)
            {
                return default;
            }
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

        public async Task<PagingList<T>> Search(Expression<Func<T, bool>>? filter = null,
                                          int? pageSize = null,
                                          int pageNumber = 1,
                                          SortDirection sortDirection = SortDirection.Ascending,
                                          string sortField = "",
                                          bool IsInclude = false,
                                          bool ignoreQueryFilters = false)
        {
            var toReturn = new PagingList<T>();
            IQueryable<T>? query = dbSet;

            query = IncludeProperties(query, IsInclude);
            query = GenericRepository<T>.ApplyFilter(query, filter);
            query = ApplySorting(query, sortField, sortDirection);

            toReturn.TotalCount = await query.CountAsync();
            query = ApplyPaging(query, pageNumber, pageSize);

            var results = await query.ToListAsync();
            toReturn.AddRange(results);

            return toReturn;
        }

        public async Task<PagingList<T>> Search(Expression<Func<T, bool>>? filter = null,
                                        int? pageSize = null,
                                        int pageNumber = 1,
                                        List<(string sortField, SortDirection sortDirection)>? sortFields = null,
                                        bool IsInclude = false,
                                        bool ignoreQueryFilters = false)
        {
            var toReturn = new PagingList<T>();
            IQueryable<T> query = dbSet;

            query = IncludeProperties(query, IsInclude);
            query = GenericRepository<T>.ApplyFilter(query, filter);
            query = ApplySorting(query, sortFields);

            toReturn.TotalCount = await query.CountAsync();
            query = ApplyPaging(query, pageNumber, pageSize);

            var results = await query.ToListAsync();
            toReturn.AddRange(results);

            return toReturn;
        }

        private static IQueryable<T> ApplyFilter(IQueryable<T> query, Expression<Func<T, bool>>? filter)
        {
            if (filter != null)
            {
                query = query.Where(filter);
            }
            return query;
        }

        private IQueryable<T> ApplyPaging(IQueryable<T> query, int pageNumber, int? pageSize)
        {
            if (pageSize != null)
            {
                query = query.Skip((pageNumber - 1) * pageSize ?? 0).Take(pageSize.Value);
            }
            return query;
        }

        private IQueryable<T> ApplySorting(IQueryable<T> query, string sortField, SortDirection sortDirection)
        {
            if (!string.IsNullOrEmpty(sortField))
            {
                if (sortDirection == SortDirection.Ascending)
                {
                    query = query.OrderBy(property: sortField);
                }
                else
                {
                    query = query.OrderByDescending(property: sortField);
                }
            }
            return query;
        }

        private IQueryable<T> ApplySorting(IQueryable<T> query, List<(string sortField, SortDirection sortDirection)>? sortFields)
        {
            IOrderedQueryable<T>? orderedQuery = null;

            for (int i = 0; i < sortFields?.Count; i++)
            {
                var (sortField, sortDirection) = sortFields[i];

                if (!string.IsNullOrEmpty(sortField))
                {
                    if (i == 0)
                    {
                        orderedQuery = sortDirection == SortDirection.Ascending
                            ? query.OrderBy(sortField)
                            : query.OrderByDescending(sortField);
                    }
                    else
                    {
                        orderedQuery = sortDirection == SortDirection.Ascending
                            ? orderedQuery.ThenBy(sortField)
                            : orderedQuery.ThenByDescending(sortField);
                    }
                }
            }

            return orderedQuery ?? query;
        }

        private IQueryable<T> IncludeProperties(IQueryable<T> query, bool isInclude)
        {
            if (isInclude)
            {
                var navigationProp = context.Model.FindEntityType(typeof(T))?.GetNavigations();
                if (navigationProp != null)
                {
                    foreach (var item in navigationProp)
                    {
                        query = query.Include(item.Name);
                        query = IncludeSubProperties(query, item);
                    }
                }
            }
            return query;
        }

        private IQueryable<T> IncludeSubProperties(IQueryable<T> query, INavigation item)
        {
            if (item.ClrType.FullName != null)
            {
                var subProps = context.Model.FindEntityType(name: item.ClrType.FullName)?.GetNavigations();
                if (subProps != null && subProps.Any())
                {
                    foreach (var subItem in subProps)
                    {
                        query = query.Include($"{item.Name}.{subItem.Name}");
                    }
                }
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