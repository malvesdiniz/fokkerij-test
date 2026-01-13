using Fokkerij.Domain;

namespace Fokkerij.Tests.Common.Builders;

public class HorseBuilder
{
    private string _name = "Thunder";
    private int _birthYear = 2020;
    private double _height = 1.5;
    private Sex _sex = Sex.Female;
    private string _healthCertificate = "Certification";

    public HorseBuilder WithName(string name)
    {
        _name = name;
        return this;
    }

    public HorseBuilder WithBirthYear(int year)
    {
        _birthYear = year;
        return this;
    }
    
    public HorseBuilder WithHeight(double height)
    {
        _height = height;
        return this;
    }
    
    public HorseBuilder WithSex(Sex sex)
    {
        _sex = sex;
        return this;
    }
    
    public HorseBuilder WithHealthCertificate(string healthCertificate)
    {
        _healthCertificate = healthCertificate;
        return this;
    }
    
    public Horse Build()
    {
        return new Horse(_name, _birthYear, _height, _sex, _healthCertificate);
    }
}