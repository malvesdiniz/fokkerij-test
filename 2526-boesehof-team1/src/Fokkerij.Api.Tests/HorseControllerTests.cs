using Fokkerij.Api.Controllers;
using Fokkerij.Api.Models;
using Fokkerij.Application.Interfaces;
using Fokkerij.Domain;
using Fokkerij.Tests.Common.Builders;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Fokkerij.Api.Tests;

[TestFixture]
public class HorseControllerTests
{
    private Mock<IHorseService> _horseServiceMock = null!;
    private Mock<IModelMapper> _mapperMock = null!;
    private HorseController _controller = null!;

    [SetUp]
    public void Setup()
    {
        _horseServiceMock = new Mock<IHorseService>();
        _mapperMock = new Mock<IModelMapper>();

        _controller = new HorseController(_mapperMock.Object, _horseServiceMock.Object);
    }

    [Test]
    public async Task CreateHorse_WithValidData_ShouldReturnResponseModel()
    {
        var requestModel = new HorseCreateModel
        {
            Name = "Thunder",
            BirthYear = 2021,
            Height = 165,
            Sex = Sex.Male, 
            HealthCertificate = "Cert123"
        };

        var domainHorse = new HorseBuilder()
            .WithName("Thunder")
            .WithBirthYear(2021)
            .WithSex(Sex.Male)
            .Build();

        var expectedResponse = new HorseResponseModel
        {
            Id = domainHorse.Id,
            Name = "Thunder"
        };

        _horseServiceMock
            .Setup(s => s.CreateHorseAsync(
                requestModel.Name,
                requestModel.BirthYear,
                requestModel.Height,
                requestModel.Sex,
                requestModel.HealthCertificate))
            .ReturnsAsync(domainHorse);

        _mapperMock
            .Setup(m => m.FromHorseToResponseModel(domainHorse))
            .Returns(expectedResponse);

        var result = await _controller.CreateHorse(requestModel);

        Assert.That(result.Value, Is.Not.Null);
        
        Assert.That(result.Value!.Name, Is.EqualTo("Thunder"));

        _horseServiceMock.Verify(s => s.CreateHorseAsync(
            It.IsAny<string>(), 
            It.IsAny<int>(), 
            It.IsAny<double>(),
            It.IsAny<Sex>(), 
            It.IsAny<string>()), Times.Once);
            
        _mapperMock.Verify(m => m.FromHorseToResponseModel(It.IsAny<Horse>()), Times.Once);
    }
    
    [Test]
    public void CreateHorse_WhenServiceThrowsContractException_ShouldThrowException()
    {
        var requestModel = new HorseCreateModel
        {
            Name = "InvalidHorse", 
            BirthYear = 3000,
            Height = 1.62,
            Sex = Sex.Female
        };

        _horseServiceMock
            .Setup(s => s.CreateHorseAsync(
                It.IsAny<string>(),
                It.IsAny<int>(),
                It.IsAny<double>(),
                It.IsAny<Sex>(),
                It.IsAny<string>()))
            .ThrowsAsync(new ContractException("Birth year cannot be in the future"));
        
        var ex = Assert.ThrowsAsync<ContractException>(async () => 
            await _controller.CreateHorse(requestModel));
        
        Assert.That(ex.Message, Is.EqualTo("Birth year cannot be in the future"));
    }

    [Test]
    public async Task GetAllHorses_ShouldReturnListOfHorseResponseModels()
    {
        var horse1 = new HorseBuilder().WithName("Spirit").Build();
        var horse2 = new HorseBuilder().WithName("Thunder").Build();
        var horses = new List<Horse> { horse1, horse2 };

        var response1 = new HorseResponseModel { Id = horse1.Id, Name = "Spirit" };
        var response2 = new HorseResponseModel { Id = horse2.Id, Name = "Thunder" };

        _horseServiceMock
            .Setup(s => s.GetAllHorsesAsync())
            .ReturnsAsync(horses);

        _mapperMock
            .Setup(m => m.FromHorseToResponseModel(horse1))
            .Returns(response1);
        _mapperMock
            .Setup(m => m.FromHorseToResponseModel(horse2))
            .Returns(response2);

        var result = await _controller.GetAllHorses();

        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);

        var responseModels = okResult!.Value as IEnumerable<HorseResponseModel>;
        Assert.That(responseModels!.Count(), Is.EqualTo(2));

        _horseServiceMock.Verify(s => s.GetAllHorsesAsync(), Times.Once);
    }

    [Test]
    public async Task GetAllHorses_WhenNoHorses_ShouldReturnEmptyList()
    {
        _horseServiceMock
            .Setup(s => s.GetAllHorsesAsync())
            .ReturnsAsync(new List<Horse>());

        var result = await _controller.GetAllHorses();

        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);

        var responseModels = okResult!.Value as IEnumerable<HorseResponseModel>;
        Assert.That(responseModels, Is.Empty);
    }

    [Test]
    public async Task GetHorseById_WhenHorseExists_ShouldReturnOkWithResponseModel()
    {
        // Arrange
        Guid id = Guid.NewGuid();

        var domainHorse = new HorseBuilder()
            .WithName("Spirit")
            .Build();

        var expectedResponse = new HorseResponseModel
        {
            Id = id,
            Name = "Spirit"
        };

        _horseServiceMock
            .Setup(s => s.GetHorseByIdAsync(id))
            .ReturnsAsync(domainHorse);

        _mapperMock
            .Setup(m => m.FromHorseToResponseModel(domainHorse))
            .Returns(expectedResponse);

        // Act
        var result = await _controller.GetHorseById(id);

        // Assert
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult, Is.Not.Null);

        var responseModel = okResult!.Value as HorseResponseModel;
        Assert.That(responseModel, Is.Not.Null);
        Assert.That(responseModel!.Id, Is.EqualTo(id));
        Assert.That(responseModel.Name, Is.EqualTo("Spirit"));

        _horseServiceMock.Verify(s => s.GetHorseByIdAsync(id), Times.Once);
        _mapperMock.Verify(m => m.FromHorseToResponseModel(domainHorse), Times.Once);
    }

    [Test]
    public async Task GetHorseById_WhenHorseDoesNotExist_ShouldReturnNotFound()
    {
        // Arrange
        Guid id = Guid.NewGuid();

        _horseServiceMock
            .Setup(s => s.GetHorseByIdAsync(id))
            .ReturnsAsync((Horse?)null);

        // Act
        var result = await _controller.GetHorseById(id);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
        _horseServiceMock.Verify(s => s.GetHorseByIdAsync(id), Times.Once);

        // Mapper should not be called when horse is missing
        _mapperMock.Verify(m => m.FromHorseToResponseModel(It.IsAny<Horse>()), Times.Never);
    }

    [Test]
    public async Task UpdateHorse_WhenHorseExists_ShouldReturnOk()
    {
        var updateModel = new HorseUpdateModel
        {
            Name = "Thunder",
            BirthYear = 2021,
            Height = 165,
            Sex = Sex.Male, 
            HealthCertificate = "Cert123"
        };

        var domainHorse = new HorseBuilder()
            .WithName("Thunder")
            .Build();

        var id = domainHorse.Id;

        _horseServiceMock
            .Setup(s => s.UpdateHorseAsync(
                id,
                updateModel.Name,
                updateModel.BirthYear,
                updateModel.Height,
                updateModel.Sex,
                updateModel.HealthCertificate
            ))
            .ReturnsAsync(domainHorse);

        var result = await _controller.UpdateHorse(id, updateModel);
        
        Assert.That(result, Is.InstanceOf<OkResult>());
        
        _horseServiceMock.Verify(s => s.UpdateHorseAsync(
            id,
            updateModel.Name,
            updateModel.BirthYear,
            updateModel.Height,
            updateModel.Sex,
            updateModel.HealthCertificate
        ), Times.Once);
    }
    
    [Test]
    public async Task UpdateHorse_WhenHorseDoesNotExist_ShouldReturnNotFound()
    {
        var id = Guid.NewGuid();
        var updateModel = new HorseUpdateModel 
        { 
            Name = "Ghost", 
            BirthYear = 2000, 
            Height = 150, 
            Sex = Sex.Female, 
            HealthCertificate = "CERT" 
        };

        _horseServiceMock
            .Setup(s => s.UpdateHorseAsync(
                id,
                It.IsAny<string>(),
                It.IsAny<int>(),
                It.IsAny<double>(),
                It.IsAny<Sex>(),
                It.IsAny<string>()
            ))
            .ThrowsAsync(new KeyNotFoundException());

        var result = await _controller.UpdateHorse(id, updateModel);
        
        Assert.That(result, Is.InstanceOf<NotFoundResult>());
    }
}