namespace Fokkerij.Domain.Tests;

[TestFixture]
public class HorseFactoryTests
{
    private HorseFactory _factory;

    [SetUp]
    public void SetUp()
    {
        _factory = new HorseFactory();
    }

    [Test]
    public void CreateHorse_WithValidData_ShouldCreateHorse()
    {
        string name = "Speedy";
        int birthYear = 2010;
        double height = 1.6;
        Sex sex = Sex.Female;
        string cert = "Certificate";

        Horse horse = _factory.CreateHorse(name, birthYear, height, sex, cert);
        
        Assert.That(horse, Is.Not.Null);
        Assert.That(horse.Name, Is.EqualTo(name));
        Assert.That(horse.BirthYear, Is.EqualTo(birthYear));
    }

    [Test]
    [TestCase("")]
    [TestCase(" ")]
    public void CreateHorse_WithInvalidNameShouldThrowException(string invalidName)
    {
        Assert.Throws<ContractException>(
            () => _factory.CreateHorse(invalidName, 2020, 1.5, Sex.Female, "Cert"));
    }
    
    [Test]
    [TestCase(0)]
    [TestCase(-2.0)]
    [TestCase(-1.7)]
    public void CreateHorse_WithInvalidHeightShouldThrowException(double invalidHeight)
    {
        Assert.Throws<ContractException>(
            () => _factory.CreateHorse("Horse", 2020, invalidHeight, Sex.Female, "Cert"));
    }

    [Test]
    public void CreateHorse_WithFutureBirthYear_ShouldThrowException()
    {
        int futureBirthYear = DateTime.Now.Year + 1;
        
        Assert.Throws<ContractException>(
            () => _factory.CreateHorse("Horse", futureBirthYear, 1.5, Sex.Female, "Cert"));
    }
}