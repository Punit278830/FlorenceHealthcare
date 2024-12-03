using hospitalApiProject.Models;
using hospitalApiProject.Models.Abha;
using hospitalApiProject.Models.Abha.M2;
using hospitalApiProject.Services.Interfaces;
using hospitalApiProject.Services.Interfaces.Shared;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.Json;
using Patient = hospitalApiProject.Models.Abha.M2.Patient;

namespace hospitalApiProject.Services.Abha
{
  public class ABHAService : ApiBase, IAbhaService, IAbhaM2Service
  {
    protected readonly string _baseUrl;
    protected readonly string _phrBaseUrl;

    protected readonly IAuthService _authService;
    protected readonly string _token;
    private readonly FlorenceDbContext _context;
    private readonly IPatientInfoService _patientInfoService;

    public ABHAService(ITokenService tokenService, IAuthService authService, FlorenceDbContext context, IPatientInfoService patientInfoService) : base(tokenService, authService)
    {
      _baseUrl = "https://abhasbx.abdm.gov.in/abha";
      _phrBaseUrl = "https://phrsbx.abdm.gov.in";
      _context = context;
      _patientInfoService = patientInfoService;
    }

    public async Task<string> GenerateOtp(string aadhar)
    {
      try
      {
        var jsonContent = new AbhaRequestModel
        {
          txnId = "",
          scope = [
          "abha-enrol" ],
          loginHint = "aadhaar",
          loginId = aadhar,
          otpSystem = "aadhaar"
        };

        var json = JsonSerializer.Serialize(jsonContent);
        var result = ExecutePost(_baseUrl, "api/v3/enrollment/request/otp", json);

        return result;
      }
      catch (Exception ex)
      {
        this.ErrorMessage = ex.Message;
        return default;
      }
    }

    public Task<string> GenerateOtherOtp(string data, string txnId)
    {
      var jsonContent = new AbhaRequestModel
      {
        txnId = txnId,
        scope = [
        "abha-enrol",
        "mobile-verify"],
        loginHint = "mobile",
        loginId = data,
        otpSystem = "abdm"
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/request/otp", json);
      return Task.FromResult(result);
    }

    public Task<string> EnrollByAadhaar(string txnId, string otp, string mobileNumber)
    {
      var jsonContent = new
      {
        authData = new
        {
          authMethods = new[] {
            "otp"
        },
          otp = new
          {
            timeStamp = DateTime.Now.ToString("YYYY-MM-DD HH:mm:ss"),
            txnId,
            otpValue = otp,
            mobile = mobileNumber
          }
        },
        consent = new
        {
          code = "abha-enrollment",
          version = "1.4"
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/enrol/byAadhaar", json);
      return Task.FromResult(result);
    }

    public Task<string> EnrollByAbdm(string txnId, string otp)
    {
      var jsonContent = new
      {
        scope = new[] {
        "abha-enrol",
        "mobile-verify" },

        authData = new
        {
          authMethods = new[] {
            "otp"
          },
          otp = new
          {
            timeStamp = DateTime.Now.ToString("YYYY-MM-DD HH:mm:ss"),
            txnId,
            otpValue = otp
          }
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/auth/byAbdm", json);
      return Task.FromResult(result);
    }

    public Task<string> GetAbhaAddressSuggestion(string txnId)
    {
      var result = ExecuteGet(_baseUrl, "api/v3/enrollment/enrol/suggestion", txnId);
      return Task.FromResult(result);
    }

    public Task<string> CreateAbhaAddress(string txnId, string abhaAddress, string isPreferred)
    {
      var jsonContent = new
      {
        txnId,
        abhaAddress,
        preferred = isPreferred
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = ExecutePost(_baseUrl, "api/v3/enrollment/enrol/abha-address", json);
      return Task.FromResult(result);
    }

    public Task<byte[]> DownloadAbhaCard(string xToken)
    {
      var result = ExecuteGetForCard("https://healthidsbx.abdm.gov.in", "api/v1/account/getCard", xToken);

      return Task.FromResult(result);
    }

    public async Task<string> GenerateMobileOtp(string mobile)
    {
      try
      {
        var jsonContent = new
        {
          value = mobile
        };

        var json = JsonSerializer.Serialize(jsonContent);
        var result = await ExecutePostV1Async(_phrBaseUrl, "api/v1/phr/registration/generate/otp", json);

        return result;
      }
      catch (Exception ex)
      {
        this.ErrorMessage = ex.Message;
        return default;
      }
    }

    public async Task<string> ConfirmMobileOtpForAbhaAddress(string data, string txnId)
    {
      var jsonContent = new
      {
        otp = data,
        transactionId = txnId
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await ExecutePostV1Async(_phrBaseUrl, "api/v1/phr/registration/verify/otp", json);
      return result;
    }

    public async Task<string> SearchUserByHealthId(string healhtIdNumber)
    {
      var jsonContent = new
      {
        healhtIdNumber = healhtIdNumber
      };
      var json = JsonSerializer.Serialize(jsonContent);

      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/hid/search/auth-methods", json);
      return result;
    }

    public async Task<string> AbhaAddressViaAbhaOtp(string healhtIdNumber, string authMethod)
    {
      var jsonContent = new
      {
        authMethod = authMethod,
        healhtIdNumber = healhtIdNumber
      };

      var json = JsonSerializer.Serialize(jsonContent);

      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/hid/init/transaction", json);
      return result;
    }

    public async Task<string> AbhaAddressViaAbhaVerifyOTP(string txnId, string data)
    {
      var jsonContent = new
      {
        transactionId = txnId,
        value = data
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/hid/confirm/credential", json);
      return result;
    }

    public async Task<string> AbhaAddressSuggestions(string txnId)
    {
      var jsonContent = new
      {
        transactionId = txnId
      };

      var json = JsonSerializer.Serialize(jsonContent);

      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/phr/suggestion", json);
      return result;
    }

    public async Task<string> GetAbhaAddressExists(string phrAddress)
    {
      var result = await ExecutePHRGetAsync(_phrBaseUrl, "api/v1/phr/search/isExist?phrAddress=" + phrAddress);
      return result;
    }

    public async Task<string> CreatePHRAddress(string phrAddress, string txnId)
    {
      var exists = await GetAbhaAddressExists(phrAddress);

      if (exists == "true")
      {
        this.ErrorMessage = "The PHR address already exists.";
        return null;
      }

      var jsonContent = new
      {
        password = "",
        phrAddress = phrAddress,
        transactionId = txnId
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await ExecutePostAsync(_phrBaseUrl, "api/v1/phr/registration/hid/create-phr-address", json);
      return result;
    }

    public async Task<string> CreateAbhaDetails(AbhaDetailsRequest data)
    {
      var json = JsonSerializer.Serialize(data);
      var result = await ExecutePostV1Async(_phrBaseUrl, "api/v1/phr/registration/details", json);
      return result;
    }

    public async Task<string> CreateAbhaAddressViaMobile(string phrAddress, string txnId)
    {
      var exists = await GetAbhaAddressExists(phrAddress);

      if (exists == "true")
      {
        this.ErrorMessage = "The PHR address already exists.";
        return null;
      }

      var jsonContent = new
      {
        password = "",
        phrAddress = phrAddress,
        transactionId = txnId
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await ExecutePostV1Async(_phrBaseUrl, "api/v1/phr/registration/create/phr", json);
      return result;
    }

    public async Task<string> ShareProfile(PatientShareRequest request)
    {
      var jsonContent = new
      {
        //timeStamp = request.timestamp, //DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
        acknowledgement = new
        {
          status = "SUCCESS",
          abhaAddress = request.healthId,
          profile = new
          {
            context = "123",
            tokenNumber = "100",
            expiry = "600"
          }
        },
        response = new
        {
          requestId = request.requestId
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await OnShareProfileAsync("https://dev.abdm.gov.in/hiecm/api", "v3/patient-share/on-share", json, request.timestamp);

      if (this.ErrorMessage != null)
      {

      }
      return result;
    }

    public async Task AddAbhaPatientProfile(PatientProfile patientProfile)
    {
      AbhaPatientDetails abhaPatient = default;

      try
      {
        // Parse day, month, and year 
        int day = int.Parse(patientProfile.dayOfBirth);
        int month = int.Parse(patientProfile.monthOfBirth);
        int year = int.Parse(patientProfile.yearOfBirth);

        DateTime dateOfBirth = new DateTime(year, month, day);
        DateOnly dob = DateOnly.FromDateTime(dateOfBirth);

        // Extract Name
        string[] nameParts = patientProfile.name.Split(' ');

        abhaPatient = new AbhaPatientDetails
        {
          AbhaAddress = patientProfile.abhaAddress,
          AbhaNumber = patientProfile.abhaNumber,
          Address = patientProfile.address?.line,
          Dob = dob,
          Mobile = patientProfile.phoneNumber,
          Gender = patientProfile.gender == "M" ? "Male" : "Female",
          RegistrationDate = DateOnly.FromDateTime(DateTime.Today),
          FirstName = nameParts[0],
          LastName = nameParts[1]
        };

        var errorMessage = await AddNewPatient(abhaPatient);

        if (errorMessage != null)
        {
          abhaPatient.Status = errorMessage == "Identity Number already exists." ? "Existing Patient" : "Not Registered"; //todo : check for already existing
        }
        else
        {
          abhaPatient.Status = "Registered";
        }
      }
      catch (Exception ex)
      {
        this.ErrorMessage = "Error occurred while registering the new ABHA patient.";
      }

      // Add the new PatientInfo to AbhaPatientDetails table
      try
      {
        _context.AbhaPatientDetails.Add(abhaPatient);
        await _context.SaveChangesAsync();
      }
      catch (Exception ex)
      {
        this.ErrorMessage = "Error occurred while adding the ABHA patient profile received from QR Code Scan.";
      }
    }

    private async Task<string?> AddNewPatient(AbhaPatientDetails patientProfile)
    {
      var patientInfo = new PatientInfo
      {
        FirstName = patientProfile.FirstName,
        LastName = patientProfile.LastName,
        IdentityName = "ABHA ID", // todo: add abha address in the identity type options?
        IdentityNumber = patientProfile.AbhaAddress,
        Address = patientProfile.Address,
        Dob = patientProfile.Dob,
        Mobile = patientProfile.Mobile,
        Gender = patientProfile.Gender,
        RegstrationDate = patientProfile.RegistrationDate,
      };

      // Add the new PatientInfo
      await _patientInfoService.AddPatient(patientInfo);

      if (_patientInfoService.HasError)
      {
        return _patientInfoService.ErrorMessage;
      }

      return null;
    }

    public async Task<string> CareContext(PatientShareRequest request)
    {
      var jsonContent = new
      {
        requestId = request.requestId,
        timeStamp = request.timestamp,
        acknowledgement = new
        {
          status = "SUCCESS",
          healthId = request.healthId,
          tokenNumber = "100"
        },
        resp = new
        {
          requestId = request.requestId
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      var result = await OnShareProfileAsync("https://dev.abdm.gov.in/gateway/", "v1.0/patients/profile/on-share", json, "");
      return result;
    }

    public async Task FetchModes(string abhaAddress)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.sss'Z'"),
        query = new
        {
          id = abhaAddress,
          purpose = "KYC_AND_LINK",
          requester = new
          {
            type = "HIP",
            id = "HIP_Florence"
          }
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await FetchModesAsync("https://dev.abdm.gov.in/gateway", "v0.5/users/auth/fetch-modes", json);
    }

    public async Task AbhaAddressAuthInit(string abhaAddress)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
        query = new
        {
          id = abhaAddress,
          purpose = "KYC_AND_LINK",
          authMode = "MOBILE_OTP", //todo
          requester = new
          {
            type = "HIP",
            id = "HIP_Florence"
          }
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await FetchModesAsync("https://dev.abdm.gov.in/gateway/", "v0.5/users/auth/init", json);
    }

    public async Task AbhaAddressAuthConfirm(string txnId, string authCode)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
        transactionId = txnId,
        credential = new
        {
          authCode = authCode
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await FetchModesAsync("https://dev.abdm.gov.in/gateway/", "v0.5/users/auth/confirm", json);
    }

    public async Task LinkCareContext(CareContextModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        link = new Link
        {
          accessToken = data.AccessToken,
          patient = new Patient
          {
            referenceNumber = "patientid_12345",
            display = "OPD_July18",
            careContexts = new List<CareContext>
            {
                new CareContext
                {
                    referenceNumber = "ref_cc_xxx18",
                    display = "OPD Records July18"
                }
            }
          }
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/links/link/add-contexts", json);
    }

    public async Task NotifyContext(CareContextModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        notification = new
        {
          patient = new
          {
            id = "patientid_12345", //todo abha address
            careContexts = new
            {
              patientReference = "patient_visit_1_Nov_002",
              careContextReference = "patient_visit-002"
            },
            hiTypes = new List<string>
            {
              "OPConsultation"
            },
            date = "2023-11-11T09:20:24.133Z",
            hip = new
            {
              id = "S_cility"
            }
          }
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/patients/sms/notify2", json);
    }

    public async Task NotifyMobile(CareContextModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        notification = new
        {
          phoneNo = data.PhoneNumber,
          hip = new
          {
            name = "ref_check_625099",
            id = "OPD_July14"
          }
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/patients/sms/notify2", json);
    }

    public async Task OnDiscoverV1(OnDiscoverModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        transactionId = data.transactionId,
        patient = new
        {
          referenceNumber = "patientid_12345",
          display = "OPD_July18",
          careContexts = new List<CareContext>
            {
                new CareContext
                {
                    referenceNumber = "ref_cc_xxx18",
                    display = "OPD Records July18"
                }
            },
          matchedBy = new List<string> {
             "MOBILE"
          }
        },
        resp = new
        {
          requestId = data.requestId
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway", "v0.5/care-contexts/on-discover", json);
    }

    public async Task OnDiscover(OnDiscoverModel data)
    {
      var jsonContent = new
      {
        transactionId = data.transactionId,
        patient = new List<Patient>
        {
          new Patient {
            referenceNumber = "patientid_12345",
            display = "OPD_July22",
            careContexts = new List<CareContext>
            {
              new CareContext
              {
                referenceNumber = "ref_cc_xxx18",
                display = "OPD Records July18"
              }
            },
            hiType = "OPConsultation",
            count = 1
          }
        },
        matchedBy = new List<string> { "MR" },
        response = new { requestId = data.requestId }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await OnDiscoverWithLogs("https://dev.abdm.gov.in/hiecm", "api/v3/user-initiated-linking/patient/care-context/on-discover", json);
    }

    public async Task LinkOnInit(CareContextModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        transactionId = "",
        link = new
        {
          referenceNumber = "patientid_12345",
          authenticationType = "DIRECT",
          meta = new
          {
            communicationMedium = "MOBILE",
            communicationHint = "string",
            communicationExpiry = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"), //{ {$randomDateFuture} }
          }
        },
        error = "null",
        resp = new
        {
          requestId = ""
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/consents/hip/on-notify", json);
    }

    public async Task LinkOnConfirm(CareContextModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        patient = new
        {
          referenceNumber = "patientid_12345",
          display = "DIRECT",
          careContexts = new List<CareContext>
            {
                new CareContext
                {
                    referenceNumber = "ref_cc_xxx18",
                    display = "OPD Records July18"
                }
            },
        },
        error = "null",
        resp = new
        {
          requestId = ""
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/links/link/on-init", json);
    }

    public async Task ConsentsOnNotify(CareContextModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        acknowledgement = new
        {
          status = "OK",
          consentId = "",
        },
        resp = new
        {
          requestId = ""
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/consents/hip/on-notify", json);
    }

    public async Task HealthInfoOnRequest(CareContextModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(),
        timestamp = DateTime.UtcNow,
        hiRequest = new
        {
          transactionId = "68d47d3f-2229-437c-b245-a704b54f4ae4",
          sessionStatus = "ACKNOWLEDGED"
        },
        resp = new
        {
          requestId = "7fc8faa0-50ac-4ab2-a629-dc45f90e7fdd"
        }
      };
      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/health-information/hip/on-request", json);
    }

    public async Task DataTransferNotification(CareContextModel data)
    {
      var jsonContent = new
      {
        pageNumber = 0,
        pageCount = 1,
        transactionId = "d7b5e623-610d-48ee-968d-410d2071d8a5",
        entries = new List<Entry>
        {
            new Entry
            {
                content = "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",
                media = "application/fhir+json",
                checksum = "c4ca4238a0b923820dcc509a6f75849b",
                careContextReference = "example"
            }
        },
        keyMaterial = new
        {
          cryptoAlg = "EC",
          curve = "P-256",
          dhPublicKey = new
          {
            expiry = DateTime.UtcNow.AddDays(30), // Set expiry date accordingly
            parameters = "example",
            keyValue = "example"
          },
          nonce = "example"
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/health-information/hip/on-request", json);
    }

    public async Task HealthInfoNotify(CareContextModel data)
    {
      var jsonContent = new
      {
        requestId = Guid.NewGuid().ToString(), // Replace with actual logic to generate a GUID
        timestamp = DateTime.UtcNow,
        notification = new
        {
          consentId = "2de9bfbc-6c19-434e-a9a2-aab072c1dc88",
          transactionId = "0969e59f-57eb-458e-b667-38fc635371aa",
          doneAt = DateTime.Parse("2020-10-07T09:52:51.518Z"),
          notifier = new
          {
            type = "HIU",
            id = "SUKREET_1242350"
          },
          statusNotification = new StatusNotification
          {
            sessionStatus = "TRANSFERRED",
            hipId = "SUKREET_124235",
            statusResponses = new List<StatusResponse>
            {
                new StatusResponse
                {
                    careContextReference = "string",
                    hiStatus = "OK",
                    description = "string"
                }
            }
          }
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await LinkCareContextAsync("https://dev.abdm.gov.in/gateway/", "v0.5/health-information/notify", json);
    }

    #region M2 V3 Apis

    #region HIP initiated Linking
    public async Task<string> GenerateLinkToken(GenerateLinkToken request)
    {
      var json = JsonSerializer.Serialize(request);
      var data = await OnGenerateLinkToken("https://dev.abdm.gov.in/hiecm", "api/v3/token/generate-token", json);
      return data; //return linkToken and use in LinkCareContextV3
    }

    public async Task AddCareContextV3()
    {
      // Create CareContext objects
      var careContext1 = new CareContext
      {
        referenceNumber = Guid.NewGuid().ToString(),
        display = "Sugar Test"
      };
      var careContext2 = new CareContext
      {
        referenceNumber = Guid.NewGuid().ToString(),
        display = "Sugar Test"
      };
      var careContext3 = new CareContext
      {
        referenceNumber = Guid.NewGuid().ToString(),
        display = "Blood Test"
      };

      // Create Patient objects
      var patient1 = new Patient
      {
        referenceNumber = "91178386101731@sbx",
        display = "Apollo_Encounter_123_2023070414",
        careContexts = new List<CareContext> { careContext1, careContext2 },
        hiType = "Prescription",
        count = 1
      };

      var patient2 = new Patient
      {
        referenceNumber = Guid.NewGuid().ToString(),
        display = "Apollo_Encounter_123_2023070414",
        careContexts = new List<CareContext> { careContext3 },
        hiType = "WellnessRecord",
        count = 1
      };

      // Create Root object
      var root = new
      {
        AbhaNumber = "91178386101731",
        AbhaAddress = "91178386101731@sbx",
        Patient = new List<Patient> { patient1, patient2 }
      };

      // Serialize the object to JSON

      var json = JsonSerializer.Serialize(root);
      await OnLinkCareContextV3("https://dev.abdm.gov.in/gateway/", "v0.5/links/link/add-contexts", json, ""); //todo get linkToken
    }

    public async Task LinkCareContextV3()
    {
      //todo
      var request = new GenerateLinkToken
      {
        abhaNumber = 91330884683179,
        abhaAddress = "manpreet.0503@sbx",
        name = "Manpreet Kaur",
        gender = "F",
        yearOfBirth = 1989
      };

      var linkToken = await GenerateLinkToken(request);

      // Create a new PatientVisit
      var patientVisit = new Models.Response.PatientVisit
      {
        PatientId = 4739, // Assuming PatientId exists in PatientInfo
        ReferenceNumber = "REF12345",
        Display = "General Checkup",
        HiType = "OPD",
        VisitDate = DateTime.Now
      };

      var cc1 = new Models.Response.CareContext { ReferenceNumber = "CC123", Display = "Initial Consultation" };
      var cc2 = new Models.Response.CareContext { ReferenceNumber = "CC124", Display = "Follow-up Visit" };

      // Add CareContexts to the PatientVisit
      patientVisit.CareContexts = new List<Models.Response.CareContext>
    {
        cc1,
        cc2
    };

      _context.PatientVisits.Add(patientVisit);

      // Step 1: Perform a join between PatientVisit and CareContext on PatientVisit.Id and CareContext.PatientVisitId
      //var patients = await _context.PatientVisits
      //    .Where(p => p.Id != null)  
      //    .Join(_context.CareContexts,
      //          p => p.Id,  
      //          cc => cc.PatientVisitId, 
      //          (p, cc) => new { PatientVisit = p, CareContext = cc })
      //    .GroupBy(x => x.PatientVisit.Id)  // Group by PatientVisit.Id to combine multiple care contexts for each patient
      //    .Select(g => new Patient
      //    {
      //      referenceNumber = g.FirstOrDefault().PatientVisit.ReferenceNumber, 
      //      display = g.FirstOrDefault().PatientVisit.Display, 
      //      hiType = g.FirstOrDefault().PatientVisit.HiType, 
      //      count = g.Count(), 
      //      careContexts = g.Select(x => new Models.Abha.M2.CareContext
      //      {
      //        referenceNumber = x.CareContext.ReferenceNumber, 
      //        display = x.CareContext.Display 
      //      }).ToList() 
      //    })
      //    .ToListAsync();

      var patients = new
      {
        referenceNumber = patientVisit.ReferenceNumber,
        display = patientVisit.Display,
        hiType = patientVisit.HiType,
        count = 1,
        careContext = patientVisit.CareContexts
      };

      // Step 2: Create the root object containing all patients and their care contexts
      var root = new
      {
        AbhaNumber = "91178386101731", // Use your logic to set this dynamically
        AbhaAddress = "manpreet.0503@sbx", // Use your logic to set this dynamically
        Patient = patients // List of patients with their associated care contexts
      };

      // Step 3: Serialize the object to JSON
      var json = JsonSerializer.Serialize(root);

      // Step 4: Send the JSON to the API
      await OnLinkCareContextV3("https://dev.abdm.gov.in/hiecm", "api/v3/link/carecontext", json, linkToken); // todo: get linkToken
    }

    #endregion

    #region HIP Data Flow
    public async Task ConsentsOnNotifyV3(string consentId)
    {
      var jsonContent = new
      {
        acknowledgement = new
        {
          status = "OK",
          consentId = consentId,
        },
        response = new
        {
          requestId = Guid.NewGuid().ToString(),
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await OnConsentsOnNotifyV3("https://dev.abdm.gov.in/hiecm", "api/v3/consent/request/hip/on-notify", json);
    }

    public async Task HealthInfoOnRequestV3(string transactionId)
    {
      var jsonContent = new
      {
        hiRequest = new
        {
          transactionId = transactionId,
          sessionStatus = "ACKNOWLEDGED"
        },
        response = new
        {
          requestId = Guid.NewGuid().ToString(),
        }
      };

      var json = JsonSerializer.Serialize(jsonContent);
      await OnConsentsOnNotifyV3("https://dev.abdm.gov.in/hiecm", "/api/v3/data-flow/health-information/hip/on-request", json);
    }


    public async Task DataPushNotification(string transactionId)
    {
      var entry = new Entry
      {
        content = "",
        media = "application/fhir+json",
        checksum = "string",
        careContextReference = "DEMO-26-001"
      };

      var dhPublicKey = new
      {
        expiry = DateTime.Parse("2020-10-06T10:50:37.764Z"),
        parameters = "Curve25519/32byte random key",
        keyValue = ""
      };

      var keyMaterial = new
      {
        cryptoAlg = "ECDH",
        curve = "Curve25519",
        dhPublicKey = dhPublicKey,
        nonce = ""
      };

      var root = new
      {
        PageNumber = 0,
        PageCount = 1,
        TransactionId = "",
        Entries = new List<Entry> { entry },
        KeyMaterial = keyMaterial
      };

      var json = JsonSerializer.Serialize(root);
      await OnConsentsOnNotifyV3("https://dev.abdm.gov.in", "/patient-hiu/data/notification", json);
    }

    public async Task HealthInfoNotifyV3(string transactionId)
    {
      var statusResponse = new StatusResponse
      {
        careContextReference = "abc1",
        hiStatus = "DELIVERED",
        description = "test care context"
      };

      var statusNotification = new StatusNotification
      {
        sessionStatus = "TRANSFERRED",
        hipId = "S_TEST_FACILITY",
        statusResponses = new List<StatusResponse> { statusResponse }
      };

      var notifier = new
      {
        Type = "HIP",
        Id = "HIP_FLORENCE"
      };

      var root = new
      {
        notification = new
        {
          ConsentId = "eabb2d49-1e2f-4568-aebb-2692918be622",
          TransactionId = "42dfc569-7696-4b2f-9357-d388717900a8",
          DoneAt = DateTime.Parse("2023-05-24T10:51:08.374Z"),
          Notifier = notifier,
          StatusNotification = statusNotification
        }
      };

      var json = JsonSerializer.Serialize(root);
      await OnConsentsOnNotifyV3("https://dev.abdm.gov.in/hiecm", "/api/v3/data-flow/health-information/notify", json);
    }

    #endregion

    #endregion

  }
}
