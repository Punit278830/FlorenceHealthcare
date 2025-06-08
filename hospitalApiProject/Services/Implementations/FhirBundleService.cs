using Hl7.Fhir.Model;
using hospitalApiProject.Services.Interfaces;

namespace hospitalApiProject.Services.Implementations
{
  public class FhirBundleService : IFhirBundleService
  {
    public Bundle GetPrescriptionBundle()
    {
      //create a new bundle
      var bundle = new Bundle
      {
        Type = Bundle.BundleType.Collection,
        Id = Guid.NewGuid().ToString(),
        Timestamp = DateTime.UtcNow
      };

      var patientId = CreatePatientBundleEntry(bundle);
      var practitionerId = CreatePractitionerBundleEntry(bundle);
      CreateMedicationBundleEntry(bundle, patientId, practitionerId);

      return bundle;
    }

    private string CreatePatientBundleEntry(Bundle bundle)
    {
      //create a patient resource
      var patient = new Patient
      {
        Id = Guid.NewGuid().ToString(),
        Name = new List<HumanName> {
          new HumanName{
            Family = "Doe",
            Given = new List<string> { "John" }
          }
        },
        Gender = AdministrativeGender.Male,
        BirthDate = "1980-01-01"
      };

      bundle.Entry.Add(new Bundle.EntryComponent
      {
        FullUrl = $"urn:uuid:{patient.Id}",
        Resource = patient
      });

      return patient.Id;
    }

    private string CreatePractitionerBundleEntry(Bundle bundle)
    {
      //create a patient resource
      var practitioner = new Practitioner
      {
        Id = Guid.NewGuid().ToString(),
        Name = new List<HumanName> {
          new HumanName{
            Family = "Smith",
            Given = new List<string> { "Jane" }
          }
        }
      };

      AddEntryToBundle(bundle, practitioner.Id, practitioner);

      return practitioner.Id;
    }


    private void CreateMedicationBundleEntry(Bundle bundle, string patientId, string practitionerId)
    {
      //create a patient resource
      var medication = new Medication
      {
        Id = Guid.NewGuid().ToString(),
        Code = new CodeableConcept("http://www.nlm.nih.gov/research/umls/rxnorm", "243670", "Aspirin 81 mg oral tablet")
      };

      AddEntryToBundle(bundle, medication.Id, medication);

      var medicationRequest = new MedicationRequest
      {
        Id = Guid.NewGuid().ToString(),
        Status = MedicationRequest.MedicationrequestStatus.Active,
        Intent = MedicationRequest.MedicationRequestIntent.Order,
        Subject = new ResourceReference($"urn:uuid:{patientId}"),
        Medication = new ResourceReference($"urn:uuid:{medication.Id}"),
        AuthoredOn = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
        Requester = new ResourceReference($"urn:uuid:{practitionerId}")
      };

      AddEntryToBundle(bundle, medicationRequest.Id, medicationRequest);
    }

    private string CreateObservationBundleEntry(Bundle bundle, string patientId)
    {
      var observation = new Observation
      {
        Id = Guid.NewGuid().ToString(),
        Status = ObservationStatus.Final,
        Code = new CodeableConcept("http://loinc.org", "3141-9", "Body weight measured"),
        Subject = new ResourceReference($"urn:uuid:{patientId}"),
        Value = new Quantity
        {
          Value = 70,
          Unit = "kg",
          System = "http://unitsofmessure.org",
          Code = "kg"
        }
      };

      AddEntryToBundle(bundle, observation.Id, observation);

      return observation.Id;
    }


    private Bundle AddEntryToBundle(Bundle bundle, string uuid, Resource resource)
    {
      bundle.Entry.Add(new Bundle.EntryComponent
      {
        FullUrl = $"urn:uuid:{uuid}",
        Resource = resource
      });

      return bundle;
    }

    public Bundle CreateUnstructuredBundle(string filePath)
    {
      var base64Content = ReadFileAsBase64(filePath);
      var documentReference = CreateDocumentReference(base64Content, "application/pdf", Path.GetFileName(filePath));

      return new Bundle
      {
        Id = Guid.NewGuid().ToString(),
        Type = Bundle.BundleType.Document,
        Timestamp = DateTime.UtcNow,
        Entry = new List<Bundle.EntryComponent>
            {
                new Bundle.EntryComponent
                {
                    FullUrl = $"urn:uuid:{documentReference.Id}",
                    Resource = documentReference
                }
            }
      };
    }

    private DocumentReference CreateDocumentReference(string base64Content, string contentType, string title)
    {
      return new DocumentReference
      {
        Id = Guid.NewGuid().ToString(),
        Status = DocumentReferenceStatus.Current,
        Type = new CodeableConcept("http://loinc.org", "34108-1", "Outpatient Note"),
        //Indexed = DateTime.UtcNow,
        Content = new List<DocumentReference.ContentComponent>
            {
                new DocumentReference.ContentComponent
                {
                    Attachment = new Attachment
                    {
                        ContentType = contentType,
                        Data = Convert.FromBase64String(base64Content),
                        Title = title
                    }
                }
            }
      };
    }

    private string ReadFileAsBase64(string filePath)
    {
      byte[] fileBytes = File.ReadAllBytes(filePath);
      return Convert.ToBase64String(fileBytes);
    }

  }
}
