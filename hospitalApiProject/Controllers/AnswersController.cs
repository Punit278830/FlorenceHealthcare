using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using Microsoft.Extensions.Options;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswersController : WithHospitalController
    {
        public AnswersController(FlorenceDbContext context) : base(context)
        {
        }

        // GET: api/Answers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Answer>>> GetAnswers()
        {
            var hospitalId = GetHospitalIdFromHeader();
            var query = _context.Answers.AsQueryable();
            if (hospitalId != null)
            {
                query = query.Where(a => a.HospitalId == hospitalId);
            }
            return await query.ToListAsync();
        }

        // GET: api/Answers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Answer>> GetAnswer(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var answer = await _context.Answers.FirstOrDefaultAsync(a => a.AnswerId == id && (hospitalId == null || a.HospitalId == hospitalId));

            if (answer == null)
            {
                return NotFound();
            }

            return answer;
        }
    [HttpPut("update")]
    public async Task<IActionResult> UpdateAnswers([FromQuery] int appId, [FromQuery] int qId, [FromBody] List<Answer> answers)
    {
      if (answers == null || answers.Count == 0)
      {
        return BadRequest("No answers provided.");
      }

      var hospitalId = GetHospitalIdFromHeader();

      // Find and remove existing answers that match the AppointmentId and QuestionnaireId
      var existingAnswers = _context.Answers
          .Where(a => a.AppointmentId == appId && a.Question.QuestionnaireId == qId && (hospitalId == null || a.HospitalId == hospitalId))
          .ToList();

      _context.Answers.RemoveRange(existingAnswers);

      // Add the new list of answers
      foreach (var ans in answers)
      {
        ans.HospitalId = hospitalId; // tag hospital if provided
      }
      _context.Answers.AddRange(answers);

      // Save the changes
      await _context.SaveChangesAsync();

      return NoContent();
    }





    // PUT: api/Answers/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
        public async Task<IActionResult> PutAnswer(int id, Answer answer)
        {
            if (id != answer.AnswerId)
            {
                return BadRequest();
            }

            var hospitalId = GetHospitalIdFromHeader();
            if (hospitalId != null) answer.HospitalId = hospitalId;

            _context.Entry(answer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnswerExists(id))
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

        // POST: api/Answers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Answer>> PostAnswer(List<Answer> answers)
        {

            if (answers.Count == 0)
            {
                return NoContent();
            }
            var hospitalId = GetHospitalIdFromHeader();
            foreach (var answer in answers)
            {
                answer.HospitalId = hospitalId;
                _context.Answers.Add(answer);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostAnswer), answers);
        }

        // DELETE: api/Answers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnswer(int id)
        {
            var hospitalId = GetHospitalIdFromHeader();
            var answer = await _context.Answers.FirstOrDefaultAsync(a => a.AnswerId == id && (hospitalId == null || a.HospitalId == hospitalId));
            if (answer == null)
            {
                return NotFound();
            }

            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AnswerExists(int id)
        {
            return _context.Answers.Any(e => e.AnswerId == id);
        }
    }
}
