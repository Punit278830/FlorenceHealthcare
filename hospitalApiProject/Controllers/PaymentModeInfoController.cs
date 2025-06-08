using hospitalApiProject.Models;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentModeInfoController : ControllerBase
    {
        private readonly IPaymentModeInfoService _paymentModeInfoService;

        public PaymentModeInfoController(IPaymentModeInfoService paymentModeInfoService)
        {
            _paymentModeInfoService = paymentModeInfoService;
        }

        // GET: api/PaymentModeInfo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentModeInfo>>> GetPaymentModeInfos()
        {
            var paymentModeInfos = await _paymentModeInfoService.GetAllPaymentModeInfosAsync();
            return Ok(paymentModeInfos);
        }

        // GET: api/PaymentModeInfo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentModeInfo>> GetPaymentModeInfo(int id)
        {
            var paymentModeInfo = await _paymentModeInfoService.GetPaymentModeInfoByIdAsync(id);

            if (paymentModeInfo == null)
            {
                return NotFound();
            }

            return paymentModeInfo;
        }

        // GET: api/PaymentModeInfo/invoice/5
        [HttpGet("invoice/{invoiceId}")]
        public async Task<ActionResult<IEnumerable<PaymentModeInfo>>> GetPaymentModeInfosByInvoiceId(int invoiceId)
        {
            var paymentModeInfos = await _paymentModeInfoService.GetPaymentModeInfosByInvoiceIdAsync(invoiceId);
            return Ok(paymentModeInfos);
        }

        // PUT: api/PaymentModeInfo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymentModeInfo(int id, PaymentModeInfo paymentModeInfo)
        {
            try
            {
                await _paymentModeInfoService.UpdatePaymentModeInfoAsync(id, paymentModeInfo);
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

        // POST: api/PaymentModeInfo
        [HttpPost]
        public async Task<ActionResult<PaymentModeInfo>> PostPaymentModeInfo(PaymentModeInfo paymentModeInfo)
        {
            var createdPaymentModeInfo = await _paymentModeInfoService.CreatePaymentModeInfoAsync(paymentModeInfo);
            return CreatedAtAction("GetPaymentModeInfo", new { id = createdPaymentModeInfo.PaymentModeInfoId }, createdPaymentModeInfo);
        }

        // DELETE: api/PaymentModeInfo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentModeInfo(int id)
        {
            try
            {
                await _paymentModeInfoService.DeletePaymentModeInfoAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
} 