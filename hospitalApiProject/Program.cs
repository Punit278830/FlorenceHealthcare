using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Implementations;
using hospitalApiProject.Repository.Implementations;
using hospitalApiProject.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Interfaces;
using Infrastructure.Implementations;
using Repositories.Interfaces;
using Repositories.Implementations;
using Services.Interfaces;
using Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddControllers();
builder.Services.AddDbContext<FlorenceDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
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
builder.Services.AddScoped<IAbhaM2Service, ABHAService>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPatientInfoService, PatientInfoService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IFhirBundleService, FhirBundleService>();
builder.Services.AddTransient<FideliusEncryption>();

// Register Repository Pattern
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IDbContextFactory, DbContextFactory>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register Services
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IMedicinesGroupService, MedicinesGroupService>();
builder.Services.AddScoped<IDiagnosisTemplateMasterService, DiagnosisTemplateMasterService>();
builder.Services.AddScoped<IMedicineMasterService, MedicineMasterService>();
builder.Services.AddScoped<IFilesUploadService, FilesUploadService>();
builder.Services.AddScoped<IPrescriptionTemplateMasterService, PrescriptionTemplateMasterService>();
builder.Services.AddScoped<IPrescriptionTemplateDetailsService, PrescriptionTemplateDetailsService>();
builder.Services.AddScoped<IPrescriptionDetailsService, PrescriptionDetailsService>();
builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();
builder.Services.AddScoped<IPaymentModeInfoService, PaymentModeInfoService>();
builder.Services.AddScoped<IPaymentInfoService, PaymentInfoService>();
builder.Services.AddScoped<IDiagnosisService, DiagnosisService>();

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
app.UseRouting();
app.UseAuthorization();


// Map controllers and additional endpoints
app.UseEndpoints(endpoints =>
{
  endpoints.MapControllers();
});




app.Run();
