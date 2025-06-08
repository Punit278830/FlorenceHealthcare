using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiagnosisTemplateMastersController : ControllerBase
    {
        private readonly IDiagnosisTemplateMasterService _diagnosisTemplateMasterService;

        public DiagnosisTemplateMastersController(IDiagnosisTemplateMasterService diagnosisTemplateMasterService)
        {
            _diagnosisTemplateMasterService = diagnosisTemplateMasterService;
        }

        // GET: api/DiagnosisTemplateMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DiagnosisTemplateMaster>>> GetDiagnosisTemplateMasters()
        {
            var templates = await _diagnosisTemplateMasterService.GetAllDiagnosisTemplateMastersAsync();
            return Ok(templates);
        }

        // GET: api/DiagnosisTemplateMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DiagnosisTemplateMaster>> GetDiagnosisTemplateMaster(int id)
        {
            var diagnosisTemplateMaster = await _diagnosisTemplateMasterService.GetDiagnosisTemplateMasterByIdAsync(id);

            if (diagnosisTemplateMaster == null)
            {
                return NotFound();
            }

            return diagnosisTemplateMaster;
        }

        // PUT: api/DiagnosisTemplateMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiagnosisTemplateMaster(int id, DiagnosisTemplateMaster diagnosisTemplateMaster)
        {
            try
            {
                await _diagnosisTemplateMasterService.UpdateDiagnosisTemplateMasterAsync(id, diagnosisTemplateMaster);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
        }

        // POST: api/DiagnosisTemplateMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DiagnosisTemplateMaster>> PostDiagnosisTemplateMaster(DiagnosisTemplateMaster diagnosisTemplateMaster)
        {
            var createdTemplate = await _diagnosisTemplateMasterService.CreateDiagnosisTemplateMasterAsync(diagnosisTemplateMaster);
            return CreatedAtAction("GetDiagnosisTemplateMaster", new { id = createdTemplate.Id }, createdTemplate);
        }

        // DELETE: api/DiagnosisTemplateMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiagnosisTemplateMaster(int id)
        {
            try
            {
                await _diagnosisTemplateMasterService.DeleteDiagnosisTemplateMasterAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
