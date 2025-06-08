using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        // GET: api/Invoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices()
        {
            var invoices = await _invoiceService.GetAllInvoicesAsync();
            return Ok(invoices);
        }

        // GET: api/Invoice/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(id);

            if (invoice == null)
            {
                return NotFound();
            }

            return invoice;
        }

        // GET: api/Invoice/info/5
        [HttpGet("info/{id}")]
        public async Task<ActionResult<InvoiceInfoDetail>> GetInvoiceInfo(int id)
        {
            var invoiceInfo = await _invoiceService.GetInvoiceInfoByIdAsync(id);

            if (invoiceInfo == null)
            {
                return NotFound();
            }

            return invoiceInfo;
        }

        // GET: api/Invoice/patient/5
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoicesByPatientId(int patientId)
        {
            var invoices = await _invoiceService.GetInvoicesByPatientIdAsync(patientId);
            return Ok(invoices);
        }

        // PUT: api/Invoice/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoice(int id, Invoice invoice)
        {
            try
            {
                await _invoiceService.UpdateInvoiceAsync(id, invoice);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // POST: api/Invoice
        [HttpPost]
        public async Task<ActionResult<Invoice>> PostInvoice(Invoice invoice)
        {
            var createdInvoice = await _invoiceService.CreateInvoiceAsync(invoice);
            return CreatedAtAction("GetInvoice", new { id = createdInvoice.InvoiceId }, createdInvoice);
        }

        // DELETE: api/Invoice/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            try
            {
                await _invoiceService.DeleteInvoiceAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 