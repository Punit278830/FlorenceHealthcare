using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class Questionnaire
{
  public int QuestionnaireId { get; set; }

  public string QuestionnaireName { get; set; } = null!;

  public int QuestinaryDeptId { get; set; }

  public bool IsActive { get; set; }
}
