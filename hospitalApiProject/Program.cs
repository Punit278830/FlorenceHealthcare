using hospitalApiProject.Models;
using hospitalApiProject.Services;
using hospitalApiProject.Services.Abha;
using hospitalApiProject.Services.Interfaces.Shared;
using hospitalApiProject.Services.Shared;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddControllers();
builder.Services.AddDbContext<FlorenceDbContext>(options =>
        options.UseSqlServer("myDb1"));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAngularDev",
    builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

});

// Add services to the container
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IAbhaService, ABHAService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
    app.UseCors("AllowAngularDev");
    app.UseSwagger();
    app.UseSwaggerUI();
    
}
else
{
    app.UseCors("AllowAngularDev");
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
