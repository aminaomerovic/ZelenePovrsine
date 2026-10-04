using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZelenePovrsineAPI.Data;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class KvartoviController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KvartoviController(ApplicationDbContext context)
        {
            _context = context;
        }

        // lista kavrtova
        [HttpGet]
        public async Task<IActionResult> GetSve()
        {
            var kvartovi = await _context.Kvartovi.OrderBy(k => k.Naziv).ToListAsync();
            return Ok(kvartovi);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPoId(int id)
        {
            var kvart = await _context.Kvartovi.FindAsync(id);
            if (kvart == null) return NotFound();
            return Ok(kvart);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Dodaj([FromBody] Kvart kvart)
        {
            _context.Kvartovi.Add(kvart);
            await _context.SaveChangesAsync();
            return Ok(kvart);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Izmeni(int id, [FromBody] Kvart izmena)
        {
            var kvart = await _context.Kvartovi.FindAsync(id);
            if (kvart == null) return NotFound();

            kvart.Naziv = izmena.Naziv;
            await _context.SaveChangesAsync();
            return Ok(kvart);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Obrisi(int id)
        {
            var kvart = await _context.Kvartovi.FindAsync(id);
            if (kvart == null) return NotFound();

            var koristiSe = await _context.ZelenePovrsine.AnyAsync(z => z.KvartId == id);
            if (koristiSe)
                return BadRequest("Kvart se koristi kod postojecih zelenih površina i ne može se obrisati");

            _context.Kvartovi.Remove(kvart);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}