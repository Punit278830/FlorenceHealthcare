using hospitalApiProject.Services.Interfaces;
using System.Net;

namespace hospitalApiProject.Services.Implementations
{
  public abstract class SimpleServiceBase : ISimpleServiceBase
  {
    public HttpStatusCode StatusCode { get; set; }
    public string ErrorMessage { get; set; }
    public bool HasError => !string.IsNullOrEmpty(ErrorMessage);
  }
}
