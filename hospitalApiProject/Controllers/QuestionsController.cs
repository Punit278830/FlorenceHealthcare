using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;

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
                  join o in _context.Options on a.SelectedOptionId equals o.OptionId into optionGroup // Group join with Options table
                  from o in optionGroup.DefaultIfEmpty() // Perform left join
                  where a.AppointmentId == appointmentId
                  select new QuestionView
                  {
                    QuestionId = q.QuestionId,
                    QuestionText = q.QuestionText,
                    AnswerText = a.AnswerText ?? "", // Provide a default value when AnswerText is null
                    SelectedOptionId = a.SelectedOptionId ?? 0, // Provide a default value when SelectedOptionId is null
                    OptionText = o.OptionText ?? "", // Provide a default value when OptionText is null
                    QuestionnaireId = q.QuestionnaireId
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
