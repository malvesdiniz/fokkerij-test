namespace Fokkerij.Domain;

public class HorseFactory : IHorseFactory
{
    public Horse CreateHorse(string name, int birthYear, double height, Sex sex, string healthCertificate)
    {
        Contracts.Require(!string.IsNullOrWhiteSpace(name), message: "Name is required");
        Contracts.Require(birthYear <= DateTime.Now.Year, message: "Birth year can't be in the future");
        Contracts.Require(height > 0, message: "Height can't be lower then 0");

        return new Horse(name, birthYear, height, sex, healthCertificate);
    }
}