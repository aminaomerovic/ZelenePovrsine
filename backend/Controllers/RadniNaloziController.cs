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
    public class RadniNaloziController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RadniNaloziController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int TrenutniKorisnikId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<ActionResult<IEnumerable<RadniNalog>>> GetSvi()
        {
            return await _context.RadniNalozi
                .Include(r => r.ZelenaPovrsina)
                .Include(r => r.Nadzornik)
                .Include(r => r.Radnik)
                .Include(r => r.IzvrsenjaRada)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RadniNalog>> GetJedan(int id)
        {
            var nalog = await _context.RadniNalozi
                .Include(r => r.ZelenaPovrsina)
                .Include(r => r.Nadzornik)
                .Include(r => r.Radnik)
                .Include(r => r.IzvrsenjaRada)!
                    .ThenInclude(ir => ir.Radnik)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (nalog == null) return NotFound();
            return nalog;
        }

        [HttpPost]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<ActionResult<RadniNalog>> Kreiraj(RadniNalogCreateDto dto)
        {
            var nalog = new RadniNalog
            {
                TipRada = dto.TipRada,
                Opis = dto.Opis,
                Rok = dto.Rok,
                ZelenaPovrsinaId = dto.ZelenaPovrsinaId,
                PrijavaProblemaId = dto.PrijavaProblemaId,
                RadnikId = dto.RadnikId,
                NadzornikId = TrenutniKorisnikId,
                Status = StatusRadnogNaloga.Otvoren
            };

            _context.RadniNalozi.Add(nalog);

            // nalog vezan za prijavu problema
            if (dto.PrijavaProblemaId.HasValue)
            {
                var prijava = await _context.PrijaveProblema.FindAsync(dto.PrijavaProblemaId.Value);
                if (prijava != null)
                    prijava.Status = StatusPrijave.UObradi;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJedan), new { id = nalog.Id }, nalog);
        }

        [HttpPut("{id}/dodeli")]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<IActionResult> DodeliRadnika(int id, RadniNalogDodeliDto dto)
        {
            var nalog = await _context.RadniNalozi.FindAsync(id);
            if (nalog == null) return NotFound();

            var postojiRadnik = await _context.Korisnici
                .AnyAsync(k => k.Id == dto.RadnikId && k.Uloga == UlogaKorisnika.Radnik);
            if (!postojiRadnik) return BadRequest(new { poruka = "Radnik ne postoji." });

            nalog.RadnikId = dto.RadnikId;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Nadzornik,Administrator,Radnik")]
        public async Task<IActionResult> IzmeniStatus(int id, RadniNalogUpdateStatusDto dto)
        {
            var nalog = await _context.RadniNalozi.FindAsync(id);
            if (nalog == null) return NotFound();

            nalog.Status = dto.Status;

            // zavrsen nalog vezan za prijavu prob
            if (dto.Status == StatusRadnogNaloga.Zavrsen && nalog.PrijavaProblemaId.HasValue)
            {
                var prijava = await _context.PrijaveProblema.FindAsync(nalog.PrijavaProblemaId.Value);
                if (prijava != null)
                {
                    prijava.Status = StatusPrijave.Reseno;
                    prijava.DatumResavanja = DateTime.UtcNow;

                   _context.Obavestenja.Add(new Obavestenje
                        {
                            Naslov = "Vaša prijava je rešena",
                            Sadrzaj = $"Problem koji ste prijavili ({prijava.Kategorija}: {prijava.Opis}) je uspešno rešen.",
                            Tip = TipObavestenja.StatusPrijave,
                            KorisnikId = prijava.GradjaninId,
                            PrijavaProblemaId = prijava.Id
                        });
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("moji")]
        [Authorize(Roles = "Radnik")]
        public async Task<ActionResult<IEnumerable<RadniNalog>>> GetMoji()
        {
            var radnikId = TrenutniKorisnikId;

            var nalozi = await _context.RadniNalozi
                .Include(r => r.ZelenaPovrsina)
                .Where(r => r.RadnikId == radnikId)
                .ToListAsync();

            return nalozi;
        }
    }
}
