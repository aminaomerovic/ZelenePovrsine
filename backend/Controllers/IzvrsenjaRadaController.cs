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
    public class IzvrsenjaRadaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IzvrsenjaRadaController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int TrenutniKorisnikId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<ActionResult<IEnumerable<IzvrsenjeRada>>> GetSva()
        {
            return await _context.IzvrsenjaRada
                .Include(i => i.RadniNalog)
                .Include(i => i.Radnik)
                .ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "Radnik")]
        public async Task<ActionResult<IzvrsenjeRada>> Kreiraj(IzvrsenjeRadaCreateDto dto)
        {
            var nalog = await _context.RadniNalozi.FindAsync(dto.RadniNalogId);
            if (nalog == null) return BadRequest(new { poruka = "Radni nalog ne postoji." });

            var izvrsenje = new IzvrsenjeRada
            {
                RadniNalogId = dto.RadniNalogId,
                TrajanjeMin = dto.TrajanjeMin,
                RadnikId = TrenutniKorisnikId
            };

            _context.IzvrsenjaRada.Add(izvrsenje);

            if (nalog.Status == StatusRadnogNaloga.Otvoren)
                nalog.Status = StatusRadnogNaloga.UToku;

            await _context.SaveChangesAsync();

            return Ok(izvrsenje);
        }
    }
}
