using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class QuestionsController : ControllerBase
  {
    private readonly FlorenceDbContext _context;

    public QuestionsController(FlorenceDbContext context)
    {
      _context = context;
    }

    // GET: api/Questions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
    {
      return await _context.Questions.ToListAsync();
    }

    // GET: api/Questions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Question>> GetQuestion(int id)
    {
      var question = await _context.Questions.FindAsync(id);

      if (question == null)
      {
        return NotFound();
      }

      return question;
    }



    [HttpGet("questionnareId/{id}")]
    public async Task<ActionResult<IEnumerable<Question>>> GetQuestionByQuestionniareId(int id)
    {
      var question = await _context.Questions.Where(e => e.QuestionnaireId == id).ToListAsync();

      if (question == null)
      {
        return NotFound();
      }

      return question;
    }

    [HttpGet("questionnareId/{id}/{appointmentId}")]
    public async Task<ActionResult<IEnumerable<Question>>> GetQAByQuestionnaireAndAppointmentId(int id, int appointmentId)
    {
      // Fetch all options, answers, and questions in one go
      var options = await _context.Options.ToListAsync(); // Fetch all options at once

      var answers = await _context.Answers
          .Where(a => a.QuestionnaireId == id && a.AppointmentId == appointmentId)
          .ToListAsync(); // Fetch answers for the specific questionnaire and appointment

      // Fetch all questions associated with the questionnaire
      var questions = await _context.Questions
          .Where(q => q.QuestionnaireId == id)
          .ToListAsync(); // Fetch questions for the given questionnaire

      if (questions == null || !questions.Any())
      {
        return NotFound();
      }

      // Map options and answers to each question
      var combinedQuestions = questions.Select(question =>
      {
        // Filter options that belong to this specific question
        var questionOptions = options
            .Where(o => o.QuestionId == question.QuestionId)
            .Select(o => new Option
            {
              OptionId = o.OptionId,
              OptionText = o.OptionText,
              MapQuestionId = o.MapQuestionId
            })
            .ToList();

        // Get the latest answer for the question based on the appointment
        var latestAnswer = answers
            .Where(a => a.QuestionId == question.QuestionId)
            .OrderByDescending(a => a.AnswerId)
            .FirstOrDefault();

        // Return a fully mapped Question object
        return new Question
        {
          QuestionId = question.QuestionId,
          QuestionText = question.QuestionText,
          QuestionType = question.QuestionType,
          QuestionnaireId = question.QuestionnaireId,
          Options = questionOptions, // Attach the mapped options
          Answers = latestAnswer != null
                ? new List<Answer>
                {
                    new Answer
                    {
                        AnswerId = latestAnswer.AnswerId,
                        AnswerText = latestAnswer.AnswerText,
                        SelectedOptionId = latestAnswer.SelectedOptionId,
                        AppointmentId = appointmentId
                    }
                }
                : new List<Answer>() // Return an empty list if no answer is found
        };
      }).ToList();

      return Ok(combinedQuestions); // Return the list of questions with options and answers
    }

    [HttpGet("mappings/questionnareId/{id}/{appointmentId}")]
    public async Task<ActionResult<IEnumerable<QuestionFlatStructure>>> GetQuestionsAndAnswersMappings(int appointmentId)
    {
      // Fetch all options, answers, and questions for this appointment
      var options = await _context.Options.ToListAsync();
      var answers = await _context.Answers
          .Where(a => a.AppointmentId == appointmentId)
          .ToListAsync();

      // Fetch all questions that have answers in this appointment
      var questions = await _context.Questions
          .Where(q => answers.Select(a => a.QuestionId).Contains(q.QuestionId))
          .ToListAsync();

      // List to hold the flat structure of questions and answers
      var flatStructure = new List<QuestionFlatStructure>();

      foreach (var question in questions)
      {
        // Get the answer for the current question
        var answer = answers
            .Where(a => a.QuestionId == question.QuestionId)
            .OrderByDescending(a => a.AnswerId)
            .FirstOrDefault();

        // Get the selected option (if exists)
        var selectedOption = options
            .Where(o => o.OptionId == answer?.SelectedOptionId)
            .FirstOrDefault();

        // Create the flat structure for this question
        var flatQuestion = new QuestionFlatStructure
        {
          QuestionId = question.QuestionId,
          AnswerId = answer?.AnswerId,
          SelectedOptionId = answer?.SelectedOptionId,
          QuestionnaireId = question.QuestionnaireId,
          MappedQuestionId = selectedOption?.MapQuestionId
        };

        // Add the question to the flat structure list
        flatStructure.Add(flatQuestion);

        // If the selected option maps to another question (from the same or different questionnaire), recursively add the mapped questions to the structure
        if (selectedOption?.MapQuestionId != null)
        {
          await AddMappedQuestionsRecursively(flatStructure, selectedOption.MapQuestionId.Value, appointmentId, answers, options);
        }
      }

      // Return the flat structure
      return Ok(flatStructure);
    }

    // Recursive helper function to handle mapped questions across questionnaires
    private async Task AddMappedQuestionsRecursively(List<QuestionFlatStructure> flatStructure, int questionId, int appointmentId, List<Answer> answers, List<Option> options)
    {
      // Fetch the mapped question (could belong to a different questionnaire)
      var question = await _context.Questions.FirstOrDefaultAsync(q => q.QuestionId == questionId);

      if (question == null)
      {
        return;
      }

      // Get the answer for the mapped question
      var answer = answers
          .Where(a => a.QuestionId == question.QuestionId)
          .OrderByDescending(a => a.AnswerId)
          .FirstOrDefault();

      // Get the selected option for the mapped question
      var selectedOption = options
          .Where(o => o.OptionId == answer?.SelectedOptionId)
          .FirstOrDefault();

      // Create the flat structure for this mapped question
      var flatMappedQuestion = new QuestionFlatStructure
      {
        QuestionId = question.QuestionId,
        AnswerId = answer?.AnswerId,
        SelectedOptionId = answer?.SelectedOptionId,
        QuestionnaireId = question.QuestionnaireId,
        MappedQuestionId = selectedOption?.MapQuestionId
      };

      // Add the mapped question to the flat structure list
      flatStructure.Add(flatMappedQuestion);

      // If the selected option maps to another question, recursively add it to the structure
      if (selectedOption?.MapQuestionId != null)
      {
        await AddMappedQuestionsRecursively(flatStructure, selectedOption.MapQuestionId.Value, appointmentId, answers, options);
      }
    }


    // PUT: api/Questions/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutQuestion(int id, Question question)
    {
      if (id != question.QuestionId)
      {
        return BadRequest();
      }

      _context.Entry(question).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!QuestionExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // POST: api/Questions
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Question>> PostQuestion(Question question)
    {
      _context.Questions.Add(question);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetQuestion", new { id = question.QuestionId }, question);
    }


    //Api to display submit question by appointment id 
    [HttpGet("appointmentId/{appointmentId}")]
    public async Task<List<QuestionView>> GetQuestionAnswerPairsByAppointmentId(int appointmentId)
    {
      var query = from q in _context.Questions
                  join a in _context.Answers on q.QuestionId equals a.QuestionId
                  join qr in _context.Questionnaires on q.QuestionnaireId equals qr.QuestionnaireId
                  join o in _context.Options on a.SelectedOptionId equals o.OptionId into optionGroup // Group join with Options table
                  from o in optionGroup.DefaultIfEmpty() // Perform left join
                  where a.AppointmentId == appointmentId
                        //&& a.QuestionnaireId == qr.QuestionnaireId // Ensure the questionnaireId matches
                  select new QuestionView
                  {
                    AnswerId = a.AnswerId,
                    QuestionId = q.QuestionId,
                    QuestionText = q.QuestionText,
                    AnswerText = a.AnswerText ?? "", // Provide a default value when AnswerText is null
                    SelectedOptionId = a.SelectedOptionId ?? 0, // Provide a default value when SelectedOptionId is null
                    OptionText = o.OptionText ?? "", // Provide a default value when OptionText is null
                    QuestionnaireId = q.QuestionnaireId,
                    QuestionnaireName = qr.QuestionnaireName // Add this line to include the QuestionnaireName
                  };

      var res = await query.AsNoTracking().ToListAsync();

      return res;
    }



    [HttpGet("appointmentId1/{appointmentId}")]
    public async Task<List<QuestionView>> GetQuestionAnswerPairsByAppointmentId1(int appointmentId)
    {
      var query = from q in _context.Questions
                  join a in _context.Answers on q.QuestionId equals a.QuestionId
                  join qr in _context.Questionnaires on q.QuestionnaireId equals qr.QuestionnaireId
                  join o in _context.Options on a.SelectedOptionId equals o.OptionId into optionGroup // Group join with Options table
                  from o in optionGroup.DefaultIfEmpty() // Left join to include questions without selected options
                  where a.AppointmentId == appointmentId
                  select new QuestionView
                  {
                    AnswerId = a.AnswerId,
                    QuestionId = q.QuestionId,
                    QuestionText = q.QuestionText,
                    QuestionType = "", // Indicating whether it is a text question or a multiple-choice question
                    AnswerText = a.AnswerText ?? "", // Provide a default value when AnswerText is null (for text-based answers)
                    SelectedOptionId = a.SelectedOptionId ?? 0, // Provide a default value when SelectedOptionId is null
                    OptionText = o.OptionText ?? "", // Provide a default value when OptionText is null
                    QuestionnaireId = q.QuestionnaireId,
                    QuestionnaireName = qr.QuestionnaireName // Fetching the name of the questionnaire
                  };

      // Execute the query asynchronously
      var result = await query.AsNoTracking().ToListAsync();

      return result;
    }

    [HttpGet("appointmentId2/{appointmentId}")]
    public async Task<List<QuestionView>> GetQuestionAnswerPairsByAppointmentId2(int appointmentId)
    {
      // Fetch main questions and their answers
      var mainQuery = from q in _context.Questions
                      join a in _context.Answers on q.QuestionId equals a.QuestionId
                      join qr in _context.Questionnaires on q.QuestionnaireId equals qr.QuestionnaireId
                      join o in _context.Options on a.SelectedOptionId equals o.OptionId into optionGroup // Left join with Options
                      from o in optionGroup.DefaultIfEmpty()
                      where a.AppointmentId == appointmentId
                      select new QuestionView
                      {
                        AnswerId = a.AnswerId,
                        QuestionId = q.QuestionId,
                        QuestionText = q.QuestionText,
                        QuestionType = "",
                        AnswerText = a.AnswerText ?? "",
                        SelectedOptionId = a.SelectedOptionId ?? 0,
                        OptionText = o.OptionText ?? "",
                        QuestionnaireId = q.QuestionnaireId,
                        QuestionnaireName = qr.QuestionnaireName,
                        MappedQuestionId = o.MapQuestionId.Value // If this option maps to another question, include it
                      };

      var mainQuestions = await mainQuery.AsNoTracking().ToListAsync();

      // Collect all mapped question IDs from the selected options
      var mappedQuestionIds = mainQuestions
          .Where(q => q.MappedQuestionId != 0)
          .Select(q => q.MappedQuestionId)
          .Distinct()
          .ToList();

      // Fetch mapped questions and their answers
      var mappedQuery = from q in _context.Questions
                        join a in _context.Answers on q.QuestionId equals a.QuestionId
                        join qr in _context.Questionnaires on q.QuestionnaireId equals qr.QuestionnaireId
                        join o in _context.Options on a.SelectedOptionId equals o.OptionId into optionGroup // Left join with Options
                        from o in optionGroup.DefaultIfEmpty()
                        where mappedQuestionIds.Contains(q.QuestionId) && a.AppointmentId == appointmentId
                        select new QuestionView
                        {
                          AnswerId = a.AnswerId,
                          QuestionId = q.QuestionId,
                          QuestionText = q.QuestionText,
                          QuestionType = "",
                          AnswerText = a.AnswerText ?? "",
                          SelectedOptionId = a.SelectedOptionId ?? 0,
                          OptionText = o.OptionText ?? "",
                          QuestionnaireId = q.QuestionnaireId,
                          QuestionnaireName = qr.QuestionnaireName
                        };

      var mappedQuestions = await mappedQuery.AsNoTracking().ToListAsync();

      // Combine main and mapped questions
      var result = mainQuestions.Concat(mappedQuestions).ToList();

      return result;
    }

    [HttpGet("answers/questionnareId/{id}/{appointmentId}")]
    public async Task<List<Answer>> GetLatestUniqueAnswersAsync(int id, int appointmentId)
    {
      // First, filter the answers based on the appointmentId and questionnaireId
      var filteredAnswers = _context.Answers
          .Where(a => a.AppointmentId == appointmentId && a.QuestionnaireId == id);

      // Group by QuestionId and SelectedOptionId
      var latestAnswers = await filteredAnswers
          .GroupBy(a => new { a.QuestionId, a.SelectedOptionId })
          .Select(g => g.OrderByDescending(a => a.AnswerId).FirstOrDefault())
          .ToListAsync();

      return latestAnswers;
    }

    [HttpGet("answers/{appointmentId}")]

    public async Task<List<QuestionWithAnswer>> GetQuestionsWithAnswersAsync(int appointmentId)
    {
      var query = from q in _context.Questions
                  join a in _context.Answers
                  on q.QuestionId equals a.QuestionId into answersGroup
                  from a in answersGroup
                      .Where(a => a.AppointmentId == appointmentId)
                      .DefaultIfEmpty()
                  select new QuestionWithAnswer
                  {
                    QuestionId = q.QuestionId,
                    QuestionText = q.QuestionText,
                    QuestionType = "",
                    AnswerId = a != null ? a.AnswerId : (int?)null, // Conditional handling for nullable AnswerId
                    AnswerText = a != null ? a.AnswerText : null // Conditional handling for nullable AnswerText
                  };

      var result = await query.ToListAsync();

      return result;
    }


    // DELETE: api/Questions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
      var question = await _context.Questions.FindAsync(id);
      if (question == null)
      {
        return NotFound();
      }

      _context.Questions.Remove(question);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool QuestionExists(int id)
    {
      return _context.Questions.Any(e => e.QuestionId == id);
    }

    [HttpGet("test/{id}/{appointmentId}")]

    public async Task<ActionResult<IEnumerable<Question>>> GetQAByAppointmentId(int id, int appointmentId)
    {
      // Fetch all options, answers, and questions in one go
      var options = await _context.Options.ToListAsync(); // Fetch all options at once

      var answers = await _context.Answers
          .Where(a => a.QuestionnaireId == id && a.AppointmentId == appointmentId)
          .ToListAsync(); // Fetch answers for the specific questionnaire and appointment

      // Fetch all questions associated with the questionnaire
      var questions = await _context.Questions
          .Where(q => q.QuestionnaireId == id)
          .ToListAsync(); // Fetch questions for the given questionnaire

      if (questions == null || !questions.Any())
      {
        return NotFound();
      }

      // Fetch all available questions from the database to handle mapped questions
      var allQuestions = await _context.Questions.ToListAsync(); // Fetch all questions from all questionnaires

      // Map options and answers to each question
      var combinedQuestions = questions.Select(question =>
      {
        // Filter options that belong to this specific question
        var questionOptions = options
            .Where(o => o.QuestionId == question.QuestionId)
            .Select(o => new Option
            {
              OptionId = o.OptionId,
              OptionText = o.OptionText,
              MapQuestionId = o.MapQuestionId
            })
            .ToList();

        // Get the latest answer for the question based on the appointment
        var latestAnswer = answers
            .Where(a => a.QuestionId == question.QuestionId)
            .OrderByDescending(a => a.AnswerId)
            .FirstOrDefault();

        // Fetch mapped questions for each option, if MapQuestionId is present
        var mappedQuestions = questionOptions
            .Where(o => o.MapQuestionId.HasValue) // Only for options that map to another question
            .Select(o =>
            {
              // Fetch the mapped question from all available questions
              var mappedQuestion = allQuestions.FirstOrDefault(q => q.QuestionId == o.MapQuestionId.Value);
              return mappedQuestion;
            })
            .Where(q => q != null)
            .ToList();

        // Return a fully mapped Question object, including mapped questions
        return new Question
        {
          QuestionId = question.QuestionId,
          QuestionText = question.QuestionText,
          QuestionType = question.QuestionType,
          QuestionnaireId = question.QuestionnaireId,
          Options = questionOptions, // Attach the mapped options
          Answers = latestAnswer != null
                ? new List<Answer>
                {
                    new Answer
                    {
                        AnswerId = latestAnswer.AnswerId,
                        AnswerText = latestAnswer.AnswerText,
                        SelectedOptionId = latestAnswer.SelectedOptionId,
                        AppointmentId = appointmentId
                    }
                }
                : new List<Answer>(), // Return an empty list if no answer is found
          MappedQuestions = mappedQuestions // Add the mapped questions
        };
      }).ToList();

      return Ok(combinedQuestions); // Return the list of questions with options, answers, and mapped questions
    }
  }
}
