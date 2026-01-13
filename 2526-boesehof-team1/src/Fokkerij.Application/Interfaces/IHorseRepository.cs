using Fokkerij.Domain;

namespace Fokkerij.Application.Interfaces;

public interface IHorseRepository
{
    Task AddAsync(Horse horse);
    Task<IEnumerable<Horse>> GetAllAsync();
    Task<Horse?> GetHorseByIdAsync(Guid id);
    Task<Horse> UpdateAsync(Horse horse);
}