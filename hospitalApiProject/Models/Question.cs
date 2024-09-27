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

  public List<Question> MappedQuestions { get; set; } = new List<Question>();
}
public class QuestionView
{
  public int AnswerId { get; set; }
  public int QuestionId { get; set; }
  public string QuestionText { get; set; }
  public string QuestionType { get; set; }
  public string AnswerText { get; set; } // For text-based answers
  public int SelectedOptionId { get; set; } // For multiple-choice answers
  public string OptionText { get; set; } // For multiple-choice option text
  public int QuestionnaireId { get; set; }
  public string QuestionnaireName { get; set; }
  public int MappedQuestionId { get; set; } // The question ID this option maps to (if any)
}

public class QuestionWithAnswer
{
  public int QuestionId { get; set; }
  public string QuestionText { get; set; }
  public string QuestionType { get; set; } // Assuming you have a QuestionType field
  public int? AnswerId { get; set; } // Nullable to handle cases where no answer is present
  public string AnswerText { get; set; } // Nullable to handle cases where no answer is present
}

public class QuestionFlatStructure
{
  public int QuestionId { get; set; }
  public int? AnswerId { get; set; }
  public int? SelectedOptionId { get; set; }
  public int QuestionnaireId { get; set; }
  public int? MappedQuestionId { get; set; } // This shows which question is mapped to this option (if any)
}

