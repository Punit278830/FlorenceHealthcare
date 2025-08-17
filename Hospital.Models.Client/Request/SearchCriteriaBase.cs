namespace Hospital.Models.Client.Request;

public class SearchCriteriaBase
{
    public string SortField { get; set; }

    public Enumerations.SortDirection SortDirection { get; set; }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public SearchCriteriaBase()
    {
        SortField = string.Empty;
        SortDirection = Enumerations.SortDirection.Ascending;
        PageNumber = 1;
        PageSize = 10;
    }

}
