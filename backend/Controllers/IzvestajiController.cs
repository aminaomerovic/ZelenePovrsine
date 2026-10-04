using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZelenePovrsineAPI.Data;
using ZelenePovrsineAPI.Models;

namespace ZelenePovrsineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Nadzornik,Administrator")]
    public class IzvestajiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IzvestajiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Broj prijavljenih i rešenih problema (ukupno i po statusu)
        [HttpGet("prijave-status")]
        public async Task<ActionResult<object>> PrijavePoStatusu()
        {
            var podaci = await _context.PrijaveProblema
                .GroupBy(p => p.Status)
                .Select(g => new { status = g.Key.ToString(), broj = g.Count() })
                .ToListAsync();

            var ukupno = await _context.PrijaveProblema.CountAsync();

            return Ok(new { ukupno, poStatusu = podaci });
        }

        [HttpGet("po-kvartu")]
public async Task<IActionResult> StatistikaPoKvartu()
{
    var podaci = await _context.ZelenePovrsine
        .Include(z => z.Kvart)
        .GroupBy(z => z.Kvart != null ? z.Kvart.Naziv : "Bez kvarta")
        .Select(g => new { kvart = g.Key, brojPovrsina = g.Count() })
        .ToListAsync();

    return Ok(podaci);
}

        // prosecno vreme resavanja prijava
        [HttpGet("prosecno-vreme-resavanja")]
        public async Task<ActionResult<object>> ProsecnoVremeResavanja()
        {
            var resene = await _context.PrijaveProblema
                .Where(p => p.Status == StatusPrijave.Reseno && p.DatumResavanja != null)
                .Select(p => new { p.DatumPrijave, p.DatumResavanja })
                .ToListAsync();

            if (!resene.Any())
                return Ok(new { prosecnoVremeSati = 0, brojResenih = 0 });

            var prosecnoSati = resene
                .Average(p => (p.DatumResavanja!.Value - p.DatumPrijave).TotalHours);

            return Ok(new { prosecnoVremeSati = Math.Round(prosecnoSati, 1), brojResenih = resene.Count });
        }

        // ucestalost intervencija po tipu rada
        [HttpGet("ucestalost-intervencija")]
        public async Task<ActionResult<object>> UcestalostIntervencija()
        {
            var podaci = await _context.RadniNalozi
                .GroupBy(r => r.TipRada)
                .Select(g => new { tipRada = g.Key.ToString(), broj = g.Count() })
                .ToListAsync();

            return Ok(podaci);
        }

        // troskovi po lokciji
        [HttpGet("troskovi-po-lokaciji")]
        public async Task<ActionResult<object>> TroskoviPoLokaciji()
        {
            var podaci = await _context.UtrosciResursa
                .Include(u => u.RadniNalog)
                .GroupBy(u => u.RadniNalog!.ZelenaPovrsinaId)
                .Select(g => new { zelenaPovrsinaId = g.Key, ukupanTrosak = g.Sum(u => u.UkupnaCena) })
                .ToListAsync();

            return Ok(podaci);
        }

        // za planiranje budzeta
        [HttpGet("troskovi-po-mesecu")]
        public async Task<ActionResult<object>> TroskoviPoMesecu()
        {
            var podaci = await _context.UtrosciResursa
                .GroupBy(u => new { u.Datum.Year, u.Datum.Month })
                .Select(g => new
                {
                    godina = g.Key.Year,
                    mesec = g.Key.Month,
                    ukupanTrosak = g.Sum(u => u.UkupnaCena)
                })
                .OrderBy(g => g.godina).ThenBy(g => g.mesec)
                .ToListAsync();

            return Ok(podaci);
        }

        // broj posadjenih biljaka i biodiverzitet
        [HttpGet("eko-pokazatelji")]
        public async Task<ActionResult<object>> EkoPokazatelji()
        {
            var ukupnoBiljaka = await _context.BiljneVrste.CountAsync();

            var poVrsti = await _context.BiljneVrste
                .Where(b => b.Vrsta != null)
                .GroupBy(b => b.Vrsta)
                .Select(g => new { vrsta = g.Key, broj = g.Count() })
                .ToListAsync();

            var poMesecima = await _context.BiljneVrste
                .Where(b => b.DatumSadnje != null)
                .GroupBy(b => new { b.DatumSadnje!.Value.Year, b.DatumSadnje.Value.Month })
                .Select(g => new { godina = g.Key.Year, mesec = g.Key.Month, broj = g.Count() })
                .OrderBy(g => g.godina).ThenBy(g => g.mesec)
                .ToListAsync();

            return Ok(new { ukupnoBiljaka, biodiverzitet = poVrsti, sadnjaPoMesecima = poMesecima });
        }
    }
}
