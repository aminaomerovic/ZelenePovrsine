using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZelenePovrsineAPI.Data;
using ZelenePovrsineAPI.DTOs;
using ZelenePovrsineAPI.Models;
using ZelenePovrsineAPI.Services;

namespace ZelenePovrsineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("registracija")]
        public async Task<ActionResult<AuthResponseDto>> Registracija(RegistracijaDto dto)
        {
            if (await _context.Korisnici.AnyAsync(k => k.Email == dto.Email))
                return BadRequest(new { poruka = "Korisnik sa ovim email-om već postoji." });

            var korisnik = new Korisnik
            {
                Ime = dto.Ime,
                Prezime = dto.Prezime,
                Email = dto.Email,
                LozinkaHash = BCrypt.Net.BCrypt.HashPassword(dto.Lozinka),
                Telefon = dto.Telefon,
                // uvek gradjanin
                Uloga = UlogaKorisnika.Gradjanin
            };

            _context.Korisnici.Add(korisnik);
            await _context.SaveChangesAsync();

            var token = _tokenService.GenerisiToken(korisnik);

            return Ok(new AuthResponseDto
            {
                Token = token,
                KorisnikId = korisnik.Id,
                Ime = korisnik.Ime,
                Prezime = korisnik.Prezime,
                Email = korisnik.Email,
                Uloga = korisnik.Uloga.ToString()
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var korisnik = await _context.Korisnici.FirstOrDefaultAsync(k => k.Email == dto.Email);

            if (korisnik == null || !BCrypt.Net.BCrypt.Verify(dto.Lozinka, korisnik.LozinkaHash))
                return Unauthorized(new { poruka = "Pogrešan email ili lozinka." });

            if (!korisnik.Aktivan)
                return Unauthorized(new { poruka = "Nalog je deaktiviran." });

            var token = _tokenService.GenerisiToken(korisnik);

            return Ok(new AuthResponseDto
            {
                Token = token,
                KorisnikId = korisnik.Id,
                Ime = korisnik.Ime,
                Prezime = korisnik.Prezime,
                Email = korisnik.Email,
                Uloga = korisnik.Uloga.ToString()
            });
        }
    }
}
