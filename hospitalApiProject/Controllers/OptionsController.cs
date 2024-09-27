using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using Microsoft.Extensions.Hosting;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class OptionsController : ControllerBase
  {
    private readonly FlorenceDbContext _context;

    public OptionsController(FlorenceDbContext context)
    {
      _context = context;
    }

    // GET: api/Options
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Option>>> GetOptions()
    {
      return await _context.Options.ToListAsync();
    }

    // GET: api/Options/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Option>> GetOption(int id)
    {
      var option = await _context.Options.FindAsync(id);

      if (option == null)
      {
        return NotFound();
      }

      return option;
    }

    // GET: api/Options/ByAppointmentId/{appointmentId}
    [HttpGet("ByAppointmentId/{appointmentId}")]
    public async Task<ActionResult<Option>> GetOptionsByAppointmentId(int appointmentId)
    {
      // Fetch all options
      var options = await _context.Options.ToListAsync();

      // Fetch all answers for the specific appointment
      var answers = await _context.Answers
          .Where(a => a.AppointmentId == appointmentId)
          .ToListAsync();

      // Map options with the corresponding AnswerId
      var optionsWithAnswerIds = options.Select(option =>
      {
        // Find the corresponding answer for the current option (if any)
        var answer = answers.FirstOrDefault(a => a.SelectedOptionId == option.OptionId);

        return new Option
        {
          OptionId = option.OptionId,
          QuestionId = option.QuestionId,
          OptionText = option.OptionText,
          MapQuestionId = option.MapQuestionId,
          Answers = answer != null
          ? [
            new Answer {
                AnswerId = answer.AnswerId,
                AnswerText = answer.AnswerText
            }
        ]
        : new List<Answer>() // Return an empty list if no answer is found // Assign AnswerId if found, otherwise null
        };
      }).ToList();

      return Ok(optionsWithAnswerIds);
    }


    // PUT: api/Options/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutOption(int id, Option option)
    {
      if (id != option.OptionId)
      {
        return BadRequest();
      }

      _context.Entry(option).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!OptionExists(id))
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

    // POST: api/Options
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Option>> PostOption(List<Option> options)
    {
      if (options.Count == 0)
      {
        return NoContent();
      }
      foreach (var option in options)
      {
        _context.Options.Add(option);
      }
      await _context.SaveChangesAsync();

      return CreatedAtAction(nameof(PostOption), options);
    }

    // DELETE: api/Options/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOption(int id)
    {
      var option = await _context.Options.FindAsync(id);
      if (option == null)
      {
        return NotFound();
      }

      _context.Options.Remove(option);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool OptionExists(int id)
    {
      return _context.Options.Any(e => e.OptionId == id);
    }
  }
}
