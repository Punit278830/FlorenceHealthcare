using hospitalApiProject.Models;
using hospitalApiProject.Services;
using hospitalApiProject.Services.Abha;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Interfaces.Shared;
using hospitalApiProject.Services.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// 1. Register services
builder.Services.AddControllers();
builder.Services.AddDbContext<FlorenceDbContext>(options =>
    options.UseSqlServer("myDb1"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontendApp", policy =>
      policy.WithOrigins("https://kulhadchaiwala.in")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddMemoryCache();

builder.Services.AddScoped<IAbhaService, ABHAService>();
builder.Services.AddScoped<IAbhaM2Service, ABHAService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddTransient<IPatientInfoService, PatientInfoService>();
builder.Services.AddScoped<IFhirBundleService, FhirBundleService>();
builder.Services.AddTransient<FideliusEncryption>();

var app = builder.Build();

// 2. Development-only middleware
if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
  app.UseSwagger();
  app.UseSwaggerUI(c =>
  {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
  });
}

// 3. Redirect root ("/") to Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

// 4. Middleware pipeline
app.UseHttpsRedirection();
app.UseCors("AllowFrontendApp"); // applied to all environments
app.UseRouting();
app.UseAuthorization();

// 5. Request logging
app.Use(async (context, next) =>
{
  var logger = app.Services
                  .GetRequiredService<ILoggerFactory>()
                  .CreateLogger("RequestLogger");

  logger.LogInformation("Request: {Method} {Path}",
      context.Request.Method,
      context.Request.Path);

  try
  {
    await next();

    if (context.Response.StatusCode >= 400)
    {
      logger.LogWarning("Response {StatusCode} for {Method} {Path}",
          context.Response.StatusCode,
          context.Request.Method,
          context.Request.Path);
    }
  }
  catch (Exception ex)
  {
    logger.LogError(ex,
        "Exception for {Method} {Path}",
        context.Request.Method,
        context.Request.Path);
    throw;
  }
});

// 6. Map controllers
app.MapControllers();

app.Run();
