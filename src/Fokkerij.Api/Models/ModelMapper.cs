using Fokkerij.Domain;
using Riok.Mapperly.Abstractions;

namespace Fokkerij.Api.Models;

[Mapper]
public partial class ModelMapper : IModelMapper
{
    public partial HorseResponseModel FromHorseToResponseModel(Horse horse);
}