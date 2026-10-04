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
    public class ZelenePovrsineController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ZelenePovrsineController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSve([FromQuery] int? kvartId)
        {
            var upit = _context.ZelenePovrsine
                .Include(z => z.Kvart)
                .Include(z => z.BiljneVrste)
                .AsQueryable();

            if (kvartId.HasValue)
                upit = upit.Where(z => z.KvartId == kvartId);

            var povrsine = await upit.ToListAsync();
            return Ok(povrsine);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ZelenaPovrsina>> GetJedna(int id)
        {
            var zp = await _context.ZelenePovrsine
                .Include(z => z.BiljneVrste)
                .Include(z => z.Kvart)
                .FirstOrDefaultAsync(z => z.Id == id);

            if (zp == null) return NotFound();
            return zp;
        }

        [HttpPost]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<ActionResult<ZelenaPovrsina>> Kreiraj(ZelenaPovrsinaCreateDto dto)
        {
            var zp = new ZelenaPovrsina
            {
                Naziv = dto.Naziv,
                Tip = dto.Tip,
                Adresa = dto.Adresa,
                Grad = dto.Grad,
                Povrsina = dto.Povrsina,
                Opis = dto.Opis,
                DatumSadnje = dto.DatumSadnje,
                KoordinateLat = dto.KoordinateLat,
                KoordinateLng = dto.KoordinateLng,
                KvartId = dto.KvartId,
                Status = StatusZelenePovrsine.Uredno
            };

            _context.ZelenePovrsine.Add(zp);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJedna), new { id = zp.Id }, zp);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<IActionResult> Izmeni(int id, ZelenaPovrsinaUpdateDto dto)
        {
            var zp = await _context.ZelenePovrsine.FindAsync(id);
            if (zp == null) return NotFound();

            zp.Naziv = dto.Naziv;
            zp.Tip = dto.Tip;
            zp.Adresa = dto.Adresa;
            zp.Grad = dto.Grad;
            zp.Povrsina = dto.Povrsina;
            zp.Opis = dto.Opis;
            zp.DatumSadnje = dto.DatumSadnje;
            zp.KoordinateLat = dto.KoordinateLat;
            zp.KoordinateLng = dto.KoordinateLng;
            zp.Status = dto.Status;
            zp.PoslednjeOdrzavanje = dto.PoslednjeOdrzavanje;
            zp.KvartId = dto.KvartId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Obrisi(int id)
        {
            var zp = await _context.ZelenePovrsine.FindAsync(id);
            if (zp == null) return NotFound();

            _context.ZelenePovrsine.Remove(zp);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}