using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZelenePovrsineAPI.Data;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrator,Nadzornik")]
    public class BudzetiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BudzetiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSve()
        {
            var budzeti = await _context.Budzeti
                .OrderByDescending(b => b.Godina).ThenByDescending(b => b.Mesec)
                .ToListAsync();
            return Ok(budzeti);
        }

        // planirano vs potroseno za konkretan mesec
        [HttpGet("pregled")]
public async Task<IActionResult> Pregled([FromQuery] int mesec, [FromQuery] int godina)
{
    var budzet = await _context.Budzeti
        .FirstOrDefaultAsync(b => b.Mesec == mesec && b.Godina == godina);

    var potroseno = await _context.UtrosciResursa
        .Where(u => u.Datum.Month == mesec && u.Datum.Year == godina)
        .SumAsync(u => (decimal?)u.UkupnaCena) ?? 0;

    return Ok(new
    {
        mesec,
        godina,
        planiranIznos = budzet != null ? budzet.PlaniranIznos : 0,
        potroseno,
        prekoracen = budzet != null && potroseno > budzet.PlaniranIznos
    });
}

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PostaviBudzet([FromBody] Budzet budzet)
        {
            var postojeci = await _context.Budzeti
                .FirstOrDefaultAsync(b => b.Mesec == budzet.Mesec && b.Godina == budzet.Godina);

            if (postojeci != null)
            {
                postojeci.PlaniranIznos = budzet.PlaniranIznos;
                await _context.SaveChangesAsync();
                return Ok(postojeci);
            }

            _context.Budzeti.Add(budzet);
            await _context.SaveChangesAsync();
            return Ok(budzet);
        }
    }
}