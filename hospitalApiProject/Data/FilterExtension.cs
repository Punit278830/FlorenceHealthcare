using System;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace hospitalApiProject.Data
{
    public static class FilterExtension
    {
        public static ModelBuilder DefaultFilters(this ModelBuilder modelBuilder)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var auditPropertiesNavigation = entityType.FindNavigation("AuditProperties");
                if (auditPropertiesNavigation != null)
                {
                    var auditPropertiesType = auditPropertiesNavigation.ClrType;
                    var isActiveProperty = auditPropertiesType.GetProperties().FirstOrDefault(p => p.Name == "IsActive");
                    var isDeletedProperty = auditPropertiesType.GetProperties().FirstOrDefault(p => p.Name == "IsDeleted");
                    if (isActiveProperty != null && isDeletedProperty != null)
                    {
                        var parameter = Expression.Parameter(entityType.ClrType, "e");
                        var auditProperties = Expression.Property(parameter, auditPropertiesNavigation.PropertyInfo);
                        var isActive = Expression.Property(auditProperties, isActiveProperty);
                        var isNotDeleted = Expression.Not(Expression.Property(auditProperties, isDeletedProperty));
                        var predicateBody = Expression.AndAlso(isActive, isNotDeleted);
                        var lambdaExpression = Expression.Lambda(predicateBody, parameter);
                        modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambdaExpression);
                    }
                }
            }
            return modelBuilder;
        }
    }
} 