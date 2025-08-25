using System;
using System.Collections.Generic;

namespace hospitalApiProject.Models;

public partial class Answer
{
    public int AnswerId { get; set; }

    public int? QuestionId { get; set; }

    public int? ParticipantId { get; set; }

    public string? AnswerText { get; set; }

    public int? SelectedOptionId { get; set; }

    public int AppointmentId { get; set; }

    public virtual Question? Question { get; set; }

    public virtual Option? SelectedOption { get; set; }

    // Nullable HospitalId for multi-tenant support
    public int? HospitalId { get; set; }
}
