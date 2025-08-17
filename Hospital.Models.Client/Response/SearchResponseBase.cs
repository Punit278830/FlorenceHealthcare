namespace Hospital.Models.Client.Response;

public class SearchResponseBase<T> where T : class
{
    public string ErrorMessage { get; set; }

    public bool HasError
    {
        get { return !string.IsNullOrEmpty(this.ErrorMessage); }
    }

    public List<T> Results { get; set; }

    public int TotalCount { get; set; }

    public int TotalPages { get; set; }
}
