namespace Hospital.Models.Client.Response;

public class PagingList<T> : List<T>
{
    public PagingList() : base()
    {
    }

    public PagingList(IEnumerable<T> collection) : base(collection)
    {

    }

    public int TotalCount { get; set; }
}