using hospitalApiProject.Services.Interfaces;
using System.Net;

namespace hospitalApiProject.Services.Implementations
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
