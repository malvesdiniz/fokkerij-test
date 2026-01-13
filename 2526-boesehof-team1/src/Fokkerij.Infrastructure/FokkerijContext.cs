using Fokkerij.Domain;
using Fokkerij.Infrastructure.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Fokkerij.Infrastructure;

internal class FokkerijContext : DbContext
{
    public DbSet<Horse> Horses { get; set; } = null!;

    public FokkerijContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        new HorseConfiguration().Configure(modelBuilder.Entity<Horse>());
    }
}