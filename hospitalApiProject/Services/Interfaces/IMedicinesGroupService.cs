using hospitalApiProject.Models;

namespace hospitalApiProject.Services.Interfaces
{
    public interface IMedicinesGroupService: ISimpleServiceBase
    {
        Task<IEnumerable<MedicinesGroup>> GetAllMedicinesGroupsAsync();
        Task<MedicinesGroup> GetMedicinesGroupByIdAsync(int id);
        Task<MedicinesGroup> UpdateMedicinesGroupAsync(int id, MedicinesGroup medicinesGroup);
        Task<MedicinesGroup> CreateMedicinesGroupAsync(MedicinesGroup medicinesGroup);
        Task DeleteMedicinesGroupAsync(int id);
        Task<bool> MedicinesGroupExistsAsync(int id);
    }
} 