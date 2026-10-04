using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ZelenePovrsineAPI.Data;
using ZelenePovrsineAPI.DTOs;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ObavestenjaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ObavestenjaController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int TrenutniKorisnikId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("moja")]
        public async Task<ActionResult<IEnumerable<Obavestenje>>> GetMoja()
        {
            var korisnikId = TrenutniKorisnikId;
            return await _context.Obavestenja
                .Where(o => o.KorisnikId == korisnikId)
                .OrderByDescending(o => o.Datum)
                .ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<ActionResult<Obavestenje>> Kreiraj(ObavestenjeCreateDto dto)
        {
            var obavestenje = new Obavestenje
            {
                Naslov = dto.Naslov,
                Sadrzaj = dto.Sadrzaj,
                Tip = dto.Tip,
                KorisnikId = dto.KorisnikId,
                PrijavaProblemaId = dto.PrijavaProblemaId
            };

            _context.Obavestenja.Add(obavestenje);
            await _context.SaveChangesAsync();

            return Ok(obavestenje);
        }

        [HttpPut("{id}/procitano")]
        public async Task<IActionResult> OznaciProcitano(int id)
        {
            var obavestenje = await _context.Obavestenja.FindAsync(id);
            if (obavestenje == null) return NotFound();

            if (obavestenje.KorisnikId != TrenutniKorisnikId) return Forbid();

            obavestenje.Procitano = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
