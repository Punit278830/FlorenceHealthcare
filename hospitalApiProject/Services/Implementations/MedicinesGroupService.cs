using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Services.Implementations
{
    public class MedicinesGroupService : IMedicinesGroupService
    {
        private readonly FlorenceDbContext _context;

        public MedicinesGroupService(FlorenceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MedicinesGroup>> GetAllMedicinesGroupsAsync()
        {
            return await _context.MedicinesGroups.OrderByDescending(x => x.Id).ToListAsync();
        }

        public async Task<MedicinesGroup> GetMedicinesGroupByIdAsync(int id)
        {
            return await _context.MedicinesGroups.FindAsync(id);
        }

        public async Task<MedicinesGroup> UpdateMedicinesGroupAsync(int id, MedicinesGroup medicinesGroup)
        {
            if (id != medicinesGroup.Id)
            {
                throw new ArgumentException("ID mismatch");
            }

            _context.Entry(medicinesGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return medicinesGroup;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await MedicinesGroupExistsAsync(id))
                {
                    throw new KeyNotFoundException($"MedicinesGroup with ID {id} not found");
                }
                throw;
            }
        }

        public async Task<MedicinesGroup> CreateMedicinesGroupAsync(MedicinesGroup medicinesGroup)
        {
            _context.MedicinesGroups.Add(medicinesGroup);
            await _context.SaveChangesAsync();
            return medicinesGroup;
        }

        public async Task DeleteMedicinesGroupAsync(int id)
        {
            var medicinesGroup = await _context.MedicinesGroups.FindAsync(id);
            if (medicinesGroup == null)
            {
                throw new KeyNotFoundException($"MedicinesGroup with ID {id} not found");
            }

            _context.MedicinesGroups.Remove(medicinesGroup);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> MedicinesGroupExistsAsync(int id)
        {
            return await _context.MedicinesGroups.AnyAsync(e => e.Id == id);
        }
    }
} 