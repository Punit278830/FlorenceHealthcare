using Hl7.Fhir.Model;

namespace hospitalApiProject.Services.Interfaces
{
  public interface IFhirBundleService: ISimpleServiceBase
  {
    Bundle GetPrescriptionBundle();

    Bundle CreateUnstructuredBundle(string filePath);
  }
}
