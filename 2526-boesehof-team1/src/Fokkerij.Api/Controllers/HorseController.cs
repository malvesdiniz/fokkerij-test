using Fokkerij.Api.Models;
using Fokkerij.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Fokkerij.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HorseController(IModelMapper mapper, IHorseService horseService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<HorseResponseModel>> CreateHorse([FromBody] HorseCreateModel model)
    {
        var horse = await horseService.CreateHorseAsync(
            model.Name,
            model.BirthYear,
            model.Height,
            model.Sex,
            model.HealthCertificate
        );

        var responseModel = mapper.FromHorseToResponseModel(horse);

        return responseModel;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HorseResponseModel>>> GetAllHorses()
    {
        var horses = await horseService.GetAllHorsesAsync();
        var responseModels = horses.Select(mapper.FromHorseToResponseModel);
        return Ok(responseModels);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<HorseResponseModel>> GetHorseById(Guid id)
    {
        var horse = await horseService.GetHorseByIdAsync(id);

        if (horse == null)
        {
            return NotFound();
        }

        var responseModel = mapper.FromHorseToResponseModel(horse);
        return Ok(responseModel);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateHorse(Guid id, [FromBody] HorseUpdateModel model)
    {
        try
        {
            await horseService.UpdateHorseAsync(
                id,
                model.Name,
                model.BirthYear,
                model.Height,
                model.Sex,
                model.HealthCertificate
            );

            return Ok();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}