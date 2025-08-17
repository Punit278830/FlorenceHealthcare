namespace Hospital.Models.Client.Response;

public class ResponseBase<T> where T : class
{
    public string ErrorMessage { get; set; }

    public bool HasError
    {
        get { return !string.IsNullOrEmpty(this.ErrorMessage); }
    }

    public T Message { get; set; }
}
