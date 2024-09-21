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


    [HttpGet("questionnareId/{id}/{appointmentId}")]
    public async Task<ActionResult<IEnumerable<Question>>> GetQASelections(int id, int appointmentId)
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
  }
}
