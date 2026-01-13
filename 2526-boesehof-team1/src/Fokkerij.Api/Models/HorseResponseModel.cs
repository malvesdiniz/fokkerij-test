using Fokkerij.Domain;

namespace Fokkerij.Api.Models;

public class HorseResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int BirthYear { get; set; }
    public double Height { get; set; }
    public Sex Sex { get; set; }
    public string HealthCertificate { get; set; } = string.Empty;
}