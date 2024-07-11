using hospitalApiProject.Models;
using hospitalApiProject.Models.Abha;
using hospitalApiProject.Models.Abha.M2;
using hospitalApiProject.Services.Interfaces.Shared;

namespace hospitalApiProject.Services.Abha
{
  public interface IAbhaM2Service : ISimpleServiceBase
  {
    Task<string> LinkCareContext(CareContextModel data);

    Task<string> NotifyMobile(CareContextModel data);



  }
}
