using Fokkerij.Domain;

namespace Fokkerij.Application.Interfaces;

public interface IHorseService
{
    Task<Horse> CreateHorseAsync(string name, int birthYear, double height, Sex sex, string certificate);
    Task<IEnumerable<Horse>> GetAllHorsesAsync();
    Task<Horse?> GetHorseByIdAsync(Guid id);
    Task<Horse> UpdateHorseAsync(Guid id, string name, int birthYear, double height, Sex sex, string certificate);
}