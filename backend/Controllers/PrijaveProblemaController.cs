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
    public class PrijaveProblemaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrijaveProblemaController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int TrenutniKorisnikId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<ActionResult<IEnumerable<PrijavaProblema>>> GetSve()
        {
            return await _context.PrijaveProblema
                .Include(p => p.Gradjanin)
                .Include(p => p.ZelenaPovrsina)
                .ToListAsync();
        }

        [HttpGet("moje")]
        [Authorize(Roles = "Gradjanin")]
        public async Task<ActionResult<IEnumerable<PrijavaProblema>>> GetMoje()
        {
            var gradjaninId = TrenutniKorisnikId;
            return await _context.PrijaveProblema
                .Include(p => p.ZelenaPovrsina)
                .Where(p => p.GradjaninId == gradjaninId)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrijavaProblema>> GetJedna(int id)
        {
            var prijava = await _context.PrijaveProblema
                .Include(p => p.Gradjanin)
                .Include(p => p.ZelenaPovrsina)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (prijava == null) return NotFound();
            return prijava;
        }

        [HttpPost]
        [Authorize(Roles = "Gradjanin")]
        public async Task<ActionResult<PrijavaProblema>> Kreiraj(PrijavaProblemaCreateDto dto)
        {
            var postojiPovrsina = await _context.ZelenePovrsine.AnyAsync(z => z.Id == dto.ZelenaPovrsinaId);
            if (!postojiPovrsina) return BadRequest(new { poruka = "Zelena površina ne postoji." });

            var prijava = new PrijavaProblema
            {
                Opis = dto.Opis,
                Kategorija = dto.Kategorija,
                Fotografija = dto.Fotografija,
                KoordinateLat = dto.KoordinateLat,
                KoordinateLng = dto.KoordinateLng,
                ZelenaPovrsinaId = dto.ZelenaPovrsinaId,
                GradjaninId = TrenutniKorisnikId,
                Status = StatusPrijave.Primljeno
            };

            _context.PrijaveProblema.Add(prijava);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJedna), new { id = prijava.Id }, prijava);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<IActionResult> IzmeniStatus(int id, PrijavaProblemaUpdateStatusDto dto)
        {
            var prijava = await _context.PrijaveProblema.FindAsync(id);
            if (prijava == null) return NotFound();

            prijava.Status = dto.Status;

            if (dto.Status == StatusPrijave.Reseno)
                prijava.DatumResavanja = DateTime.UtcNow;

                    _context.Obavestenja.Add(new Obavestenje
            {
                Naslov = "Status prijave ažuriran",
                Sadrzaj = $"Status prijave ({prijava.Kategorija}: {prijava.Opis}) je promenjen u: {dto.Status}",
                Tip = TipObavestenja.StatusPrijave,
                KorisnikId = prijava.GradjaninId,
                PrijavaProblemaId = prijava.Id
            });

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
