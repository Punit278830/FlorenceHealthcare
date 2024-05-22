using hospitalApiProject.Services.Interfaces.Shared;
using System.Net;

namespace hospitalApiProject.Services.Shared
{
  public abstract class SimpleServiceBase : ISimpleServiceBase
  {
    public string ErrorMessage { get; set; }
    public HttpStatusCode StatusCode { get; set; }


    public bool HasError
    {
      get { return !string.IsNullOrEmpty(ErrorMessage); }
    }
  }
}
