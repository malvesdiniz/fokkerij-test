using Fokkerij.Domain;

namespace Fokkerij.Api.Models;

public interface IModelMapper
{
    HorseResponseModel FromHorseToResponseModel(Horse horse);
}