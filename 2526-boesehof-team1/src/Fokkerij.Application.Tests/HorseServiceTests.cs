using Fokkerij.Api.Models;
using Fokkerij.Application.Interfaces;
using Fokkerij.Application.Services;
using Fokkerij.Domain;
using Fokkerij.Tests.Common.Builders;
using Moq;

namespace Fokkerij.Application.Tests;

[TestFixture]
public class HorseServiceTests
{
    private Mock<IHorseRepository> _repositoryMock = null!;
    private Mock<IHorseFactory> _factoryMock = null!;
    private HorseService _service = null!;

    [SetUp]
    public void Setup()
    {
        _repositoryMock = new Mock<IHorseRepository>();
        _factoryMock = new Mock<IHorseFactory>();

        _service = new HorseService(_repositoryMock.Object, _factoryMock.Object);
    }

    [Test]
    public async Task CreateHorseAsync_WithValidData_ShouldCallRepositoryAndReturnHorse()
    {
        var name = "Spirit";
        var birthYear = 2021;
        var height = 1.55;
        var sex = Sex.Male;
        var cert = "Cert-001";

        var createdHorse = new HorseBuilder()
            .WithName(name)
            .WithBirthYear(birthYear)
            .WithHeight(height)
            .WithSex(sex)
            .WithHealthCertificate(cert)
            .Build();

        _factoryMock
            .Setup(f => f.CreateHorse(name, birthYear, height, sex, cert))
            .Returns(createdHorse);

        var result = await _service.CreateHorseAsync(name, birthYear, height, sex, cert);
        
        Assert.That(result, Is.EqualTo(createdHorse));

        _factoryMock.Verify(f => f.CreateHorse(name, birthYear, height, sex, cert), Times.Once);

        _repositoryMock.Verify(r => r.AddAsync(createdHorse), Times.Once);
    }

    [Test]
    public void CreateHorseAsync_WhenFactoryThrowsException_ShouldNotSaveToRepository()
    {
        _factoryMock
            .Setup(f => f.CreateHorse(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<double>(), It.IsAny<Sex>(), It.IsAny<string>()))
            .Throws(new ContractException("Invalid Horse Data"));

        var ex = Assert.ThrowsAsync<ContractException>(async () => 
            await _service.CreateHorseAsync("Test", 2025, 1.0, Sex.Male, "C"));

        Assert.That(ex!.Message, Is.EqualTo("Invalid Horse Data"));
        
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Horse>()), Times.Never);
    }

    [Test]
    public async Task GetAllHorsesAsync_ShouldReturnAllHorsesFromRepository()
    {
        var horses = new List<Horse>
        {
            new HorseBuilder().WithName("Spirit").Build(),
            new HorseBuilder().WithName("Thunder").Build()
        };

        _repositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(horses);

        var result = await _service.GetAllHorsesAsync();

        Assert.That(result.Count(), Is.EqualTo(2));
        _repositoryMock.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Test]
    public async Task GetAllHorsesAsync_WhenNoHorses_ShouldReturnEmptyList()
    {
        _repositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<Horse>());

        var result = await _service.GetAllHorsesAsync();

        Assert.That(result, Is.Empty);
        _repositoryMock.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Test]
    public async Task GetHorseByIdAsync_WhenHorseExists_ShouldReturnHorse()
    {
        // Arrange
        Guid id = Guid.NewGuid();

        var horse = new HorseBuilder()
            .WithName("Spirit")
            .Build();

        _repositoryMock
            .Setup(r => r.GetHorseByIdAsync(id))
            .ReturnsAsync(horse);

        // Act
        var result = await _service.GetHorseByIdAsync(id);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(horse));

        _repositoryMock.Verify(r => r.GetHorseByIdAsync(id), Times.Once);
    }

    [Test]
    public async Task GetHorseByIdAsync_WhenHorseDoesNotExist_ShouldReturnNull()
    {
        // Arrange
        Guid id = Guid.NewGuid();

        _repositoryMock
            .Setup(r => r.GetHorseByIdAsync(id))
            .ReturnsAsync((Horse?)null);

        // Act
        var result = await _service.GetHorseByIdAsync(id);

        // Assert
        Assert.That(result, Is.Null);

        _repositoryMock.Verify(r => r.GetHorseByIdAsync(id), Times.Once);
    }

    [Test]
    public async Task UpdateHorse_WhenHorseExists_ShouldReturnAndUpdateHorse()
    {
        Guid id = Guid.NewGuid();

        var horse = new HorseBuilder()
            .WithName("Speedy")
            .WithBirthYear(2001)
            .WithHeight(165)
            .WithSex(Sex.Male)
            .WithHealthCertificate("CERT")
            .Build();

        _repositoryMock
            .Setup(r => r.GetHorseByIdAsync(id))
            .ReturnsAsync(horse);

        var result = await _service.UpdateHorseAsync(id, "Spirit", 2000, 165, Sex.Female, "CERT");
        
        Assert.That(result.Name, Is.EqualTo("Spirit"));
        Assert.That(result.BirthYear, Is.EqualTo(2000));
        Assert.That(result.Height, Is.EqualTo(165));
        Assert.That(result.Sex, Is.EqualTo(Sex.Female));
        Assert.That(result.HealthCertificate, Is.EqualTo("CERT"));
        
        _repositoryMock.Verify(r => r.GetHorseByIdAsync(id), Times.Once);
        _repositoryMock.Verify(r => r.UpdateAsync(horse), Times.Once);
    }

    [Test]
    public void UpdateHorse_WhenHorseDoesNotExists_ShouldThrowNotFound()
    {
        Guid id = Guid.NewGuid();
        
        _repositoryMock
            .Setup(r => r.GetHorseByIdAsync(id))
            .ReturnsAsync((Horse?)null);
        
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () =>
        {
            await _service.UpdateHorseAsync(id, "Spirit", 2000, 165, Sex.Female, "CERT"); 
        });
        
        Assert.That(ex.Message, Contains.Substring("not found"));

        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Horse>()), Times.Never);
    }
}