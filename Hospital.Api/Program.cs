using Microsoft.EntityFrameworkCore;
using Hospital.Data.EF;
using Hospital.Repositories.Interface;
using Hospital.Repositories.EF;
using Hospital.Services.Interface;
using Hospital.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<HospitalDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("HospitalDb")));

builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IUnitOfWorkFactory, UnitOfWorkFactory>();
builder.Services.AddScoped<IPatientService, PatientService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.MapControllers();
app.Run();
