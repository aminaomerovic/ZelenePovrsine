using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZelenePovrsineAPI.Models
{
    public enum UlogaKorisnika
    {
        Gradjanin,
        Radnik,
        Nadzornik,
        Administrator
    }

    public class Korisnik
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Ime { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Prezime { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string LozinkaHash { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Telefon { get; set; }

        public DateTime DatumRegistracije { get; set; } = DateTime.UtcNow;

        public bool Aktivan { get; set; } = true;

        [Required]
        public UlogaKorisnika Uloga { get; set; }

        // ove kolekcije sluze samo EF-u za relacije, ne saljemo ih nazad u JSON-u
        // (u suprotnom pravimo beskonacnu petlju: Korisnik -> RadniNalog -> Korisnik -> ...)
        [JsonIgnore]
        public ICollection<RadniNalog>? RadniNaloziKaoNadzornik { get; set; }
        [JsonIgnore]
        public ICollection<RadniNalog>? RadniNaloziKaoRadnik { get; set; }
        [JsonIgnore]
        public ICollection<IzvrsenjeRada>? IzvrsenjaRada { get; set; }
        [JsonIgnore]
        public ICollection<PrijavaProblema>? PrijavaProblema { get; set; }
        [JsonIgnore]
        public ICollection<Obavestenje>? Obavestenja { get; set; }
    }
}