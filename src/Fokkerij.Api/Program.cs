using System.Text.Json.Serialization;
using Fokkerij.Api.Models;
using Fokkerij.Application.Interfaces;
using Fokkerij.Application.Services;
using Fokkerij.Domain;
using Fokkerij.Infrastructure;
using Fokkerij.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<IHorseService, HorseService>();
builder.Services.AddScoped<IHorseFactory, HorseFactory>();
builder.Services.AddScoped<IHorseRepository, HorseDbRepository>();
builder.Services.AddScoped<IModelMapper, ModelMapper>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<FokkerijContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mySqlOptions =>
        {
            mySqlOptions.EnableRetryOnFailure();
        }

    ));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}


app.MapControllers();

app.Run();
