namespace Fokkerij.Domain;

public interface IHorseFactory
{
    Horse CreateHorse(string name, int birthYear, double height, Sex sex, string healthCertificate);
}