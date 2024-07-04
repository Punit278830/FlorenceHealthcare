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
  options.AddPolicy("AllowAllOrigin",
            builder =>
            {
              builder.AllowAnyOrigin()
                     .AllowAnyHeader()
                     .AllowAnyMethod();
            });

});

// Add services to the container
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IAbhaService, ABHAService>();
builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IAbhaM2Service, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
    app.UseCors("AllowAllOrigin");
    app.UseSwagger();
    app.UseSwaggerUI();
    
}
else
{
  //app.UseExceptionHandler("/Error");
  app.UseHsts();
}


app.UseHttpsRedirection();

app.UseCors("AllowAllOrigin");
app.UseRouting();
app.UseAuthorization();
//app.MapControllers();

app.UseEndpoints(e => e.MapControllers());


app.Run();
