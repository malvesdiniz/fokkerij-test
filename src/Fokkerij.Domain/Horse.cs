namespace Fokkerij.Domain;

public class Horse : Entity
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = null!;
    public int BirthYear { get; private set; }
    public double Height { get; private set; }
    public Sex Sex { get; private set; }
    public string HealthCertificate { get; private set; } = null!;

    private Horse() {}

    internal Horse(string name, int birthYear, double height, Sex sex, string healthCertificate)
    {
        Id = Guid.NewGuid();
        Name = name;
        BirthYear = birthYear;
        Height = height;
        Sex = sex;
        HealthCertificate = healthCertificate;
    }

    public void Update(string name, int birthYear, double height, Sex sex, string healthCertificate)
    {
        Name = name;
        BirthYear = birthYear;
        Height = height;
        Sex = sex;
        HealthCertificate = healthCertificate;
    }

    protected override IEnumerable<object> GetIdComponents()
    {
        yield return Id;
    }
}