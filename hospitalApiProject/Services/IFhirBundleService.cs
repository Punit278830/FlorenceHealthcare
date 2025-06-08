using Hl7.Fhir.Model;

namespace hospitalApiProject.Services.Interfaces
{
  public interface IFhirBundleService
  {
    Bundle GetPrescriptionBundle();

    Bundle CreateUnstructuredBundle(string filePath);
  }
}
