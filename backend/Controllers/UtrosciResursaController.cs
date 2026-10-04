using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZelenePovrsineAPI.Data;
using ZelenePovrsineAPI.DTOs;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UtrosciResursaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UtrosciResursaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UtrosakResursa>>> GetSvi()
        {
            return await _context.UtrosciResursa
                .Include(u => u.Resurs)
                .Include(u => u.RadniNalog)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<UtrosakResursa>> Kreiraj(UtrosakResursaCreateDto dto)
        {
            var resurs = await _context.Resursi.FindAsync(dto.ResursId);
            var nalog = await _context.RadniNalozi.FindAsync(dto.RadniNalogId);

            if (resurs == null) return BadRequest(new { poruka = "Resurs ne postoji." });
            if (nalog == null) return BadRequest(new { poruka = "Radni nalog ne postoji." });

            var utrosak = new UtrosakResursa
            {
                ResursId = dto.ResursId,
                RadniNalogId = dto.RadniNalogId,
                Kolicina = dto.Kolicina,
                UkupnaCena = (decimal)dto.Kolicina * resurs.CenaPoJedinici
            };

            resurs.Kolicina -= dto.Kolicina;

            _context.UtrosciResursa.Add(utrosak);
            await _context.SaveChangesAsync();

            return Ok(utrosak);
        }

        [HttpGet("po-lokaciji/{zelenaPovrsinaId}")]
        public async Task<ActionResult<object>> TroskoviPoLokaciji(int zelenaPovrsinaId)
        {
            var ukupno = await _context.UtrosciResursa
                .Include(u => u.RadniNalog)
                .Where(u => u.RadniNalog!.ZelenaPovrsinaId == zelenaPovrsinaId)
                .SumAsync(u => u.UkupnaCena);

            return Ok(new { zelenaPovrsinaId, ukupanTrosak = ukupno });
        }
    }
}