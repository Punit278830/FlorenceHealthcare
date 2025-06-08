using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentInfoController : ControllerBase
    {
        private readonly IPaymentInfoService _paymentInfoService;

        public PaymentInfoController(IPaymentInfoService paymentInfoService)
        {
            _paymentInfoService = paymentInfoService;
        }

        // GET: api/PaymentInfo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentInfo>>> GetPaymentInfos()
        {
            var paymentInfos = await _paymentInfoService.GetAllPaymentInfosAsync();
            return Ok(paymentInfos);
        }

        // GET: api/PaymentInfo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentInfo>> GetPaymentInfo(int id)
        {
            var paymentInfo = await _paymentInfoService.GetPaymentInfoByIdAsync(id);

            if (paymentInfo == null)
            {
                return NotFound();
            }

            return paymentInfo;
        }

        // GET: api/PaymentInfo/invoice/5
        [HttpGet("invoice/{invoiceId}")]
        public async Task<ActionResult<IEnumerable<PaymentInfo>>> GetPaymentInfosByInvoiceId(int invoiceId)
        {
            var paymentInfos = await _paymentInfoService.GetPaymentInfosByInvoiceIdAsync(invoiceId);
            return Ok(paymentInfos);
        }

        // PUT: api/PaymentInfo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymentInfo(int id, PaymentInfo paymentInfo)
        {
            try
            {
                await _paymentInfoService.UpdatePaymentInfoAsync(id, paymentInfo);
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

        // POST: api/PaymentInfo
        [HttpPost]
        public async Task<ActionResult<PaymentInfo>> PostPaymentInfo(PaymentInfo paymentInfo)
        {
            var createdPaymentInfo = await _paymentInfoService.CreatePaymentInfoAsync(paymentInfo);
            return CreatedAtAction("GetPaymentInfo", new { id = createdPaymentInfo.PaymentId }, createdPaymentInfo);
        }

        // DELETE: api/PaymentInfo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentInfo(int id)
        {
            try
            {
                await _paymentInfoService.DeletePaymentInfoAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 