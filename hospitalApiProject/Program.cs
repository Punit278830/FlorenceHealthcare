using hospitalApiProject.Models;
using hospitalApiProject.Services;
using hospitalApiProject.Services.Abha;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Interfaces.Shared;
using hospitalApiProject.Services.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});
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
  .AllowAnyHeader()
  .WithExposedHeaders("*"));

});

// Add services to the container
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IAbhaService, ABHAService>();
builder.Services.AddScoped<IAbhaM2Service, ABHAService>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddTransient<IPatientInfoService, PatientInfoService>();
builder.Services.AddScoped<IFhirBundleService, FhirBundleService>();
builder.Services.AddTransient<FideliusEncryption>();
builder.Services.AddScoped<ISuperAdminService, SuperAdminService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// Apply CORS before routing and other middleware
app.UseCors("AllowAngularDev");

app.UseHttpsRedirection();
app.UseRouting();
// Note: Authentication would go here if implemented
// app.UseAuthentication();
app.UseAuthorization();


// Enable request logging
app.Use(async (context, next) =>
{
    var logger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("RequestLogger");
    logger.LogInformation($"Request: {context.Request.Method} {context.Request.Path}");
    try
    {
        await next();
        if (context.Response.StatusCode >= 400)
        {
            logger.LogWarning($"Response {context.Response.StatusCode} for {context.Request.Method} {context.Request.Path}");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, $"Exception for {context.Request.Method} {context.Request.Path}");
        throw;
    }
});

// Map controllers and additional endpoints
app.MapControllers();

// Add explicit OPTIONS handler for CORS preflight
app.MapMethods("api/{**slug}", new[] { "OPTIONS" }, (HttpContext context) =>
{
    context.Response.Headers["Access-Control-Allow-Origin"] = "*";
    context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, HEAD";
    context.Response.Headers["Access-Control-Allow-Headers"] = "*";
    context.Response.Headers["Access-Control-Max-Age"] = "86400";
    return Results.Ok();
});

// Add explicit HEAD handler for API endpoints
app.MapMethods("api/{**slug}", new[] { "HEAD" }, (HttpContext context) =>
{
    context.Response.Headers["Access-Control-Allow-Origin"] = "*";
    return Results.Ok();
});

app.Run();
