using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class Question
{
  public int QuestionId { get; set; }

  public string QuestionText { get; set; } = null!;

  public int QuestionType { get; set; }

  public int QuestionnaireId { get; set; }

  public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

  public virtual ICollection<Option> Options { get; set; } = new List<Option>();
}
public class QuestionView
{
  public int AnswerId { get; set; }
  public int QuestionId { get; set; }
  public string QuestionText { get; set; } = null!;
  public string AnswerText { get; set; } = null!;
  public int? SelectedOptionId { get; set; }
  public string OptionText { get; set; } = null!;

  public int QuestionnaireId { get; set; }

  public string QuestionnaireName { get; set; }

}


