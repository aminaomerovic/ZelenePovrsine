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
    [Authorize(Roles = "Nadzornik,Administrator")]
    public class KorisniciController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KorisniciController(ApplicationDbContext context)
        {
            _context = context;
        }

        // za dodelu radnog naloga 
        [HttpGet("radnici")]
        public async Task<ActionResult<object>> GetRadnici()
        {
            var radnici = await _context.Korisnici
                .Where(k => k.Uloga == UlogaKorisnika.Radnik && k.Aktivan)
                .Select(k => new { k.Id, k.Ime, k.Prezime })
                .ToListAsync();

            return Ok(radnici);
        }

        // lista svih korisnika
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<object>> GetSve()
        {
            var korisnici = await _context.Korisnici
                .Select(k => new
                {
                    k.Id,
                    k.Ime,
                    k.Prezime,
                    k.Email,
                    k.Telefon,
                    k.Uloga,
                    k.Aktivan,
                    k.DatumRegistracije
                })
                .ToListAsync();

            return Ok(korisnici);
        }

        // promena uloge korisnika
        [HttpPut("{id}/uloga")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PromeniUlogu(int id, KorisnikUlogaDto dto)
        {
            var korisnik = await _context.Korisnici.FindAsync(id);
            if (korisnik == null) return NotFound();

            korisnik.Uloga = dto.Uloga;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // aktiviraj/deaktiviraj nalog
        [HttpPut("{id}/aktivan")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PromeniAktivnost(int id, [FromBody] KorisnikAktivanDto dto)
        {
            var korisnik = await _context.Korisnici.FindAsync(id);
            if (korisnik == null) return NotFound();

            korisnik.Aktivan = dto.Aktivan;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}