using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using hospitalApiProject.Controllers.Base;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class QuestionnairesController : WithHospitalController
  {
    public QuestionnairesController(FlorenceDbContext context) : base(context)
    {
    }

    // GET: api/Questionnaires
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Questionnaire>>> GetQuestionnaires()
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.Questionnaires.AsQueryable();
      if (hospitalId != null)
      {
        query = query.Where(q => q.HospitalId == hospitalId);
      }
      return await query.OrderByDescending(q => q.QuestionnaireId).ToListAsync();
    }

    // GET: api/Questionnaires/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Questionnaire>> GetQuestionnaire(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var questionnaire = await _context.Questionnaires.FirstOrDefaultAsync(q => q.QuestionnaireId == id && (hospitalId == null || q.HospitalId == hospitalId));

      if (questionnaire == null)
      {
        return NotFound();
      }

      return questionnaire;
    }


    //Get Questionnaire by department id

    [HttpGet("departmentId/{id}")]
    public async Task<ActionResult<IEnumerable<Questionnaire>>> GetQuestionnaireByDepartmentId(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.Questionnaires.Where(e => e.QuestinaryDeptId == id);
      if (hospitalId != null)
      {
        query = query.Where(q => q.HospitalId == hospitalId);
      }
      var questionnaire = await query.ToListAsync();

      if (questionnaire == null)
      {
        return NotFound();
      }

      return questionnaire;
    }



    // PUT: api/Questionnaires/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutQuestionnaire(int id, Questionnaire questionnaire)
    {
      if (id != questionnaire.QuestionnaireId)
      {
        return BadRequest();
      }

      // Tag with HospitalId if header provided
      var hospitalId = GetHospitalIdFromHeader();
      if (hospitalId != null) questionnaire.HospitalId = hospitalId;

      questionnaire.IsActive = !questionnaire.IsActive;
      _context.Entry(questionnaire).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!QuestionnaireExists(id))
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

    // POST: api/Questionnaires
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Questionnaire>> PostQuestionnaire(Questionnaire questionnaire)
    {
      questionnaire.IsActive = true;
      var hospitalId = GetHospitalIdFromHeader();
      questionnaire.HospitalId = hospitalId;
      _context.Questionnaires.Add(questionnaire);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetQuestionnaire", new { id = questionnaire.QuestionnaireId }, questionnaire);
    }

    // DELETE: api/Questionnaires/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuestionnaire(int id)
    {
      var hospitalId = GetHospitalIdFromHeader();
      var questionnaire = await _context.Questionnaires.FirstOrDefaultAsync(q => q.QuestionnaireId == id && (hospitalId == null || q.HospitalId == hospitalId));
      if (questionnaire == null)
      {
        return NotFound();
      }

      _context.Questionnaires.Remove(questionnaire);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool QuestionnaireExists(int id)
    {
      return _context.Questionnaires.Any(e => e.QuestionnaireId == id);
    }
  }
}
