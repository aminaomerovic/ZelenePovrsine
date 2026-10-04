using System.ComponentModel.DataAnnotations;

namespace ZelenePovrsineAPI.Models
{
    public enum TipObavestenja
    {
        StatusPrijave,
        NoveSadnice,
        EkoAkcija,
        InternaKomunikacija
    }

    public class Obavestenje
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Naslov { get; set; } = string.Empty;

        [Required]
        public string Sadrzaj { get; set; } = string.Empty;

        [Required]
        public TipObavestenja Tip { get; set; }

        public DateTime Datum { get; set; } = DateTime.UtcNow;

        public bool Procitano { get; set; } = false;

        [Required]
        public int KorisnikId { get; set; }
        public Korisnik? Korisnik { get; set; }

        public int? PrijavaProblemaId { get; set; }
        public PrijavaProblema? PrijavaProblema { get; set; }
    }
}
