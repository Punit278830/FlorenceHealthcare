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
    public class QuestionnairesController : ControllerBase
    {
        private readonly FlorenceDbContext _context;

        public QuestionnairesController(FlorenceDbContext context)
        {
            _context = context;
        }

        // GET: api/Questionnaires
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Questionnaire>>> GetQuestionnaires()
        {
            return await _context.Questionnaires.ToListAsync();
        }

        // GET: api/Questionnaires/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Questionnaire>> GetQuestionnaire(int id)
        {
            var questionnaire = await _context.Questionnaires.FindAsync(id);

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
            var questionnaire = await _context.Questionnaires.Where(e => e.QuestinaryDeptId == id).ToListAsync();

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
            _context.Questionnaires.Add(questionnaire);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionnaire", new { id = questionnaire.QuestionnaireId }, questionnaire);
        }

        // DELETE: api/Questionnaires/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionnaire(int id)
        {
            var questionnaire = await _context.Questionnaires.FindAsync(id);
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
