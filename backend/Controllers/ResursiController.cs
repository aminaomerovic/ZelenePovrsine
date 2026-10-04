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
    public class ResursiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResursiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resurs>>> GetSvi()
        {
            return await _context.Resursi.ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "Nadzornik,Administrator")]
        public async Task<ActionResult<Resurs>> Kreiraj(ResursCreateDto dto)
        {
            var resurs = new Resurs
            {
                Naziv = dto.Naziv,
                Tip = dto.Tip,
                JedinicaMere = dto.JedinicaMere,
                Kolicina = dto.Kolicina,
                CenaPoJedinici = dto.CenaPoJedinici
            };

            _context.Resursi.Add(resurs);
            await _context.SaveChangesAsync();

            return Ok(resurs);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Obrisi(int id)
        {
            var resurs = await _context.Resursi.FindAsync(id);
            if (resurs == null) return NotFound();

            _context.Resursi.Remove(resurs);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}