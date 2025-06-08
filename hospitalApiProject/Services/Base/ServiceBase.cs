using System;
using hospitalApiProject.Models;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Infrastructure.Repository.Interfaces;

namespace hospitalApiProject.Services.Base
{
    public abstract class ServiceBase<T> : SimpleServiceBase where T : class
    {
        protected readonly FlorenceDbContext _context;
        internal T _repository;

        protected ServiceBase(FlorenceDbContext context)
        {
            _context = context;
        }

        protected virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        protected virtual async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        protected virtual async Task<T> UpdateAsync(int id, T entity)
        {
            if (id != GetEntityId(entity))
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return entity;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ExistsAsync(id))
                {
                    throw new KeyNotFoundException($"Entity with ID {id} not found");
                }
                throw;
            }
        }

        protected virtual async Task<T> CreateAsync(T entity)
        {
            _context.Set<T>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        protected virtual async Task DeleteAsync(int id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            if (entity == null)
            {
                throw new KeyNotFoundException($"Entity with ID {id} not found");
            }

            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
        }

        protected virtual async Task<bool> ExistsAsync(int id)
        {
            return await _context.Set<T>().AnyAsync(e => GetEntityId(e) == id);
        }

        protected abstract int GetEntityId(T entity);

        protected internal virtual async Task<PagingList<O>?> ExecuteStoreProcedure<I, O>(string procName, DbContextName context, I input, string output = "") where O : class
        {
            var unitOfWork = _repository as IUnitOfWork;

            var repository = unitOfWork?.GetRepository<O>(context);

            if (repository != null)
            {
                var result = await repository.ExecuteStoredProcedure(procName, input, output);
                return result;
            }
            return default;
        }
    }
} 