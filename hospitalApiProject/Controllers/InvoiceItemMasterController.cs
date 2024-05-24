using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hospitalApiProject.Models;
using Microsoft.Extensions.Options;

namespace hospitalApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class InvoiceItemMasterController : ControllerBase{
        private readonly FlorenceDbContext _context;

        public InvoiceItemMasterController(FlorenceDbContext context)
        {
            _context = context;
        }

    [HttpOptions]


    [HttpGet]
    public async Task<ActionResult<IEnumerable<InvoiceItemMaster>>> GetInvoiceItemInfo()
    {

      var appointmentInfo = await _context.InvoiceItemMasters.ToListAsync();

      return appointmentInfo;
    }

    [HttpPost]
    public async Task<ActionResult<InvoiceItemMaster>> PostInvoiceItem(InvoiceItemMaster InvoiceItemInfo)
    {

      _context.InvoiceItemMasters.Add(InvoiceItemInfo);
      await _context.SaveChangesAsync();

      return Ok(new { message = "Invoice Item Added" });
    }
  }
}
