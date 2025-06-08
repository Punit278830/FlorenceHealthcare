using System.Net;

namespace hospitalApiProject.Services.Interfaces
{
  public interface ISimpleServiceBase
  {
    HttpStatusCode StatusCode { get; set; }
    string ErrorMessage { get; set; }
    bool HasError { get; }
  }
}
