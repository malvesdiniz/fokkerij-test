using Fokkerij.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fokkerij.Infrastructure.Configurations;

public class HorseConfiguration : IEntityTypeConfiguration<Horse>
{
    public void Configure(EntityTypeBuilder<Horse> builder)
    {
        builder.HasKey(h => h.Id);

        builder.Property(h => h.Name)
            .HasMaxLength(30)
            .IsRequired();
        
        builder.Property(h => h.BirthYear)
            .IsRequired();
        
        builder.Property(h => h.Height)
            .IsRequired();
        
        builder.Property(h => h.Sex)
            .HasConversion<string>()
            .IsRequired();
    }
}