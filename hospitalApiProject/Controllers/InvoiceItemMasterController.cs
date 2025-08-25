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

    public class InvoiceItemMasterController : WithHospitalController{
        public InvoiceItemMasterController(FlorenceDbContext context) : base(context)
        {
        }

    [HttpOptions]


    [HttpGet]
    public async Task<ActionResult<IEnumerable<InvoiceItemMaster>>> GetInvoiceItemInfo()
    {

      var hospitalId = GetHospitalIdFromHeader();
      var query = _context.InvoiceItemMasters.AsQueryable();
      if (hospitalId != null)
      {
        query = query.Where(i => i.HospitalId == hospitalId);
      }
      var appointmentInfo = await query.ToListAsync();

      return appointmentInfo;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutInvoiceItemMaster(int id, InvoiceItemMaster invoiceItemMaster)
    {
      if (id != invoiceItemMaster.ItemId)
      {
        return BadRequest();
      }

      var hospitalId = GetHospitalIdFromHeader();
      if (hospitalId != null) invoiceItemMaster.HospitalId = hospitalId;

      _context.Entry(invoiceItemMaster).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!InvoiceItemMasterExists(id))
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

    private bool InvoiceItemMasterExists(int id)
    {
      return _context.InvoiceItemMasters.Any(e => e.ItemId == id);
    }

    [HttpPost]
    public async Task<ActionResult<InvoiceItemMaster>> PostInvoiceItem(InvoiceItemMaster InvoiceItemInfo)
    {

      var hospitalId = GetHospitalIdFromHeader();
      InvoiceItemInfo.HospitalId = hospitalId;
      _context.InvoiceItemMasters.Add(InvoiceItemInfo);
      await _context.SaveChangesAsync();

      return Ok(new { message = "Invoice Item Added" });
    }
  }
}
