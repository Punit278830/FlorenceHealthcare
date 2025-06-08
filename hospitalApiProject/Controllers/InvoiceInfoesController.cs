using Hl7.Fhir.ElementModel.Types;
using hospitalApiProject.Models;
using hospitalApiProject.Models.Response;
using hospitalApiProject.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using System;
using DateTime = System.DateTime;

namespace hospitalApiProject.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class InvoiceInfoesController : ControllerBase
  {
    private readonly IInvoiceService _invoiceService;

    public InvoiceInfoesController(IInvoiceService invoiceService)
    {
      _invoiceService = invoiceService;
    }

    [HttpGet]
    public async Task<InvoiceSummaryResponse> GetInvoiceWithPaymentsAsync(
    [FromQuery] string paymentMode,
    [FromQuery] string paymentStatus,
    [FromQuery] string fromDate,
    [FromQuery] string toDate)
    {
      return await _invoiceService.GetInvoiceWithPaymentsAsync(paymentMode, paymentStatus, fromDate, toDate);
    }

    [HttpGet("GetInvoicesForToday")]
    public async Task<IActionResult> GetInvoicesForTodayAsync()
    {
      var invoicesToday = await _invoiceService.GetInvoicesForTodayAsync();
      if (invoicesToday == null || !invoicesToday.Any())
      {
        return NotFound("No invoices found for today.");
      }
      return Ok(invoicesToday);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InvoiceInfo>> GetInvoiceInfo(int id)
    {
      var invoiceInfo = await _invoiceService.GetInvoiceByIdAsync(id);
      if (invoiceInfo == null)
      {
        return NotFound();
      }
      return Ok(invoiceInfo);
    }

    [HttpGet("GetInvoiceinfoByPatientId")]
    public async Task<ActionResult<int>> GetInvoiceInfoByPatientId(int patientId)
    {
      var maxInvoiceId = await _invoiceService.GetInvoiceByPatientIdAsync(patientId);
      if (maxInvoiceId == 0)
      {
        return NotFound();
      }
      return Ok(maxInvoiceId);
    }

    [HttpGet("totalAmount")]
    public async Task<ActionResult<TotalPaymentDetailsResponse>> GetTotalPaymentAmount([FromQuery] string fromDate, [FromQuery] string toDate)
    {
      var result = await _invoiceService.GetTotalPaymentAmountAsync(fromDate, toDate);
      return Ok(result);
    }

    [HttpGet("totalAmountDashboard")]
    public async Task<ActionResult<int>> GetTotalAmount()
    {
      var totalAmount = await _invoiceService.GetTotalAmountAsync();
      return Ok(totalAmount);
    }

    [HttpPost("createInvoice/{patientId}")]
    public async Task<ActionResult> PostInvoiceWithAdditionalItems(int patientId, NewInvoiceDto request)
    {
      try
      {
        var invoice = await _invoiceService.CreateInvoiceAsync(patientId, request);
        return CreatedAtAction(nameof(GetInvoiceInfo), new { id = invoice.InvoiceId }, invoice);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutInvoiceInfo(int id, InvoicePaymentDto invoicePaymentDto)
    {
      try
      {
        await _invoiceService.UpdateInvoiceAsync(id, invoicePaymentDto);
        return NoContent();
      }
      catch (KeyNotFoundException)
      {
        return NotFound();
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpPost("paymentMode")]
    public async Task<ActionResult<PaymentModeInfo>> AddPaymentModeInfo(PaymentModeInfo paymentModeInfo)
    {
      try
      {
        var result = await _invoiceService.AddPaymentModeAsync(paymentModeInfo);
        return Ok(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpPost]
    public async Task<ActionResult<Invoice>> CreateInvoice(Invoice invoice)
    {
      var createdInvoice = await _invoiceService.CreateInvoiceAsync(invoice);
      return CreatedAtAction(nameof(GetInvoiceInfo), new { id = createdInvoice.InvoiceId }, createdInvoice);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvoiceInfo(int id)
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
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}
