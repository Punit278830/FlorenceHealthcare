using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Interfaces.Shared;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace hospitalApiProject.Services
{
  public class PatientInfoService : IPatientInfoService
  {
    private readonly FlorenceDbContext _context;

    public PatientInfoService(FlorenceDbContext context)
    {
      _context = context;
    }

    public string ErrorMessage { get; set; }

    public bool HasError
    {
      get { return !string.IsNullOrEmpty(ErrorMessage); }
    }

    public HttpStatusCode StatusCode { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

    public async Task AddPatient(PatientInfo patientInfo)
    {
      try
      {
        //PatientInfo? toReturn = default;
        // Check if a patient with the same IdentityNumber already exists
        //var existingPatient = await _context.PatientInfos
        //                                    .FirstOrDefaultAsync(p => p.IdentityNumber == patientInfo.IdentityNumber);

        //if (existingPatient != null)
        //{
        //  this.ErrorMessage = "Identity Number already exists.";
          
        //}

        // Add the new PatientInfo
        _context.PatientInfos.Add(patientInfo);
        await _context.SaveChangesAsync();

        //return patientInfo;
      }
      catch (Exception ex)
      {
        this.ErrorMessage = "Some error occurred while add new patient in the system.";
        //return null;
      }
    }
  }
}
