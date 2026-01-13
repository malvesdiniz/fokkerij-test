using Fokkerij.Application.Interfaces;
using Fokkerij.Domain;

namespace Fokkerij.Application.Services;

public class HorseService(IHorseRepository repository, IHorseFactory factory) : IHorseService
{
    public async Task<Horse> CreateHorseAsync(string name, int birthYear, double height, Sex sex, string certificate)
    {
        var horse = factory.CreateHorse(name, birthYear, height, sex, certificate);

        await repository.AddAsync(horse);
        return horse;
    }

    public async Task<IEnumerable<Horse>> GetAllHorsesAsync()
    {
        return await repository.GetAllAsync();
    }

    public async Task<Horse?> GetHorseByIdAsync(Guid id)
    {
        return await repository.GetHorseByIdAsync(id);
    }

    public async Task<Horse> UpdateHorseAsync(Guid id, string name, int birthYear, double height, Sex sex, string certificate)
    {
        var horse = await repository.GetHorseByIdAsync(id);

        if (horse == null)
        {
            throw new KeyNotFoundException($"Horse with id {id} not found");
        }

        horse.Update(name, birthYear, height, sex, certificate);

        await repository.UpdateAsync(horse);

        return horse;
    }
}