using System.ComponentModel.DataAnnotations;
using Fokkerij.Domain;

namespace Fokkerij.Api.Models;

public class HorseCreateModel
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = null!;
    
    [Required(ErrorMessage = "BirthYear is required")]
    public int BirthYear { get; set; }
    
    [Required(ErrorMessage = "Height is required")]
    public double Height { get; set; }
    
    [Required(ErrorMessage = "The Sex is required")]
    public Sex Sex { get; set; }

    public string HealthCertificate { get; set; } = null!;
}