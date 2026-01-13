using Fokkerij.Application.Interfaces;
using Fokkerij.Domain;
using Microsoft.EntityFrameworkCore;

namespace Fokkerij.Infrastructure.Repositories;

internal class HorseDbRepository(FokkerijContext context) : IHorseRepository
{
    public async Task AddAsync(Horse horse)
    {
        await context.AddAsync(horse);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Horse>> GetAllAsync()
    {
        return await context.Horses.ToListAsync();
    }

    public async Task<Horse?> GetHorseByIdAsync(Guid id)
    {
        return await context.Horses.FirstOrDefaultAsync(h => h.Id == id);
    }

    public async Task<Horse> UpdateAsync(Horse horse)
    {
        context.Horses.Update(horse);
        await context.SaveChangesAsync();
        return horse;
    }
}