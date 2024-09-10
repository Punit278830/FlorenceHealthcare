using hospitalApiProject.Models;
using hospitalApiProject.Models.Abha;
using hospitalApiProject.Models.Abha.response;
using hospitalApiProject.Services.Interfaces.Shared;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace hospitalApiProject.Services.Abha
{
  public interface IAbhaService : ISimpleServiceBase
  {

    Task<string> GenerateOtp(string aadhar);

    Task<string> GenerateOtherOtp(string mobile, string txnId);

    Task<string> GenerateMobileOtp(string mobile);

    Task<string> EnrollByAadhaar(string txnId, string otp, string mobileNumber);

    Task<string> EnrollByAbdm(string txnId, string otp);

    Task<string> ConfirmMobileOtpForAbhaAddress(string otp, string txnId);

    Task<string> GetAbhaAddressSuggestion(string txnId);

    Task<byte[]> DownloadAbhaCard(string xToken);

    Task<string> SearchUserByHealthId(string healhtIdNumber);
    Task<string> AbhaAddressViaAbhaOtp(string healhtIdNumber, string authMethod);

    Task<string> AbhaAddressViaAbhaVerifyOTP(string txnId, string data);

    Task<string> AbhaAddressSuggestions(string txnId);

    Task<string> GetAbhaAddressExists(string phrAddress);

    Task<string> CreatePHRAddress(string phrAddress, string txnId);

    Task<string> CreateAbhaDetails(AbhaDetailsRequest data);

    Task<string> CreateAbhaAddressViaMobile(string phrAddress, string txnId);

    Task<string> ShareProfile(PatientShareRequest request);

    Task AddAbhaPatientProfile(PatientProfile request);

    Task ConsentsOnNotifyV3(string request);

    //Task<ActionResult<List<AbhaPatientDetails>>> GetScannedPatients();

    Task FetchModes(string abhaAddress);

    Task AbhaAddressAuthInit(string authMode);

    Task AbhaAddressAuthConfirm(string authId, string authCode);
  }
}
