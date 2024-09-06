using hospitalApiProject.Models;
using hospitalApiProject.Models.Abha;
using hospitalApiProject.Models.Abha.M2;
using hospitalApiProject.Services.Interfaces.Shared;

namespace hospitalApiProject.Services.Abha
{
  public interface IAbhaM2Service : ISimpleServiceBase
  {
    Task LinkCareContext(CareContextModel data);

    Task NotifyContext(CareContextModel data);

    Task NotifyMobile(CareContextModel data);

    Task OnDiscover(OnDiscoverModel data);

    Task OnDiscoverV1(OnDiscoverModel data);

    Task LinkOnInit(CareContextModel data);

    Task LinkOnConfirm(CareContextModel data);

    Task ConsentsOnNotify(CareContextModel data);
    Task HealthInfoOnRequest(CareContextModel data);
    Task DataTransferNotification(CareContextModel data);
    Task HealthInfoNotify(CareContextModel data);



  }
}
