using Hl7.Fhir.Model;

namespace hospitalApiProject.Services
{
  public interface IFhirBundleService
  {
    Bundle GetPrescriptionBundle();

    Bundle CreateUnstructuredBundle(string filePath);
  }
}
