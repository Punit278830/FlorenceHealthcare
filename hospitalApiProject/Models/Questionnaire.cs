namespace hospitalApiProject.Models;

public partial class Questionnaire
{
  public int QuestionnaireId { get; set; }

  public string QuestionnaireName { get; set; } = null!;

  public int QuestinaryDeptId { get; set; }
  public bool IsActive { get; set; }

  // Nullable HospitalId for multi-tenant support
  public int? HospitalId { get; set; }

}
