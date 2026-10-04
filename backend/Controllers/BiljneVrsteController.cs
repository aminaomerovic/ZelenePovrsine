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
    public class BiljneVrsteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BiljneVrsteController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BiljnaVrsta>>> GetSve()
        {
            return await _context.BiljneVrste.ToListAsync();
        }

        [HttpGet("po-povrsini/{zelenaPovrsinaId}")]
        public async Task<ActionResult<IEnumerable<BiljnaVrsta>>> GetPoPovrsini(int zelenaPovrsinaId)
        {
            return await _context.BiljneVrste
                .Where(b => b.ZelenaPovrsinaId == zelenaPovrsinaId)
                .ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<ActionResult<BiljnaVrsta>> Kreiraj(BiljnaVrstaCreateDto dto)
        {
            var postojiPovrsina = await _context.ZelenePovrsine.AnyAsync(z => z.Id == dto.ZelenaPovrsinaId);
            if (!postojiPovrsina) return BadRequest(new { poruka = "Zelena površina ne postoji." });

            var biljka = new BiljnaVrsta
            {
                Naziv = dto.Naziv,
                Vrsta = dto.Vrsta,
                DatumSadnje = dto.DatumSadnje,
                EkoloskiPokazatelj = dto.EkoloskiPokazatelj,
                ZelenaPovrsinaId = dto.ZelenaPovrsinaId
            };

            _context.BiljneVrste.Add(biljka);
            await _context.SaveChangesAsync();

            return Ok(biljka);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<IActionResult> Obrisi(int id)
        {
            var biljka = await _context.BiljneVrste.FindAsync(id);
            if (biljka == null) return NotFound();

            _context.BiljneVrste.Remove(biljka);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
