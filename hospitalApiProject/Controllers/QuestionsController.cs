using hospitalApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class QuestionsController : WithHospitalController
  {
    public QuestionsController(FlorenceDbContext context) : base(context)
    {
    }

    // GET: api/Questions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.Questions.AsQueryable();
      if (hospitalId != null)
      {
        query = query.Where(q => q.HospitalId == hospitalId);
      }
      return await query.ToListAsync();
    }

    // GET: api/Questions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Question>> GetQuestion(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var question = await _context.Questions.FirstOrDefaultAsync(q => q.QuestionId == id && (hospitalId == null || q.HospitalId == hospitalId));

      if (question == null)
      {
        return NotFound();
      }

      return question;
    }



    [HttpGet("questionnareId/{id}")]
    public async Task<ActionResult<IEnumerable<Question>>> GetQuestionByQuestionniareId(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.Questions.Where(e => e.QuestionnaireId == id);
      if (hospitalId != null)
      {
        query = query.Where(q => q.HospitalId == hospitalId);
      }
      var question = await query.ToListAsync();

      if (question == null)
      {
        return NotFound();
      }

      return question;
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

      // Tag with HospitalId if provided
      var hospitalId = GetHospitalIdFromHeader();
      if (hospitalId != null) question.HospitalId = hospitalId;

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
      var hospitalId = GetHospitalIdFromHeader();
      question.HospitalId = hospitalId;
      _context.Questions.Add(question);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetQuestion", new { id = question.QuestionId }, question);
    }


    //Api to display submit question by appointment id 
    [HttpGet("appointmentId/{appointmentId}")]
    public async Task<List<QuestionView>> GetQuestionAnswerPairsByAppointmentId(int appointmentId)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = from q in _context.Questions
                  join a in _context.Answers on q.QuestionId equals a.QuestionId
                  join qr in _context.Questionnaires on q.QuestionnaireId equals qr.QuestionnaireId
                  join o in _context.Options on a.SelectedOptionId equals o.OptionId into optionGroup // Group join with Options table
                  from o in optionGroup.DefaultIfEmpty() // Perform left join
                  where a.AppointmentId == appointmentId && (hospitalId == null || q.HospitalId == hospitalId)
                  select new QuestionView
                  {
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
      var hospitalId = GetHospitalIdFromHeader();
      var question = await _context.Questions.FirstOrDefaultAsync(q => q.QuestionId == id && (hospitalId == null || q.HospitalId == hospitalId));
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
